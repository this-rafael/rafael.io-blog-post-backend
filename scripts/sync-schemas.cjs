#!/usr/bin/env node

/**
 * Copies JSON schema files from src/ to dist/src/ so Strapi's API loader
 * can find content-type definitions. TypeScript's tsc does not emit JSON
 * files even with resolveJsonModule enabled.
 */

const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const srcDir = path.join(projectRoot, "src");
const distSrcDir = path.join(projectRoot, "dist", "src");

function syncJsonFiles(source, target) {
  if (!fs.existsSync(source)) return;

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const srcPath = path.join(source, entry.name);
    const dstPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      syncJsonFiles(srcPath, dstPath);
    } else if (entry.isFile() && path.extname(entry.name) === ".json") {
      fs.mkdirSync(path.dirname(dstPath), { recursive: true });
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}

// Ensure dist/src exists (tsc may not have run yet)
fs.mkdirSync(distSrcDir, { recursive: true });
syncJsonFiles(srcDir, distSrcDir);

// Also ensure public/uploads exists
fs.mkdirSync(path.join(projectRoot, "public", "uploads"), { recursive: true });

console.log("Schema files synced to dist/src/");
