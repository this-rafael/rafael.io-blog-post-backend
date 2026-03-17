#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");
const matter = require("gray-matter");

// Patch fs-extra's remove to tolerate EBUSY errors on Windows (sharp file locking)
const fse = require(
  require.resolve("fs-extra", { paths: [require.resolve("@strapi/strapi")] }),
);
const originalRemove = fse.remove.bind(fse);
fse.remove = async function patchedRemove(...args) {
  try {
    return await originalRemove(...args);
  } catch (err) {
    if (err.code === "EBUSY") return;
    throw err;
  }
};

const strapiFactory = require("@strapi/strapi");

const ARTIGO_UID = "api::artigo.artigo";
const args = new Set(process.argv.slice(2));
const isDryRun = args.has("--dry-run");
const publishIncomplete = args.has("--publish-incomplete");

const frontendRoot = process.env.POSTS_SOURCE_ROOT
  ? path.resolve(process.env.POSTS_SOURCE_ROOT)
  : path.resolve(__dirname, "..", "..", "rafael.io");

const postsDir = process.env.POSTS_SOURCE_DIR
  ? path.resolve(process.env.POSTS_SOURCE_DIR)
  : path.join(frontendRoot, "content", "posts");

const metadataFile = process.env.POSTS_METADATA_FILE
  ? path.resolve(process.env.POSTS_METADATA_FILE)
  : path.join(frontendRoot, "src", "data", "articles.json");

const publicDir = process.env.POSTS_PUBLIC_DIR
  ? path.resolve(process.env.POSTS_PUBLIC_DIR)
  : path.join(frontendRoot, "public");

function inferMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case ".webp":
      return "image/webp";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

function slugFromFilename(filename) {
  return filename.replace(/^\d+-/, "").replace(/\.md$/, "");
}

function estimateReadingTime(content) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function stripLeadingWarningBlock(content) {
  return content.replace(/^>\s*⚠️.*(?:\r?\n>.*)*(?:\r?\n){1,2}/, "").trim();
}

function firstParagraph(content) {
  const cleaned = stripLeadingWarningBlock(content)
    .split(/\r?\n\r?\n/)
    .map((chunk) => chunk.trim())
    .find(Boolean);

  if (!cleaned) {
    return "";
  }

  return cleaned
    .replace(/^#+\s*/, "")
    .replace(/[*_`>#-]/g, "")
    .trim();
}

function loadMetadata() {
  const raw = fs.readFileSync(metadataFile, "utf8").replace(/^\uFEFF/, "");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

function loadPosts(metadata) {
  const metadataById = new Map(metadata.map((entry) => [entry.id, entry]));

  return fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((filename) => {
      const absolutePath = path.join(postsDir, filename);
      const raw = fs.readFileSync(absolutePath, "utf8");
      const { data, content } = matter(raw);
      const slug = slugFromFilename(filename);
      const articleMeta = metadataById.get(data.id);
      const coverPath =
        typeof data.image === "string"
          ? data.image
          : (articleMeta?.imageUrl ?? "");
      const normalizedContent = content.trim();
      const issues = [];

      if (!articleMeta) {
        issues.push("metadata-missing");
      }

      if (/^>\s*⚠️/m.test(normalizedContent)) {
        issues.push("content-warning");
      }

      if (!data.url && !articleMeta?.linkedInUrl) {
        issues.push("linkedin-url-missing");
      }

      return {
        legacyId: data.id,
        title: data.title,
        slug,
        description:
          articleMeta?.description ?? firstParagraph(normalizedContent),
        content: normalizedContent,
        labels: Array.isArray(data.labels)
          ? data.labels
          : (articleMeta?.labels ?? []),
        linkedinUrl: data.url ?? articleMeta?.linkedInUrl ?? "",
        coverRelativePath: coverPath,
        readingTime: estimateReadingTime(
          stripLeadingWarningBlock(normalizedContent),
        ),
        extracted: data.extracted !== false,
        issues,
      };
    })
    .filter((post) => post.extracted);
}

function resolveCoverPath(relativePath) {
  if (!relativePath) {
    return null;
  }

  const normalized = relativePath.replace(/^\//, "");
  const absolutePath = path.join(publicDir, normalized);
  return fs.existsSync(absolutePath) ? absolutePath : null;
}

function syncJsonFiles(sourceDir, targetDir) {
  if (!fs.existsSync(sourceDir)) {
    return;
  }

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      syncJsonFiles(sourcePath, targetPath);
      continue;
    }

    if (entry.isFile() && path.extname(entry.name) === ".json") {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

function prepareRuntimeArtifacts() {
  const projectRoot = path.resolve(__dirname, "..");
  const tscBin = path.join(
    projectRoot,
    "node_modules",
    "typescript",
    "bin",
    "tsc",
  );
  const sourceSrcDir = path.join(projectRoot, "src");
  const distSrcDir = path.join(projectRoot, "dist", "src");
  const publicUploadsDir = path.join(projectRoot, "public", "uploads");

  execFileSync(process.execPath, [tscBin, "-p", "tsconfig.json"], {
    cwd: projectRoot,
    stdio: "inherit",
  });

  syncJsonFiles(sourceSrcDir, distSrcDir);
  fs.mkdirSync(publicUploadsDir, { recursive: true });
}

async function bootstrapStrapi() {
  prepareRuntimeArtifacts();
  const appContext = await strapiFactory.compile();
  return strapiFactory(appContext).load();
}

async function findExistingArticle(strapi, post) {
  const results = await strapi.entityService.findMany(ARTIGO_UID, {
    filters: {
      $or: [{ legacyId: post.legacyId }, { slug: post.slug }],
    },
    populate: { cover: true },
    publicationState: "preview",
  });

  return Array.isArray(results) ? (results[0] ?? null) : null;
}

async function syncCover(strapi, entity, coverFilePath) {
  if (!coverFilePath) {
    return false;
  }

  const existingName = entity.cover?.name;
  const targetName = path.basename(coverFilePath);

  if (existingName === targetName) {
    return false;
  }

  const stats = fs.statSync(coverFilePath);

  try {
    await strapi
      .plugin("upload")
      .service("upload")
      .uploadToEntity(
        {
          id: entity.id,
          model: ARTIGO_UID,
          field: "cover",
        },
        {
          path: coverFilePath,
          name: targetName,
          type: inferMimeType(coverFilePath),
          size: stats.size,
        },
      );
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.warn(
      `cover upload skipped for ${entity.slug ?? entity.id}: ${reason}`,
    );
    return false;
  }

  return true;
}

async function run() {
  const metadata = loadMetadata();
  const posts = loadPosts(metadata);

  if (posts.length === 0) {
    throw new Error("No hardcoded posts were found to import.");
  }

  console.log(`Found ${posts.length} hardcoded posts to process.`);

  if (isDryRun) {
    posts.forEach((post) => {
      const mode =
        post.issues.length > 0 && !publishIncomplete ? "draft" : "published";
      console.log(
        `- ${post.slug}: ${mode}${post.issues.length ? ` [${post.issues.join(", ")}]` : ""}`,
      );
    });

    return;
  }

  const strapi = await bootstrapStrapi();
  const summary = {
    created: 0,
    updated: 0,
    coversUploaded: 0,
    drafts: 0,
  };

  try {
    for (const post of posts) {
      const publishedAt =
        post.issues.length > 0 && !publishIncomplete ? null : new Date();
      const data = {
        legacyId: post.legacyId,
        title: post.title,
        slug: post.slug,
        description: post.description,
        content: post.content,
        labels: post.labels,
        linkedinUrl: post.linkedinUrl,
        readingTime: post.readingTime,
        publishedAt,
      };

      const existing = await findExistingArticle(strapi, post);
      const entity = existing
        ? await strapi.entityService.update(ARTIGO_UID, existing.id, {
            data,
            populate: { cover: true },
          })
        : await strapi.entityService.create(ARTIGO_UID, {
            data,
            populate: { cover: true },
          });

      if (existing) {
        summary.updated += 1;
      } else {
        summary.created += 1;
      }

      if (!publishedAt) {
        summary.drafts += 1;
      }

      const coverFilePath = resolveCoverPath(post.coverRelativePath);
      const coverUploaded = await syncCover(strapi, entity, coverFilePath);

      if (coverUploaded) {
        summary.coversUploaded += 1;
      }

      console.log(
        `${existing ? "updated" : "created"}: ${post.slug}${
          post.issues.length ? ` [${post.issues.join(", ")}]` : ""
        }`,
      );
    }
  } finally {
    await strapi.destroy();
  }

  console.log("\nImport summary:");
  console.log(`- created: ${summary.created}`);
  console.log(`- updated: ${summary.updated}`);
  console.log(`- covers uploaded: ${summary.coversUploaded}`);
  console.log(`- drafts: ${summary.drafts}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
