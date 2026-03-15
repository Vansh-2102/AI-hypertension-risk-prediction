# Predictive Pulse - Complete Startup Script
# This script starts all three services for the application

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Predictive Pulse - Startup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Stop any existing processes
Write-Host "Stopping existing services..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -match "java|node|python|uvicorn"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "✓ Stopped existing processes" -ForegroundColor Green
Write-Host ""

# Check MySQL
Write-Host "Checking MySQL..." -ForegroundColor Yellow
$mysqlRunning = netstat -ano | findstr ":3306" | Select-String "LISTENING"
if (-not $mysqlRunning) {
    Write-Host "✗ MySQL is not running. Please start MySQL first!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ MySQL is running" -ForegroundColor Green
Write-Host ""

# Start Python ML Service
Write-Host "Starting Python ML Service (port 8000)..." -ForegroundColor Yellow
$mlServicePath = Join-Path $PSScriptRoot "ml-service"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$mlServicePath'; Write-Host '=== Python ML Service ===' -ForegroundColor Green; uvicorn main:app --reload --port 8000" -WindowStyle Minimized
Start-Sleep -Seconds 3
Write-Host "✓ Python ML Service started" -ForegroundColor Green
Write-Host ""

# Start React Frontend
Write-Host "Starting React Frontend (port 5173)..." -ForegroundColor Yellow
$frontendPath = Join-Path $PSScriptRoot "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host '=== React Frontend ===' -ForegroundColor Green; npm run dev" -WindowStyle Minimized
Start-Sleep -Seconds 3
Write-Host "✓ React Frontend started" -ForegroundColor Green
Write-Host ""

# Start Spring Boot Backend
Write-Host "Starting Spring Boot Backend (port 8080)..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "backend"
$javaHome = "C:\Program Files\Java\jdk-25"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; `$env:JAVA_HOME='$javaHome'; Write-Host '=== Spring Boot Backend ===' -ForegroundColor Green; Write-Host 'Connecting to MySQL database: predictive_pulse' -ForegroundColor Cyan; Write-Host 'If you see connection errors, check application.properties' -ForegroundColor Yellow; .\mvnw.cmd spring-boot:run" -WindowStyle Normal
Start-Sleep -Seconds 3
Write-Host "✓ Spring Boot Backend started" -ForegroundColor Green
Write-Host ""

# Wait for services to start
Write-Host "Waiting for services to initialize (30 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Check status
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Service Status Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ml = netstat -ano | findstr ":8000" | Select-String "LISTENING"
$react = netstat -ano | findstr ":5173" | Select-String "LISTENING"
$spring = netstat -ano | findstr ":8080" | Select-String "LISTENING"
$mysql = netstat -ano | findstr ":3306" | Select-String "LISTENING"

Write-Host "Python ML Service (8000):" -NoNewline
if ($ml) { Write-Host " ✅ RUNNING" -ForegroundColor Green } else { Write-Host " ❌ NOT RUNNING" -ForegroundColor Red }

Write-Host "React Frontend (5173):" -NoNewline
if ($react) { Write-Host " ✅ RUNNING" -ForegroundColor Green } else { Write-Host " ❌ NOT RUNNING" -ForegroundColor Red }

Write-Host "Spring Boot Backend (8080):" -NoNewline
if ($spring) { Write-Host " ✅ RUNNING" -ForegroundColor Green } else { Write-Host " ❌ NOT RUNNING" -ForegroundColor Yellow }

Write-Host "MySQL Database (3306):" -NoNewline
if ($mysql) { Write-Host " ✅ RUNNING" -ForegroundColor Green } else { Write-Host " ❌ NOT RUNNING" -ForegroundColor Red }

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Access Points" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Frontend Application: http://localhost:5173" -ForegroundColor Magenta
Write-Host "📊 ML Service API Docs: http://localhost:8000/docs" -ForegroundColor Magenta
Write-Host "🔧 Backend API: http://localhost:8080/api" -ForegroundColor Magenta
Write-Host ""

if ($ml -and $react -and $spring -and $mysql) {
    Write-Host "🎉 ALL SERVICES RUNNING! Application is ready!" -ForegroundColor Green -BackgroundColor Black
} else {
    Write-Host "⚠️  Some services need attention:" -ForegroundColor Yellow
    if (-not $spring) {
        Write-Host "   - Check Spring Boot window for MySQL connection errors" -ForegroundColor White
        Write-Host "   - Verify MySQL password in backend/src/main/resources/application.properties" -ForegroundColor White
        Write-Host "   - Create database: CREATE DATABASE predictive_pulse;" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
