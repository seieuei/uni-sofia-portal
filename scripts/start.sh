#!/usr/bin/env bash
set -euo pipefail

# Railway sets DATABASE_URL (e.g. file:/data/dev.db) and PORT.
# Local fallback matches .env / Prisma schema expectations.
export DATABASE_URL="${DATABASE_URL:-file:./dev.db}"
export PORT="${PORT:-3000}"

echo "→ prisma migrate deploy (DATABASE_URL=${DATABASE_URL})"
npx prisma migrate deploy

echo "→ seed if empty"
npx tsx scripts/seed-if-empty.ts

echo "→ next start -H 0.0.0.0 -p ${PORT}"
exec npx next start -H 0.0.0.0 -p "${PORT}"
