# Fix Spring Boot MySQL Connection Issue

## Current Problem
Spring Boot backend is not starting because it cannot connect to MySQL database.

## Quick Fix Steps

### Step 1: Check Spring Boot Window
Look at the Spring Boot PowerShell window that opened. You should see an error message like:
- `Access denied for user 'root'@'localhost'` (password wrong)
- `Unknown database 'predictive_pulse'` (database doesn't exist)
- `Communications link failure` (MySQL not running)

### Step 2: Fix Based on Error

#### If Password Error:
1. Open: `backend/src/main/resources/application.properties`
2. Find this line:
   ```properties
   spring.datasource.password=root
   ```
3. Change `root` to your actual MySQL password
4. Save the file
5. Restart Spring Boot (close window and run startup script again)

#### If Database Doesn't Exist:
1. Open MySQL command line or MySQL Workbench
2. Run:
   ```sql
   CREATE DATABASE IF NOT EXISTS predictive_pulse;
   ```
3. Restart Spring Boot

#### If MySQL Not Running:
1. Start MySQL service
2. Verify it's running: `netstat -ano | findstr ":3306"`

### Step 3: Test MySQL Connection Manually

Open MySQL and test:
```sql
-- Connect to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE IF NOT EXISTS predictive_pulse;

-- Verify
SHOW DATABASES;
```

### Step 4: Restart Spring Boot

After fixing the issue:
1. Close the Spring Boot PowerShell window
2. Run: `.\start-all-services.ps1`
3. Wait 60 seconds
4. Check if port 8080 is listening: `netstat -ano | findstr ":8080"`

## Current Configuration

File: `backend/src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/predictive_pulse?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC&autoReconnect=true
spring.datasource.username=root
spring.datasource.password=root  ← CHANGE THIS IF YOUR PASSWORD IS DIFFERENT
spring.jpa.hibernate.ddl-auto=update
```

## Verification

Once Spring Boot starts, you should see:
- ✅ Spring Boot Backend (8080): RUNNING
- No errors in the Spring Boot window
- Frontend can make predictions successfully

## Still Having Issues?

1. Check MySQL is running: `netstat -ano | findstr ":3306"`
2. Test MySQL connection: `mysql -u root -p`
3. Verify database exists: `SHOW DATABASES;`
4. Check Spring Boot window for specific error messages
5. Update password in `application.properties` if needed
