#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = __dirname;

if (fs.existsSync(path.join(root, "config", "database.ts"))) {
  console.log("Project already set up. Nothing to do.\n");
  process.exit(0);
}

function write(rel, content) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
  console.log(`created: ${rel}`);
}

console.log("\nSetting up rafael.io Strapi backend...\n");

const artigoSchema =
  JSON.stringify(
    {
      kind: "collectionType",
      collectionName: "artigos",
      info: {
        singularName: "artigo",
        pluralName: "artigos",
        displayName: "Artigo",
        description: "Blog posts rendered by rafael.io",
      },
      options: {
        draftAndPublish: true,
      },
      pluginOptions: {},
      attributes: {
        legacyId: {
          type: "integer",
          unique: true,
        },
        title: {
          type: "string",
          required: true,
          maxLength: 255,
        },
        slug: {
          type: "uid",
          targetField: "title",
          required: true,
        },
        description: {
          type: "text",
        },
        content: {
          type: "text",
          required: true,
        },
        cover: {
          type: "media",
          multiple: false,
          required: false,
          allowedTypes: ["images"],
        },
        labels: {
          type: "json",
        },
        linkedinUrl: {
          type: "string",
        },
        readingTime: {
          type: "integer",
          min: 1,
        },
      },
    },
    null,
    2,
  ) + "\n";

const files = {
  "config/server.ts": `export default ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  url: env("PUBLIC_URL", "http://localhost:1337"),
  app: {
    keys: env.array("APP_KEYS", ["dev-key-1", "dev-key-2", "dev-key-3", "dev-key-4"]),
  },
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },
});
`,
  "config/admin.ts": `export default ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET", "changeMe"),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT", "changeMe"),
  },
  transfer: {
    token: {
      salt: env("TRANSFER_TOKEN_SALT", "changeMe"),
    },
  },
  flags: {
    nps: env.bool("FLAG_NPS", true),
    promoteEE: env.bool("FLAG_PROMOTE_EE", true),
  },
});
`,
  "config/api.ts": `export default {
  rest: {
    maxLimit: 100,
    defaultLimit: 25,
    withCount: true,
  },
};
`,
  "config/database.ts": `import path from "path";

export default ({ env }) => {
  const filename = env("DATABASE_FILENAME", ".tmp/data.db");

  return {
    connection: {
      client: "sqlite",
      connection: {
        filename: path.isAbsolute(filename)
          ? filename
          : path.join(process.cwd(), filename),
      },
      useNullAsDefault: true,
    },
  };
};
`,
  "config/middlewares.ts": `export default [
  "strapi::logger",
  "strapi::errors",
  "strapi::security",
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
`,
  "config/plugins.ts": `export default ({ env }) => ({
  "users-permissions": {
    config: {
      jwt: {
        expiresIn: "7d",
      },
    },
  },
});
`,
  "src/index.ts": `const PUBLIC_ACTIONS = [
  "api::artigo.artigo.find",
  "api::artigo.artigo.findOne",
  "plugin::upload.content-api.find",
  "plugin::upload.content-api.findOne",
];

export default {
  register() {},

  async bootstrap({ strapi }) {
    const publicRole = await strapi.db
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: "public" } });

    if (!publicRole) {
      return;
    }

    for (const action of PUBLIC_ACTIONS) {
      const existingPermission = await strapi.db
        .query("plugin::users-permissions.permission")
        .findOne({
          where: {
            action,
            role: publicRole.id,
          },
        });

      if (existingPermission) {
        if (!existingPermission.enabled) {
          await strapi.db
            .query("plugin::users-permissions.permission")
            .update({
              where: { id: existingPermission.id },
              data: { enabled: true },
            });
        }

        continue;
      }

      await strapi.db.query("plugin::users-permissions.permission").create({
        data: {
          action,
          role: publicRole.id,
          enabled: true,
        },
      });
    }
  },
};
`,
  "src/api/artigo/content-types/artigo/schema.json": artigoSchema,
  "src/api/artigo/controllers/artigo.ts": `import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::artigo.artigo");
`,
  "src/api/artigo/routes/artigo.ts": `export default {
  routes: [
    {
      method: "GET",
      path: "/artigos",
      handler: "artigo.find",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/artigos/:id",
      handler: "artigo.findOne",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/artigos",
      handler: "artigo.create",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/artigos/:id",
      handler: "artigo.update",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "DELETE",
      path: "/artigos/:id",
      handler: "artigo.delete",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
`,
  "src/api/artigo/services/artigo.ts": `import { factories } from "@strapi/strapi";

export default factories.createCoreService("api::artigo.artigo");
`,
  "database/.gitkeep": "",
  "public/uploads/.gitkeep": "",
};

for (const [rel, content] of Object.entries(files)) {
  write(rel, content);
}

console.log("\nProject structure created.\n");
console.log("Next steps:");
console.log("  1. cp .env.example .env");
console.log("  2. pnpm install");
console.log("  3. pnpm develop");
console.log("\nAdmin: http://localhost:1337/admin\n");
