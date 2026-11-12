# Feltora（宠物毛毡）

自建海外定制宠物毛毡电商站。对标 [My Woolever Friend](https://mywooleverfriend.com/)，技术栈为 **Next.js**。

| 项 | 值 |
|----|-----|
| 线上站点 | https://thestoryofawool.me （`www` 同步可用） |
| 备用 IP | http://8.210.39.156 |
| 服务器 | 阿里云香港 ECS `8.210.39.156` |
| 代码仓库 | https://github.com/18567377811/-.git |

## 已定决策

| 项 | 选择 |
|----|------|
| 技术 | 自建 Next.js（`web/`） |
| 市场 | 海外为主，结算货币 USD |
| 语言 | English / Bahasa Melayu / 简体中文 |
| 首发品类 | Portrait + Miniature 一起上 |
| 部署 | 香港 ECS + Nginx + PM2；本机推 GitHub → Workbench 一键更新 |

## 本地启动

```bash
cd web
cp .env.example .env          # 含 DATABASE_URL / ADMIN_* / Stripe
npm install
npx prisma migrate dev        # 创建 SQLite：web/data/feltora.db
npm run db:seed               # 灌入分类/商品/轮播（已有数据则跳过）
npm run dev
```

打开 `http://localhost:3000`（会跳到 `/en`）。  
管理后台：`http://localhost:3000/admin`（密码见 `.env` 的 `ADMIN_PASSWORD`）。

本地测支付回调：

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

把 CLI 打印的 `whsec_...` 写入 `.env.local` 的 `STRIPE_WEBHOOK_SECRET`。

## 个人站对接 Stripe 需要准备什么

| 你需要准备 | 说明 |
|------------|------|
| **Stripe 账号** | [dashboard.stripe.com](https://dashboard.stripe.com) 注册；个人（Individual）可开，但**主体国家/地区**要选 Stripe 支持的（常见：香港 / 新加坡 / 美国等）。中国大陆个体户通常**不能**直接开 Stripe 商户。 |
| **身份核验** | 护照/身份证 + 自拍/住址证明；个人或公司 KYC |
| **收款银行账户** | 与主体同地区的银行账户（或 Stripe 支持的提现账户），用于结算 USD |
| **网站与业务说明** | 已上线域名、售卖什么、履约周期（定制 3–10 个月要写清楚） |
| **API 密钥** | `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`（先用 **Test mode**） |
| **Webhook** | 端点 `https://thestoryofawool.me/api/webhooks/stripe`，事件至少勾选 `checkout.session.completed`，拿到 `whsec_...` |
| **服务器环境变量** | Workbench 创建 `/var/www/feltora/shared/.env`（见下），发版脚本会自动注入 |
| **政策页（上线收款前）** | 退款 / 物流 / 服务条款（Stripe 审站常看） |

生产机写入（一次即可，勿提交 Git）：

```bash
sudo mkdir -p /var/www/feltora/shared
sudo nano /var/www/feltora/shared/.env
```

```env
NEXT_PUBLIC_SITE_URL=https://thestoryofawool.me
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

然后 `bash /var/www/feltora/deploy/workbench-update.sh` 重新发布一次。

## 发版（当前主流程）

香港机访问不了 Gitee，代码以 **GitHub** 为准。本机改完并验证后：

```powershell
# 1) 本机推送
cd "d:\0-Xiangmu\宠物毛毡"
git add -A
git commit -m "update site"
git push
```

```bash
# 2) 阿里云 ECS → 远程连接 → Workbench
bash /var/www/feltora/deploy/workbench-update.sh

# 仅在证书未装好 / 续期失败时再带 --ssl
bash /var/www/feltora/deploy/workbench-update.sh --ssl
```

脚本会：`git pull` → `npm ci` → **`prisma db push`（幂等同步库结构）** → `build` → 发布 → `pm2` 用 `HOSTNAME=0.0.0.0` 启动。

> **为何以前会挂站？** 发版脚本曾用 `prisma migrate deploy`。线上若已用 `db push` 加过列（如 `Category.saleType`），再跑迁移会报 `duplicate column`，迁移失败后站点未重启 → 502。现已改为 `db push`，并在失败时尝试拉起旧进程。

更细的说明（安全组、域名实名、排错）见 [`deploy/DEPLOY.md`](deploy/DEPLOY.md)。

> 国内微信访问可能提示「未完成 ICP 备案」——海外主站可忽略；点「继续访问」即可。

> 本机宽带若 SSH 超时，不要死磕 `deploy.ps1`，用上面的 Workbench 流程即可。

## 当前骨架

- 三语路由：`/en` `/ms` `/zh`
- 首页 / 集合页 / 商品详情 / 购物车（本地 zustand）
- 拍照指南 / 关于 / 联系
- 商品 mock：肖像 2 + 迷你全身 2
- 定制状态机类型：`src/types/commerce.ts`
- Stripe Checkout：`POST /api/checkout` + webhook（价目以服务端 catalog 为准）

## 下一阶段任务

1. ~~Stripe Checkout（海外支付）~~ ← 代码已接，待你填密钥 + 开账号
2. 下单后上传宠物照片（对象存储）
3. 后台工单：订单 + 定制状态流转 + 预览确认
4. 政策页（退款 / 物流 / 条款）与真实作品图
5. 博客 / 礼品卡 / 多币种（可选）
