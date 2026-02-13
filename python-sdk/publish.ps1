# Publish script for Shelby SDK

param (
    [string]$env = "test"
)

Write-Host "📦 Building distribution packages..." -ForegroundColor Cyan

# Clean previous builds
if (Test-Path "dist") { Remove-Item "dist" -Recurse -Force }
if (Test-Path "build") { Remove-Item "build" -Recurse -Force }
if (Test-Path "shelby_sdk.egg-info") { Remove-Item "shelby_sdk.egg-info" -Recurse -Force }

# Upgrade build tools
python -m pip install --upgrade build twine

# Build
python -m build

if (-not (Test-Path "dist")) {
    Write-Error "Build failed!"
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

if ($env -eq "prod") {
    Write-Host "🚀 Publishing to PyPI (Production)..." -ForegroundColor Yellow
    python -m twine upload dist/*
}
elseif ($env -eq "test") {
    Write-Host "🧪 Publishing to TestPyPI..." -ForegroundColor Yellow
    python -m twine upload --repository testpypi dist/*
}
else {
    Write-Host "Unknown environment '$env'. Use 'test' or 'prod'." -ForegroundColor Red
    exit 1
}
