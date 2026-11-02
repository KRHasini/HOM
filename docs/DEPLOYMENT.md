# Deployment

Production runs on a single VPS with Docker: Caddy (automatic HTTPS) → web (Next.js
standalone) and api (FastAPI) → PostgreSQL 16. Media is served from the web image's
`public/` folder; API uploads (Phase 2) go to the `media` volume.

## First deploy

1. Provision a VPS (2 vCPU / 4 GB is plenty), install Docker + the compose plugin, open ports 80/443.
2. Point DNS: `A` records for `houseofmovements.in`, `www.` and `api.` → the VPS IP.
3. Clone the repo to `/srv/hom-platform` and create `.env` from `.env.example`. Required:
   `DOMAIN`, `ACME_EMAIL`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`,
   `IP_HASH_SECRET`, `FORM_TOKEN_SECRET` (generate both with
   `python3 -c "import secrets; print(secrets.token_urlsafe(48))"`), `STUDIO_NOTIFY_EMAIL`,
   and for real email `MAIL_BACKEND=smtp` + `SMTP_*`.
4. `docker compose -f docker-compose.prod.yml up -d --build`
   The API applies migrations and the idempotent content seed on start.
5. Verify: `https://DOMAIN/api/health`, `https://api.DOMAIN/health/ready`, submit a test trial.

## Release procedure

```bash
deploy/scripts/release.sh   # backup → git pull → build → up (migrations run) → smoke test
```

Roll back by checking out the previous tag and re-running the script; restore data with
`deploy/scripts/restore.sh` only if a migration damaged it.

## Backups

```bash
crontab -e
30 2 * * * /srv/hom-platform/deploy/scripts/backup.sh >> /var/log/hom-backup.log 2>&1
```

Nightly `pg_dump` (gzip) into `backups/`, pruned after `BACKUP_RETENTION_DAYS` (default 14).
Copy `backups/` off the server regularly (e.g. `rclone` to any storage you control).
Restore: `deploy/scripts/restore.sh backups/hom-<timestamp>.sql.gz`.

## Alternative: managed hosting (no code changes)

- **Web** on a managed Next.js host (e.g. Vercel / Netlify): root directory `apps/web`,
  install `pnpm install`, build `pnpm --filter @hom/web build`, set the `NEXT_PUBLIC_*`
  variables, `CONTENT_SOURCE` and `API_INTERNAL_URL`.
- **API** on any container host (Render, Fly.io, Railway, Cloud Run): build `apps/api/Dockerfile`,
  set the API variables, attach a managed PostgreSQL 16, set `WEB_ORIGINS` to the site origin.

## Operations

- Logs: `docker compose -f docker-compose.prod.yml logs -f api` (JSON, one line per request, with `request_id`).
- Errors: set `SENTRY_DSN` to enable Sentry on the API.
- Delete a person's data on request (privacy): `docker compose -f docker-compose.prod.yml exec api python -m app.scripts.delete_lead --phone "+91…"` (add `--dry-run` first).
- Lighthouse: `pnpm --filter @hom/web build && pnpm lighthouse` (budgets in `apps/web/lighthouserc.json`).
