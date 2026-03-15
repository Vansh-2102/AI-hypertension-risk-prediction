# MySQL Setup Guide

## Issue
Spring Boot backend is not starting due to MySQL connection problems.

## Quick Fix Steps

### 1. Verify MySQL is Running
```powershell
netstat -ano | findstr ":3306"
```
Should show MySQL listening on port 3306.

### 2. Create the Database

Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE IF NOT EXISTS predictive_pulse;
```

### 3. Verify MySQL Credentials

Check your MySQL root password. The application is configured with:
- **Username:** `root`
- **Password:** `root`

If your MySQL password is different, update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.password=your_actual_password
```

### 4. Test MySQL Connection

Try connecting manually:
```powershell
mysql -u root -p
```
Enter your password when prompted.

### 5. Restart Spring Boot

After fixing the password, restart Spring Boot by:
1. Closing the Spring Boot PowerShell window
2. Running the startup script again: `.\start-all-services.ps1`

## Alternative: Use Different MySQL User

If you prefer to use a different MySQL user:

1. Create a new MySQL user:
```sql
CREATE USER 'predictivepulse'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON predictive_pulse.* TO 'predictivepulse'@'localhost';
FLUSH PRIVILEGES;
```

2. Update `application.properties`:
```properties
spring.datasource.username=predictivepulse
spring.datasource.password=your_password
```

## Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"
- Your MySQL password doesn't match what's in `application.properties`
- Update the password in the properties file

### Error: "Unknown database 'predictive_pulse'"
- The database doesn't exist
- Run: `CREATE DATABASE predictive_pulse;`

### Error: "Communications link failure"
- MySQL might not be running
- Start MySQL service
- Check firewall settings

## Current Configuration

File: `backend/src/main/resources/application.properties`
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/predictive_pulse?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
```
