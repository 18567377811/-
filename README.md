# Feltora（宠物毛毡）

自建海外定制宠物毛毡电商站。对标 [My Woolever Friend](https://mywooleverfriend.com/)，技术栈为 **Next.js**。

| 项 | 值 |
|----|-----|
| 线上站点 | http://8.210.39.156 （临时） |
| 域名 | https://thestoryofawool.me （DNS / SSL 生效后） |
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
npm install
npm run dev
```

打开 `http://localhost:3000`（会跳到 `/en`）。

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

# DNS 已指向 8.210.39.156 后上 HTTPS
bash /var/www/feltora/deploy/workbench-update.sh --ssl
```

脚本会：`git pull` → `npm ci` → `build`（standalone）→ 发布到 `/var/www/feltora/app` → `pm2 restart feltora`。

更细的说明（安全组、域名实名、排错）见 [`deploy/DEPLOY.md`](deploy/DEPLOY.md)。

> 本机宽带若 SSH 超时，不要死磕 `deploy.ps1`，用上面的 Workbench 流程即可。

## 当前骨架

- 三语路由：`/en` `/ms` `/zh`
- 首页 / 集合页 / 商品详情 / 购物车（本地 zustand）
- 拍照指南 / 关于 / 联系
- 商品 mock：肖像 2 + 迷你全身 2
- 定制状态机类型：`src/types/commerce.ts`

## 下一阶段任务

1. Stripe Checkout（海外支付）
2. 下单后上传宠物照片（对象存储）
3. 后台工单：订单 + 定制状态流转 + 预览确认
4. 政策页（退款 / 物流 / 条款）与真实作品图
5. 博客 / 礼品卡 / 多币种（可选）
