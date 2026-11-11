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

# ---------- SQLite 持久目录 ----------
SHARED_ENV="$REMOTE_ROOT/shared/.env"
SHARED_DATA="$REMOTE_ROOT/shared/data"
mkdir -p "$REMOTE_ROOT/shared" "$SHARED_DATA"
DB_FILE="$SHARED_DATA/feltora.db"

# 确保 shared/.env 含 DATABASE_URL / 管理后台密钥
if [[ -f "$SHARED_ENV" ]]; then
  if ! grep -q '^DATABASE_URL=' "$SHARED_ENV" 2>/dev/null; then
    echo "DATABASE_URL=\"file:$DB_FILE\"" >> "$SHARED_ENV"
  fi
  if ! grep -q '^ADMIN_PASSWORD=' "$SHARED_ENV" 2>/dev/null; then
    echo "ADMIN_PASSWORD=\"change-me\"" >> "$SHARED_ENV"
  fi
  if ! grep -q '^ADMIN_SESSION_SECRET=' "$SHARED_ENV" 2>/dev/null; then
    echo "ADMIN_SESSION_SECRET=\"$(openssl rand -hex 24 2>/dev/null || echo change-me-admin-secret)\"" >> "$SHARED_ENV"
  fi
fi

# ---------- 构建 ----------
echo "==> npm ci + prisma migrate + build (may take a few minutes on 2G)"
cd "$WEB_DIR"
npm ci

# 迁移指向持久库（构建前先同步 schema）
export DATABASE_URL="file:$DB_FILE"
npx prisma migrate deploy
if [[ ! -f "$DB_FILE" ]] || [[ ! -s "$DB_FILE" ]]; then
  echo "==> seed empty database"
  npx tsx prisma/seed.ts || true
else
  # 若无分类则补种子（幂等）
  npx tsx prisma/seed.ts || true
fi

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
mkdir -p "$RELEASE_DIR" "$REMOTE_ROOT/uploads" "$REMOTE_ROOT/logs" "$REMOTE_ROOT/deploy" "$REMOTE_ROOT/releases"
cp -a .next/standalone/. "$RELEASE_DIR/"
mkdir -p "$RELEASE_DIR/.next"
cp -a .next/static "$RELEASE_DIR/.next/static"
if [[ -d public ]]; then
  cp -a public "$RELEASE_DIR/public"
fi
# Prisma 查询引擎 / schema（standalone 追踪偶发遗漏时兜底）
mkdir -p "$RELEASE_DIR/prisma" "$RELEASE_DIR/node_modules"
if [[ -d node_modules/.prisma ]]; then
  mkdir -p "$RELEASE_DIR/node_modules/.prisma"
  cp -a node_modules/.prisma/. "$RELEASE_DIR/node_modules/.prisma/"
fi
if [[ -d node_modules/@prisma ]]; then
  mkdir -p "$RELEASE_DIR/node_modules/@prisma"
  cp -a node_modules/@prisma/. "$RELEASE_DIR/node_modules/@prisma/"
fi
cp -a prisma/. "$RELEASE_DIR/prisma/" 2>/dev/null || true

# 持久密钥（Stripe / DB / Admin）：不进 Git，放 shared/.env，每次发版拷进 release
if [[ -f "$SHARED_ENV" ]]; then
  echo "==> apply shared env → release"
  cp -f "$SHARED_ENV" "$RELEASE_DIR/.env"
  cp -f "$SHARED_ENV" "$RELEASE_DIR/.env.production"
else
  echo "WARN: missing $SHARED_ENV (Stripe/admin will fail until created)"
  cat > "$RELEASE_DIR/.env" <<EOF
DATABASE_URL="file:$DB_FILE"
ADMIN_PASSWORD="change-me"
ADMIN_SESSION_SECRET="change-me-admin-secret"
NEXT_PUBLIC_SITE_URL=https://thestoryofawool.me
EOF
fi

# app 若是普通目录（首次误拷），ln -sfn 不会替换，必须先删掉再挂软链
if [[ -e "$APP_LINK" && ! -L "$APP_LINK" ]]; then
  echo "==> replacing non-symlink app directory with release symlink"
  rm -rf "$APP_LINK"
fi
ln -sfn "$RELEASE_DIR" "$APP_LINK"
ls -la "$APP_LINK"
readlink -f "$APP_LINK"

# ---------- PM2 ----------
# 必须 delete 再 start：仅 restart 时 PM2 可能仍占用旧 release 的真实路径
echo "==> pm2 (recreate process on latest release)"
export PORT="$APP_PORT" HOSTNAME=0.0.0.0 NODE_ENV=production
if [[ -f "$SHARED_ENV" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$SHARED_ENV"
  set +a
fi
pm2 delete "$APP_NAME" >/dev/null 2>&1 || true
cd "$APP_LINK"
pm2 start server.js --name "$APP_NAME" --cwd "$APP_LINK"
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
echo "    https://$DOMAIN"
echo "    https://www.$DOMAIN"
echo "    http://8.210.39.156  (IP fallback)"
echo "    logs: pm2 logs $APP_NAME"
