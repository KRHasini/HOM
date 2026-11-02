#!/usr/bin/env bash
# Restore a backup produced by backup.sh:  deploy/scripts/restore.sh backups/hom-2026....sql.gz
set -euo pipefail

FILE="${1:?usage: restore.sh <backup.sql.gz>}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
set -a; . ./.env; set +a

read -r -p "Restore $FILE into '$POSTGRES_DB'? This overwrites current data. [y/N] " answer
[ "$answer" = "y" ] || { echo "Aborted."; exit 1; }

docker compose -f docker-compose.prod.yml stop api web
gzip -cd "$FILE" | docker compose -f docker-compose.prod.yml exec -T postgres psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" "$POSTGRES_DB"
docker compose -f docker-compose.prod.yml start api web
echo "Restore complete."
