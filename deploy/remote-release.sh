#!/usr/bin/env bash
# Unpack release tarball and restart PM2. Called from deploy.ps1 via ssh.
set -euo pipefail

REMOTE_ROOT="${REMOTE_ROOT:?}"
REMOTE_TAR="${REMOTE_TAR:?}"
REMOTE_RELEASE="${REMOTE_RELEASE:?}"
REMOTE_CURRENT="${REMOTE_CURRENT:?}"
APP_NAME="${APP_NAME:?}"
APP_PORT="${APP_PORT:?}"

mkdir -p "$REMOTE_RELEASE" "$REMOTE_ROOT/releases" "$REMOTE_ROOT/uploads" "$REMOTE_ROOT/logs"
tar -xzf "$REMOTE_TAR" -C "$REMOTE_RELEASE"
rm -f "$REMOTE_TAR"
ln -sfn "$REMOTE_RELEASE" "$REMOTE_CURRENT"

cd "$REMOTE_CURRENT"
export PORT="$APP_PORT" HOSTNAME=0.0.0.0 NODE_ENV=production

if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 restart "$APP_NAME" --update-env
else
  pm2 start server.js --name "$APP_NAME" --cwd "$REMOTE_CURRENT"
fi

pm2 save

# Keep last 5 releases
cd "$REMOTE_ROOT/releases"
ls -1dt */ 2>/dev/null | tail -n +6 | xargs -r rm -rf || true

pm2 status "$APP_NAME"
