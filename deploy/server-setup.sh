#!/usr/bin/env bash
# 在服务器上执行一次：装环境 + Nginx 绑域名 +（可选）申请 HTTPS
# 用法：
#   bash server-setup.sh
#   bash server-setup.sh --ssl          # DNS 已生效后再加，申请证书
#   DOMAIN=thestoryofawool.me APP_PORT=3000 bash server-setup.sh

set -euo pipefail

DOMAIN="${DOMAIN:-thestoryofawool.me}"
APP_PORT="${APP_PORT:-3000}"
REMOTE_ROOT="${REMOTE_ROOT:-/var/www/feltora}"
APP_NAME="${APP_NAME:-feltora}"
ENABLE_SSL=0

for arg in "$@"; do
  case "$arg" in
    --ssl) ENABLE_SSL=1 ;;
  esac
done

echo "==> Feltora server setup"
echo "    domain=$DOMAIN  port=$APP_PORT  root=$REMOTE_ROOT"

if [[ $EUID -ne 0 ]]; then
  echo "请用 root 运行：sudo bash server-setup.sh"
  exit 1
fi

# ---------- SWAP（2G 机必开）----------
if ! swapon --show | grep -q .; then
  echo "==> 配置 2G SWAP"
  fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
else
  echo "==> SWAP 已存在，跳过"
fi

# ---------- 基础软件 ----------
echo "==> 安装 Node / Nginx / Git / Certbot"
if command -v dnf >/dev/null 2>&1; then
  dnf update -y
  if ! command -v node >/dev/null 2>&1; then
    curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
    dnf install -y nodejs
  fi
  dnf install -y nginx git tar
  # certbot（EPEL）
  dnf install -y epel-release || true
  dnf install -y certbot python3-certbot-nginx || true
elif command -v apt-get >/dev/null 2>&1; then
  apt-get update -y
  if ! command -v node >/dev/null 2>&1; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
  fi
  apt-get install -y nginx git tar certbot python3-certbot-nginx
else
  echo "不支持的包管理器，请手动安装 node20 / nginx / certbot"
  exit 1
fi

npm i -g pm2

mkdir -p "$REMOTE_ROOT/app" "$REMOTE_ROOT/uploads" "$REMOTE_ROOT/logs"
chown -R root:root "$REMOTE_ROOT"

# ---------- Nginx 站点 ----------
echo "==> 写入 Nginx 配置（绑定 $DOMAIN）"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE="$SCRIPT_DIR/nginx/feltora.conf.template"
CONF_OUT="/etc/nginx/conf.d/feltora.conf"

if [[ -f "$TEMPLATE" ]]; then
  sed -e "s/__DOMAIN__/${DOMAIN}/g" -e "s/__APP_PORT__/${APP_PORT}/g" "$TEMPLATE" > "$CONF_OUT"
else
  # 模板未随脚本上传时的兜底
  cat > "$CONF_OUT" <<EOF
upstream feltora_app {
    server 127.0.0.1:${APP_PORT};
    keepalive 32;
}
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};
    client_max_body_size 50m;
    location / {
        proxy_pass http://feltora_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 120s;
    }
}
EOF
fi

# 去掉默认欢迎页冲突（若有）
rm -f /etc/nginx/conf.d/default.conf 2>/dev/null || true

nginx -t
systemctl enable nginx
systemctl reload nginx || systemctl restart nginx

# ---------- HTTPS（DNS 必须已指向本机）----------
if [[ "$ENABLE_SSL" -eq 1 ]]; then
  echo "==> 申请 Let's Encrypt 证书"
  if ! command -v certbot >/dev/null 2>&1; then
    echo "certbot 未安装，跳过 SSL"
  else
    # 简单探测 DNS
    RESOLVED="$(getent hosts "$DOMAIN" | awk '{print $1}' | head -n1 || true)"
    LOCAL_IP="$(curl -4 -s --max-time 5 ifconfig.me || curl -4 -s --max-time 5 icanhazip.com || true)"
    echo "    $DOMAIN -> ${RESOLVED:-未知} ; 本机公网 -> ${LOCAL_IP:-未知}"
    certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --register-unsafely-without-email --redirect || {
      echo "证书申请失败：请确认域名已实名、A 记录已指向本机，且安全组开放 80/443"
      exit 1
    }
  fi
fi

# ---------- 防火墙（若启用 firewalld）----------
if systemctl is-active --quiet firewalld 2>/dev/null; then
  firewall-cmd --permanent --add-service=http || true
  firewall-cmd --permanent --add-service=https || true
  firewall-cmd --reload || true
fi

echo ""
echo "==> 服务器初始化完成"
echo "    应用目录: $REMOTE_ROOT/app"
echo "    上传目录: $REMOTE_ROOT/uploads （以后放宠物照片等）"
echo "    Nginx 已监听 80，反代到 127.0.0.1:$APP_PORT"
echo ""
echo "接下来："
echo "  1) 阿里云域名控制台完成「实名认证」（未实名无法解析）"
echo "  2) 域名解析添加 A 记录："
echo "       @    A    <本机公网IP>"
echo "       www  A    <本机公网IP>"
echo "  3) 本机运行:  .\\deploy\\deploy.ps1"
echo "  4) DNS 生效后在本机再跑:  .\\deploy\\deploy.ps1 -SetupSsl"
echo "     或在服务器:  bash $REMOTE_ROOT/deploy/server-setup.sh --ssl"
