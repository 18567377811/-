# Feltora（宠物毛毡）

自建海外定制宠物毛毡电商站。对标 [My Woolever Friend](https://mywooleverfriend.com/)，技术栈为 **Next.js**。

## 已定决策

| 项 | 选择 |
|----|------|
| 技术 | 自建 Next.js（`web/`） |
| 市场 | 海外为主，结算货币 USD |
| 语言 | English / Bahasa Melayu / 简体中文 |
| 首发品类 | Portrait + Miniature 一起上 |

## 本地启动

```bash
cd web
npm install
npm run dev
```

打开 `http://localhost:3000`（会跳到 `/en`）。

## 部署（香港 ECS + thestoryofawool.me）

本机构建验证通过后一键更新线上（standalone，服务器不 build）。详见 [`deploy/DEPLOY.md`](deploy/DEPLOY.md)。

```powershell
# 域名须先在阿里云「实名」→「解析」A 记录到 8.210.39.156
.\deploy\deploy.ps1 -InitServer   # 首次：环境 + Nginx 绑域名
.\deploy\deploy.ps1               # 日常：构建 + 上传 + 重启
.\deploy\deploy.ps1 -SetupSsl     # DNS 生效后上 HTTPS
```

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
