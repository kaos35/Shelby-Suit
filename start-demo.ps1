# Shelby Ecosystem - Final Demo Launcher
# Automates environment setup, builds, and launches all services.

Write-Host "🚀 Shelby Ecosystem Final Demo Launcher" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# 1. Create .env file for Docker Compose
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating default .env file..." -ForegroundColor Yellow
    $envContent = @"
# Global Configuration
NODE_ENV=production

# Webhook URLs (Optional - for Demo)
SLACK_WEBHOOK_URL=
DISCORD_WEBHOOK_URL=

# Dashboard
NEXT_PUBLIC_SHELBY_API_URL=https://api.shelby.io
"@
    Set-Content ".env" $envContent
    Write-Host "✅ .env created. You can edit it to add webhook URLs." -ForegroundColor Green
}

# 2. Check for Docker
if (-not (Get-Command "docker-compose" -ErrorAction SilentlyContinue)) {
    if (-not (Get-Command "docker" -ErrorAction SilentlyContinue)) {
        Write-Error "❌ Docker not found! Please install Docker Desktop."
        exit 1
    }
}

# 3. Build & Start Services
Write-Host "🏗️  Building Docker images... (This might take a while)" -ForegroundColor Yellow
docker-compose build

if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Build failed!"
    exit 1
}

Write-Host "🚀 Starting services..." -ForegroundColor Yellow
docker-compose up -d

# 4. Show Status
Write-Host "✅ All systems operational!" -ForegroundColor Green
Write-Host "---------------------------------------"
Write-Host "📊 Dashboard:     http://localhost:3000"
Write-Host "⚡ Batch Manager: Running in background"
Write-Host "⏰ Expiry Guard:  Running in background"
Write-Host "---------------------------------------"
Write-Host "use 'docker-compose logs -f' to follow logs."

# Ask to follow logs
$response = Read-Host "Do you want to follow logs now? (y/n)"
if ($response -eq 'y') {
    docker-compose logs -f
}
