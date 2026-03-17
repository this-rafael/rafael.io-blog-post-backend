# rafael.io Blog Post Backend

Headless CMS built with Strapi 4 + TypeScript, using SQLite locally and prepared for Railway deployment with persistent uploads.

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm develop
```

Admin panel: http://localhost:1337/admin

If you want to regenerate the base project structure from the scaffold script, run `pnpm setup` before `pnpm install`.

## Content Model

This backend exposes a single public collection type for blog posts: `artigo`.

Fields:

| Field         | Type    | Purpose                                                  |
| ------------- | ------- | -------------------------------------------------------- |
| `title`       | string  | Post title                                               |
| `slug`        | uid     | Canonical URL slug                                       |
| `description` | text    | Lead/summary used in SEO and cards                       |
| `content`     | text    | Markdown body rendered by the frontend                   |
| `cover`       | media   | Cover image from the Strapi media library                |
| `labels`      | json    | Tags array consumed directly by the site                 |
| `linkedinUrl` | string  | Link to the original LinkedIn post                       |
| `readingTime` | integer | Optional precomputed reading time                        |
| `legacyId`    | integer | Optional stable ordering/id carried from the static site |

`draftAndPublish` is enabled, so the public API only serves published entries when queried with `publicationState=live`.

## Public API

The bootstrap step enables public read permissions automatically for:

```text
GET /api/artigos
GET /api/artigos/:id
GET /api/upload/files/:id
```

Typical frontend query:

```text
GET /api/artigos?publicationState=live&populate[cover]=*&sort[0]=legacyId:asc&sort[1]=id:asc
```

## Importing Hardcoded Posts

This repository includes a data migration script that imports the hardcoded blog posts from the sibling frontend repository into Strapi.

```bash
pnpm import:posts:dry
pnpm import:posts
```

Default behavior:

- Reads markdown from `../rafael.io/content/posts/`
- Reads metadata from `../rafael.io/src/data/articles.json`
- Uploads matching cover images from `../rafael.io/public/`
- Creates or updates entries by `legacyId` and `slug`
- Publishes complete entries automatically
- Keeps incomplete entries as drafts unless `--publish-incomplete` is passed

Optional environment overrides:

- `POSTS_SOURCE_ROOT`
- `POSTS_SOURCE_DIR`
- `POSTS_METADATA_FILE`
- `POSTS_PUBLIC_DIR`

Useful flags:

```bash
node scripts/import-hardcoded-posts.cjs --dry-run
node scripts/import-hardcoded-posts.cjs --publish-incomplete
```

## Environment Variables

| Variable              | Description                              | Dev default             |
| --------------------- | ---------------------------------------- | ----------------------- |
| `APP_KEYS`            | Comma-separated random keys              | -                       |
| `API_TOKEN_SALT`      | Random string                            | -                       |
| `ADMIN_JWT_SECRET`    | Random string                            | -                       |
| `TRANSFER_TOKEN_SALT` | Random string                            | -                       |
| `JWT_SECRET`          | Random string                            | -                       |
| `DATABASE_FILENAME`   | SQLite file path                         | `.tmp/data.db`          |
| `HOST`                | Server host                              | `0.0.0.0`               |
| `PORT`                | Server port                              | `1337`                  |
| `PUBLIC_URL`          | Public base URL for absolute media links | `http://localhost:1337` |

Generate secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Railway

1. Create a Railway service from this repository.
2. Add a persistent volume mounted at `/data`.
3. Set `NODE_ENV=production` and `DATABASE_FILENAME=/data/strapi.db`.
4. Fill all Strapi secrets and set `PUBLIC_URL` to your Railway domain.

The entrypoint keeps uploads in `/data/uploads`, so both the database and media survive redeploys.

## Project Structure

```text
config/                  Strapi server, admin, database and REST config
src/index.ts             Bootstrap with public permission setup
src/api/artigo/          Article content type, controller, route and service
database/                Local database directory
public/uploads/          Uploaded media
setup.js                 Recreates the same scaffold from scratch
```
