#!/usr/bin/env bash
# Feltora 一键更新（在阿里云 Workbench 里执行，不依赖本机 SSH）
# 用法：
#   bash /var/www/feltora/deploy/workbench-update.sh
#   bash /var/www/feltora/deploy/workbench-update.sh --ssl

set -euo pipefail

DOMAIN="${DOMAIN:-thestoryofawool.me}"
APP_PORT="${APP_PORT:-3000}"
APP_NAME="${APP_NAME:-feltora}"
REMOTE_ROOT="${REMOTE_ROOT:-/var/www/feltora}"
SRC_DIR="${SRC_DIR:-/var/www/feltora-src}"
GIT_URL="${GIT_URL:-https://github.com/18567377811/-.git}"
BRANCH="${BRANCH:-}"
ENABLE_SSL=0

for arg in "$@"; do
  case "$arg" in
    --ssl) ENABLE_SSL=1 ;;
  esac
done

echo "==> Feltora update"
echo "    git=$GIT_URL"

# ---------- 拉代码 ----------
if [[ ! -d "$SRC_DIR/.git" ]]; then
  echo "==> clone"
  rm -rf "$SRC_DIR"
  git clone "$GIT_URL" "$SRC_DIR"
fi

cd "$SRC_DIR"
git fetch origin
# 未指定分支时自动用远程默认分支（master / main）
if [[ -z "$BRANCH" ]]; then
  BRANCH="$(git remote show origin | sed -n '/HEAD branch/s/.*: //p')"
  BRANCH="${BRANCH:-master}"
fi
echo "    branch=$BRANCH"
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"

WEB_DIR="$SRC_DIR/web"
if [[ ! -f "$WEB_DIR/package.json" ]]; then
  echo "ERROR: missing $WEB_DIR/package.json"
  exit 1
fi

# 同步仓库里的更新脚本到固定路径，方便下次直接 bash
mkdir -p "$REMOTE_ROOT/deploy"
if [[ -f "$SRC_DIR/deploy/workbench-update.sh" ]]; then
  cp -f "$SRC_DIR/deploy/workbench-update.sh" "$REMOTE_ROOT/deploy/workbench-update.sh"
  chmod +x "$REMOTE_ROOT/deploy/workbench-update.sh"
fi

# ---------- 构建 ----------
echo "==> npm ci + build (may take a few minutes on 2G)"
cd "$WEB_DIR"
npm ci
npm run build

if [[ ! -d .next/standalone ]]; then
  echo "ERROR: .next/standalone not found. Ensure next.config has output: 'standalone'"
  exit 1
fi

# ---------- 发布（带时间戳，可回滚）----------
RELEASE_ID="$(date +%Y%m%d-%H%M%S)"
RELEASE_DIR="$REMOTE_ROOT/releases/$RELEASE_ID"
APP_LINK="$REMOTE_ROOT/app"

echo "==> release $RELEASE_ID"
mkdir -p "$RELEASE_DIR" "$REMOTE_ROOT/uploads" "$REMOTE_ROOT/logs" "$REMOTE_ROOT/deploy"
cp -a .next/standalone/. "$RELEASE_DIR/"
mkdir -p "$RELEASE_DIR/.next"
cp -a .next/static "$RELEASE_DIR/.next/static"
if [[ -d public ]]; then
  cp -a public "$RELEASE_DIR/public"
fi

ln -sfn "$RELEASE_DIR" "$APP_LINK"

# ---------- PM2 ----------
echo "==> pm2"
cd "$APP_LINK"
export PORT="$APP_PORT" HOSTNAME=0.0.0.0 NODE_ENV=production
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 restart "$APP_NAME" --update-env
else
  pm2 start server.js --name "$APP_NAME" --cwd "$APP_LINK"
fi
pm2 save

# 只保留最近 5 个版本
cd "$REMOTE_ROOT/releases"
ls -1dt */ 2>/dev/null | tail -n +6 | xargs -r rm -rf || true

# ---------- 可选 HTTPS ----------
if [[ "$ENABLE_SSL" -eq 1 ]]; then
  if command -v certbot >/dev/null 2>&1; then
    certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --register-unsafely-without-email --redirect || {
      echo "WARN: certbot failed (DNS must point to this server first)"
    }
  else
    echo "WARN: certbot not installed"
  fi
fi

pm2 status "$APP_NAME"
echo ""
echo "==> DONE"
echo "    http://8.210.39.156"
echo "    http://$DOMAIN  (after DNS works)"
echo "    logs: pm2 logs $APP_NAME"
