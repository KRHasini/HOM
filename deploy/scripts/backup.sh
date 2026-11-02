#!/usr/bin/env bash
# Nightly PostgreSQL backup with retention.
# Cron (as the deploy user): 30 2 * * * /srv/hom-platform/deploy/scripts/backup.sh >> /var/log/hom-backup.log 2>&1
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
set -a; . ./.env; set +a

BACKUP_DIR="${BACKUP_DIR:-$ROOT/backups}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
FILE="$BACKUP_DIR/hom-$STAMP.sql.gz"

mkdir -p "$BACKUP_DIR"
docker compose -f docker-compose.prod.yml exec -T postgres \
  pg_dump --clean --if-exists --no-owner -U "$POSTGRES_USER" "$POSTGRES_DB" | gzip -9 > "$FILE"

# Fail loudly on an empty dump.
[ "$(gzip -cd "$FILE" | head -c 1 | wc -c)" -gt 0 ] || { echo "Empty backup: $FILE" >&2; exit 1; }

find "$BACKUP_DIR" -name 'hom-*.sql.gz' -mtime +"$RETENTION_DAYS" -delete
echo "Backup written: $FILE"
