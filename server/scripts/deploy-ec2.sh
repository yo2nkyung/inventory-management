#!/usr/bin/env bash
set -euo pipefail

APP_ROOT="/root/inventory-management"
SERVER_ROOT="$APP_ROOT/server"
SERVICE_NAME="inventory-api"
HEALTHCHECK_URL="http://localhost:8000/health"

cd "$SERVER_ROOT"
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build

systemctl restart "$SERVICE_NAME"
systemctl status "$SERVICE_NAME" --no-pager
curl --fail --silent "$HEALTHCHECK_URL"
