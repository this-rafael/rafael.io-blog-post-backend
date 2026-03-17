#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const backendUrl =
  process.env.STRAPI_ADMIN_BACKEND_URL || process.env.PUBLIC_URL;

if (!backendUrl) {
  console.log(
    "Admin backend URL patch skipped: no STRAPI_ADMIN_BACKEND_URL or PUBLIC_URL set."
  );
  process.exit(0);
}

const buildDir = path.join(__dirname, "..", "dist", "build");

if (!fs.existsSync(buildDir)) {
  console.log("Admin backend URL patch skipped: dist/build not found.");
  process.exit(0);
}

let patchedFiles = 0;

for (const file of fs.readdirSync(buildDir)) {
  if (!file.endsWith(".js")) continue;

  const filePath = path.join(buildDir, file);
  const originalContent = fs.readFileSync(filePath, "utf8");

  if (!originalContent.includes("http://localhost:1337")) continue;

  const updatedContent = originalContent.replaceAll(
    "http://localhost:1337",
    backendUrl
  );

  if (updatedContent === originalContent) continue;

  fs.writeFileSync(filePath, updatedContent);
  patchedFiles += 1;
}

if (patchedFiles > 0) {
  console.log(
    `Patched admin backend URL to ${backendUrl} in ${patchedFiles} build file(s).`
  );
} else {
  console.log("Admin backend URL already up to date.");
}
