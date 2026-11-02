#!/usr/bin/env bash
# Release: pull, build, migrate (API entrypoint), restart, smoke test.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
set -a; . ./.env; set +a
COMPOSE="docker compose -f docker-compose.prod.yml"

echo "==> Backing up before release"
"$ROOT/deploy/scripts/backup.sh"

echo "==> Pulling latest code"
git pull --ff-only

echo "==> Building images"
$COMPOSE build --pull

echo "==> Starting (API applies migrations on start)"
$COMPOSE up -d --remove-orphans

echo "==> Smoke test"
for url in "https://$DOMAIN/api/health" "https://api.$DOMAIN/health/ready" "https://$DOMAIN/" "https://$DOMAIN/trial"; do
  for attempt in $(seq 1 30); do
    if curl -fsS -o /dev/null "$url"; then echo "  ok  $url"; break; fi
    [ "$attempt" -eq 30 ] && { echo "  FAIL $url" >&2; exit 1; }
    sleep 2
  done
done
echo "==> Release complete"
