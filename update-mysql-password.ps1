# MySQL Password Configuration Helper
# 
# INSTRUCTIONS:
# 1. Find your MySQL root password (check MySQL Workbench or try: mysql -u root -p)
# 2. Replace YOUR_PASSWORD_HERE below with your actual MySQL password
# 3. Save this file
# 4. Run: .\update-mysql-password.ps1

$password = "YOUR_PASSWORD_HERE"

$propsFile = "backend\src\main\resources\application.properties"
$content = Get-Content $propsFile -Raw
$content = $content -replace "spring.datasource.password=root", "spring.datasource.password=$password"
$content | Set-Content $propsFile -NoNewline

Write-Host "Updated MySQL password in application.properties" -ForegroundColor Green
Write-Host "Password set to: $password" -ForegroundColor Yellow
Write-Host ""
Write-Host "Now restart Spring Boot!" -ForegroundColor Cyan
