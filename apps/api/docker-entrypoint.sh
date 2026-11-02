#!/bin/sh
# Apply migrations, optionally (re)seed content idempotently, then start the server.
set -eu

echo "[entrypoint] applying database migrations"
alembic upgrade head

if [ "${AUTO_SEED:-false}" = "true" ]; then
  echo "[entrypoint] seeding content (idempotent)"
  python -m app.scripts.seed
fi

exec "$@"
