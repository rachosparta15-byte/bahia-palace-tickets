param()
# Package Next.js standalone build for cPanel deployment
# Run from project root: .\scripts\package-for-cpanel.ps1

$root = Split-Path $PSScriptRoot -Parent
$out  = Join-Path $root ".next\standalone"
$dest = Join-Path $root "cpanel-deploy"

Write-Host "`n=== Bahia Palace - cPanel Package ===" -ForegroundColor Cyan

if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
New-Item -ItemType Directory -Path $dest | Out-Null

# 1. Standalone server
Write-Host "Copying standalone server..." -ForegroundColor Yellow
Copy-Item "$out\*" $dest -Recurse -Force

# 2. Static assets
Write-Host "Copying static assets..." -ForegroundColor Yellow
$staticDest = Join-Path $dest ".next\static"
New-Item -ItemType Directory -Path $staticDest -Force | Out-Null
Copy-Item "$root\.next\static\*" "$staticDest\" -Recurse -Force

# 3. Public folder
Write-Host "Copying public folder..." -ForegroundColor Yellow
$pubDest = Join-Path $dest "public"
New-Item -ItemType Directory -Path $pubDest -Force | Out-Null
if (Test-Path "$root\public") {
    Copy-Item "$root\public\*" "$pubDest\" -Recurse -Force
}

# 4. Database
Write-Host "Copying database..." -ForegroundColor Yellow
if (Test-Path "$root\dev.db") {
    Copy-Item "$root\dev.db" "$dest\bahia.db" -Force
}

# 5. .env template
Write-Host "Creating .env template..." -ForegroundColor Yellow
$lines = @(
    '# PRODUCTION .env - edit before uploading to cPanel',
    '# Replace yourusername and yourdomain.com with real values',
    '',
    '# Database - absolute path on cPanel server',
    'DATABASE_URL=file:/home/yourusername/yourdomain.com/bahia.db',
    '',
    '# Payment: mock (Phase A) or stripe (Phase B)',
    'PAYMENT_PROVIDER=mock',
    'STRIPE_SECRET_KEY=',
    'STRIPE_WEBHOOK_SECRET=',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=',
    '',
    '# Email: mock (Phase A) or resend (Phase B)',
    'EMAIL_PROVIDER=mock',
    'RESEND_API_KEY=',
    'EMAIL_FROM=tickets@yourdomain.com',
    '',
    '# Auth - generate: openssl rand -base64 32',
    'NEXTAUTH_SECRET=CHANGE_THIS_TO_RANDOM_SECRET',
    'NEXTAUTH_URL=https://yourdomain.com',
    '',
    '# WhatsApp (no +)',
    'NEXT_PUBLIC_WHATSAPP_NUMBER=212600000000',
    '',
    '# Site URL',
    'NEXT_PUBLIC_SITE_URL=https://yourdomain.com'
)
Set-Content -Path "$dest\.env" -Value $lines -Encoding UTF8

# 6. app.js entry point for cPanel
$appJsLines = @(
    "process.env.NODE_ENV = 'production';",
    "require('./server.js');"
)
Set-Content -Path "$dest\app.js" -Value $appJsLines -Encoding UTF8

# 7. .htaccess for Apache proxy
$htLines = @(
    'DirectoryIndex disabled',
    'RewriteEngine On',
    'RewriteRule ^$ http://127.0.0.1:3000/ [P,L]',
    'RewriteCond %{REQUEST_FILENAME} !-f',
    'RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]'
)
Set-Content -Path "$dest\.htaccess" -Value $htLines -Encoding UTF8

# 8. ZIP
Write-Host "Creating ZIP archive..." -ForegroundColor Yellow
$zipPath = Join-Path $root "bahia-palace-cpanel.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path "$dest\*" -DestinationPath $zipPath -Force

$sizeMB = [math]::Round((Get-Item $zipPath).Length / 1MB, 1)
Write-Host "`n  Done! bahia-palace-cpanel.zip ($sizeMB MB)" -ForegroundColor Green
Write-Host "`n  BEFORE uploading, edit cpanel-deploy\.env:" -ForegroundColor Cyan
Write-Host "  - DATABASE_URL : absolute path on server" -ForegroundColor White
Write-Host "  - NEXTAUTH_SECRET : random string" -ForegroundColor White
Write-Host "  - NEXTAUTH_URL : https://yourdomain.com" -ForegroundColor White
Write-Host "  - NEXT_PUBLIC_SITE_URL : https://yourdomain.com" -ForegroundColor White
