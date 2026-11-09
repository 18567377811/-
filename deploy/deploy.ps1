#Requires -Version 5.1
param(
  [switch]$InitServer,
  [switch]$SetupSsl,
  [switch]$SkipBuild,
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
. (Join-Path $PSScriptRoot "config.ps1")

$HostAddr   = $DeployConfig.ServerHost
$User       = $DeployConfig.ServerUser
$RemoteRoot = $DeployConfig.RemoteRoot
$Domain     = $DeployConfig.Domain
$AppPort    = $DeployConfig.AppPort
$AppName    = $DeployConfig.AppName
$WebDir     = Join-Path $Root "web"
$Staging    = Join-Path $Root "deploy\.release"
$TarPath    = Join-Path $Root "deploy\.release.tgz"
$SshTarget  = "$User@$HostAddr"

if ([string]::IsNullOrWhiteSpace($HostAddr)) {
  throw "ServerHost is empty. Check deploy\config.ps1 encoding / values."
}
if ([string]::IsNullOrWhiteSpace($Domain)) {
  throw "Domain is empty. Check deploy\config.ps1."
}

function Write-Step([string]$msg) { Write-Host ""; Write-Host "==> $msg" -ForegroundColor Cyan }
function Write-Ok([string]$msg)   { Write-Host "    $msg" -ForegroundColor Green }
function Write-Warn([string]$msg) { Write-Host "    $msg" -ForegroundColor Yellow }

# PowerShell 下 `npm` 常落到 npm.ps1（执行策略/截断会报 Unknown command: "pm"）
# 优先用 npm.cmd
function Get-NpmCmd {
  $cmd = Get-Command npm.cmd -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  $npm = Get-Command npm -ErrorAction SilentlyContinue
  if ($npm) { return $npm.Source }
  return $null
}

function Assert-Tools {
  foreach ($t in @("ssh", "scp")) {
    if (-not (Get-Command $t -ErrorAction SilentlyContinue)) {
      throw "Missing tool: $t. Install OpenSSH Client in Windows Optional Features."
    }
  }
  if (-not (Get-NpmCmd)) {
    throw "Missing npm / Node.js"
  }
}

function Invoke-Remote([string]$Cmd) {
  Write-Ok "ssh: $Cmd"
  if ($DryRun) { return }
  & ssh -o StrictHostKeyChecking=accept-new $SshTarget $Cmd
  if ($LASTEXITCODE -ne 0) { throw "Remote command failed (exit $LASTEXITCODE)" }
}

function Publish-File([string]$Local, [string]$Remote) {
  Write-Ok "scp $Local -> ${SshTarget}:$Remote"
  if ($DryRun) { return }
  & scp -o StrictHostKeyChecking=accept-new $Local "${SshTarget}:$Remote"
  if ($LASTEXITCODE -ne 0) { throw "scp failed: $Local" }
}

Write-Step "Feltora deploy -> $Domain ($HostAddr)"
Assert-Tools

$pkg = Join-Path $WebDir "package.json"
if (-not (Test-Path $pkg)) { throw "Missing web/package.json: $WebDir" }

if ($InitServer) {
  Write-Step "Upload and run server-setup.sh"
  Invoke-Remote "mkdir -p $RemoteRoot/deploy/nginx $RemoteRoot/app $RemoteRoot/uploads $RemoteRoot/logs"
  Publish-File (Join-Path $PSScriptRoot "server-setup.sh") "$RemoteRoot/deploy/server-setup.sh"
  Publish-File (Join-Path $PSScriptRoot "nginx\feltora.conf.template") "$RemoteRoot/deploy/nginx/feltora.conf.template"
  Publish-File (Join-Path $PSScriptRoot "remote-release.sh") "$RemoteRoot/deploy/remote-release.sh"

  $sslFlag = ""
  if ($SetupSsl) { $sslFlag = " --ssl" }

  $setupCmd = "chmod +x $RemoteRoot/deploy/server-setup.sh $RemoteRoot/deploy/remote-release.sh && DOMAIN=$Domain APP_PORT=$AppPort REMOTE_ROOT=$RemoteRoot APP_NAME=$AppName bash $RemoteRoot/deploy/server-setup.sh$sslFlag"
  Invoke-Remote $setupCmd

  Write-Warn "Domain real-name must be approved on Aliyun first."
  Write-Host "    A record @   -> $HostAddr"
  Write-Host "    A record www -> $HostAddr"
  Write-Warn "Open security group 22/80/443. After DNS works: .\deploy\deploy.ps1 -SetupSsl"
}

if ($SetupSsl -and -not $InitServer) {
  Write-Step "Request HTTPS certificate"
  Invoke-Remote "DOMAIN=$Domain APP_PORT=$AppPort REMOTE_ROOT=$RemoteRoot bash $RemoteRoot/deploy/server-setup.sh --ssl"
}

if (-not $SkipBuild) {
  Write-Step "Local npm run build (standalone)"
  $npmExe = Get-NpmCmd
  Write-Ok "using: $npmExe"
  Push-Location $WebDir
  try {
    if (-not (Test-Path "node_modules")) {
      Write-Ok "npm ci"
      if (-not $DryRun) {
        & $npmExe ci
        if ($LASTEXITCODE -ne 0) { throw "npm ci failed" }
      }
    }
    if (-not $DryRun) {
      & $npmExe run build
      if ($LASTEXITCODE -ne 0) { throw "npm run build failed" }
    }
  }
  finally {
    Pop-Location
  }

  $standalone = Join-Path $WebDir ".next\standalone"
  $staticDir  = Join-Path $WebDir ".next\static"
  $publicDir  = Join-Path $WebDir "public"

  if (-not $DryRun) {
    if (-not (Test-Path $standalone)) { throw "Missing .next/standalone. Check next.config output:standalone" }
    if (-not (Test-Path $staticDir))  { throw "Missing .next/static" }
  }

  Write-Step "Pack release"
  if (-not $DryRun) {
    if (Test-Path $Staging) { Remove-Item -Recurse -Force $Staging }
    New-Item -ItemType Directory -Force -Path $Staging | Out-Null
    Copy-Item -Recurse (Join-Path $standalone "*") $Staging

    $destNext = Join-Path $Staging ".next"
    New-Item -ItemType Directory -Force -Path $destNext | Out-Null
    Copy-Item -Recurse $staticDir (Join-Path $destNext "static")

    if (Test-Path $publicDir) {
      Copy-Item -Recurse $publicDir (Join-Path $Staging "public")
    }

    $envLines = @(
      "NODE_ENV=production"
      "PORT=$AppPort"
      "HOSTNAME=0.0.0.0"
    )
    $envPath = Join-Path $Staging ".env.production"
    [System.IO.File]::WriteAllLines($envPath, $envLines)

    if (Test-Path $TarPath) { Remove-Item -Force $TarPath }
    & tar -czf $TarPath -C $Staging .
    if ($LASTEXITCODE -ne 0) { throw "tar pack failed" }
  }
  Write-Ok "Release: $TarPath"
}
else {
  if (-not (Test-Path $TarPath)) { throw "-SkipBuild needs existing deploy\.release.tgz" }
}

Write-Step "Upload and restart PM2"
$remoteTar = "/tmp/feltora-release.tgz"
$releaseId = Get-Date -Format "yyyyMMdd-HHmmss"
$remoteRelease = "$RemoteRoot/releases/$releaseId"
$remoteCurrent = "$RemoteRoot/app"

Invoke-Remote "mkdir -p $RemoteRoot/releases $RemoteRoot/deploy $RemoteRoot/uploads $RemoteRoot/logs"
Publish-File (Join-Path $PSScriptRoot "remote-release.sh") "$RemoteRoot/deploy/remote-release.sh"
Publish-File $TarPath $remoteTar

$releaseCmd = "chmod +x $RemoteRoot/deploy/remote-release.sh && REMOTE_ROOT=$RemoteRoot REMOTE_TAR=$remoteTar REMOTE_RELEASE=$remoteRelease REMOTE_CURRENT=$remoteCurrent APP_NAME=$AppName APP_PORT=$AppPort bash $RemoteRoot/deploy/remote-release.sh"
Invoke-Remote $releaseCmd

Write-Step "Done"
Write-Ok "Site: http://$HostAddr  (domain later: http://$Domain)"
Write-Ok "Logs: ssh $SshTarget `"pm2 logs $AppName`""
Write-Warn "When DNS resolves, run: .\deploy\deploy.ps1 -SetupSsl"