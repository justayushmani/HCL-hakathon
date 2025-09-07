# PowerShell script to run the development server
# Run with: .\run-dev.ps1

Write-Host "🚀 Starting Document Q&A System..." -ForegroundColor Green
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Start the development server
Write-Host "🔥 Starting development server..." -ForegroundColor Cyan
npm run dev
