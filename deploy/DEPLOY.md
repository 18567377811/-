# Feltora 部署手册（香港 ECS + 域名 thestoryofawool.me）

面向：**本机改完 → 推 GitHub → Workbench 一键更新**；全栈 Next.js（站点 + 日后 `/admin` / API），海外用户。

| 项 | 值 |
|----|-----|
| 服务器 | `8.210.39.156`（中国香港） |
| 域名 | `thestoryofawool.me` |
| 代码仓库 | https://github.com/18567377811/-.git |
| 应用目录 | `/var/www/feltora` |
| 推荐方式 | 阿里云 Workbench + `workbench-update.sh`（本机 SSH 不通时用这个） |

香港节点服务海外用户，**.me 域名无需国内 ICP 备案**。

---

## 推荐：Workbench 一键更新（当前主流程）

本机开发验证通过后：

```powershell
# 本机：把改动推到 GitHub
cd "d:\0-Xiangmu\宠物毛毡"
git add -A
git commit -m "update site"
git push
```

服务器（ECS → 远程连接 → Workbench）执行：

```bash
bash /var/www/feltora/deploy/workbench-update.sh
```

脚本会：`git pull` → `npm ci` → `build` → 发布 standalone → `pm2 restart`。  
DNS 通了以后可加证书：`bash /var/www/feltora/deploy/workbench-update.sh --ssl`

首次若还没有脚本，在 Workbench 执行一次：

```bash
mkdir -p /var/www/feltora/deploy
curl -fsSL "https://raw.githubusercontent.com/18567377811/-/main/deploy/workbench-update.sh" \
  -o /var/www/feltora/deploy/workbench-update.sh
chmod +x /var/www/feltora/deploy/workbench-update.sh
bash /var/www/feltora/deploy/workbench-update.sh
```

（香港 ECS 访问不了 Gitee，请用 GitHub。私有库把 `GIT_URL` 换成带 token 的地址。）

---

## 0. 域名：必须先实名，再解析（绑服务器）

控制台截图里域名状态是 **「未实名」**。阿里云提示：**未实名不能解析**。脚本无法替你完成实名。

### 步骤 A — 实名认证

1. 打开 [域名控制台](https://dc.console.aliyun.com/) → 找到 `thestoryofawool.me`
2. 点 **未实名 / 管理**，用已实名的信息模板完成认证
3. 等到状态变为已实名（可能要几分钟到几小时）

### 步骤 B — 解析绑到 ECS

1. 域名右侧点 **「解析」**
2. 添加两条记录：

| 主机记录 | 记录类型 | 记录值 | TTL |
|----------|----------|--------|-----|
| `@` | A | `8.210.39.156` | 10 分钟 |
| `www` | A | `8.210.39.156` | 10 分钟 |

3. ECS **安全组**入方向放行：`22`、`80`、`443`

本机验证：

```powershell
nslookup thestoryofawool.me
# 应返回 8.210.39.156
```

> DNS 解析只能在阿里云控制台（或 API）改；脚本负责 **服务器上 Nginx 认这个域名 + HTTPS**。

---

## 1. 第一次上线（推荐顺序）

在项目根目录 PowerShell：

```powershell
# 1) 首次：装 Node / Nginx / SWAP，并把域名写进 Nginx
.\deploy\deploy.ps1 -InitServer

# 2) 本机构建 + 上传 + 启动（可与上一步合并，单独跑也行）
.\deploy\deploy.ps1

# 3) 等 nslookup 已指向 8.210.39.156 后，申请 HTTPS
.\deploy\deploy.ps1 -SetupSsl
```

也可一步：`.\deploy\deploy.ps1 -InitServer` 后再 `.\deploy\deploy.ps1`；SSL 务必等 DNS 生效。

首次 SSH 会要输入 root 密码（或先配密钥）。

---

## 2. 日常更新（本地验证后再发）

```powershell
cd "d:\0-Xiangmu\宠物毛毡"
.\deploy\deploy.ps1
```

流程：`npm run build` → 打 standalone 包 → `scp` → 服务器解压 → `pm2 restart feltora`。  
服务器 **不跑 build**，2G 内存更稳。

---

## 3. 目录与扩展（全栈 / 管理后台）

```
/var/www/feltora/
  app/                 # 当前发布（symlink → releases/xxx）
  releases/            # 历史版本（保留最近 5 个）
  uploads/             # 日后宠物照片等对象
  logs/
  deploy/              # 服务器上的 setup 脚本备份
```

- 管理后台可先做在 **同一 Next 应用** 的 `/admin`（无需改 Nginx）。
- 若日后拆成独立 Node 进程，改 `deploy/nginx/feltora.conf.template` 里预留的 `/admin/` location，再 `-InitServer` 或手动 reload Nginx。

---

## 4. 常用命令

```bash
# 服务器上
pm2 status
pm2 logs feltora
pm2 restart feltora
sudo nginx -t && sudo systemctl reload nginx
```

改 IP / 域名 / 端口：编辑 `deploy/config.ps1`。

---

## 5. 故障排查

| 现象 | 处理 |
|------|------|
| 域名无法解析 | 未实名 / A 记录未加 / 等待 TTL |
| 80 不通 | 安全组未放行 80 |
| 证书申请失败 | DNS 未指向本机，或 80 被拦 |
| 502 | `pm2 status` 看应用是否挂了；`pm2 logs feltora` |
| 本机构建失败 | 先在 `web` 下 `npm run build` 看报错 |
