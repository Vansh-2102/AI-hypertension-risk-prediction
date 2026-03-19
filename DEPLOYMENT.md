# Deployment Guide - Predictive Pulse

This guide covers multiple deployment options for the Predictive Pulse application.

## Table of Contents
1. [Local Deployment](#local-deployment)
2. [Docker Deployment](#docker-deployment)
3. [Cloud Deployment Options](#cloud-deployment-options)
4. [Production Considerations](#production-considerations)

---

## Local Deployment

### Prerequisites
- Python 3.8+
- Java 17+
- Node.js 18+
- MySQL 8.0+

### Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/Vansh-2102/AI-hypertension-risk-prediction.git
   cd AI-hypertension-risk-prediction
   ```

2. **Set up MySQL**
   ```sql
   CREATE DATABASE predictive_pulse;
   ```

3. **Configure Backend**
   - Update `backend/src/main/resources/application.properties` with your MySQL credentials

4. **Start Services**
   ```bash
   # Terminal 1 - Python ML Service
   cd ml-service
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000

   # Terminal 2 - Spring Boot Backend
   cd backend
   ./mvnw spring-boot:run

   # Terminal 3 - React Frontend
   cd frontend
   npm install
   npm run dev
   ```

5. **Access Application**
   - Frontend: http://localhost:5173
   - ML API: http://localhost:8000/docs
   - Backend API: http://localhost:8080/api

---

## Docker Deployment

### Option 1: Docker Compose (Recommended)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: predictive-pulse-mysql
    environment:
      MYSQL_ROOT_PASSWORD: your_password
      MYSQL_DATABASE: predictive_pulse
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  ml-service:
    build:
      context: ./ml-service
      dockerfile: Dockerfile
    container_name: predictive-pulse-ml
    ports:
      - "8000:8000"
    depends_on:
      - mysql
    environment:
      - PORT=8000

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: predictive-pulse-backend
    ports:
      - "8080:8080"
    depends_on:
      - mysql
      - ml-service
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/predictive_pulse
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=your_password
      - ML_SERVICE_URL=http://ml-service:8000

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: predictive-pulse-frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://localhost:8080/api

volumes:
  mysql_data:
```

### Create Dockerfiles

**ml-service/Dockerfile:**
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**backend/Dockerfile:**
```dockerfile
FROM maven:3.8.6-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jre-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**frontend/Dockerfile:**
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**frontend/nginx.conf:**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Deploy with Docker Compose
```bash
docker-compose up -d
```

---

## Cloud Deployment Options

### Option 1: AWS Deployment

#### Architecture
- **Frontend**: AWS S3 + CloudFront
- **Backend**: AWS Elastic Beanstalk or ECS
- **ML Service**: AWS ECS or Lambda
- **Database**: AWS RDS (MySQL)

#### Steps

1. **Deploy Frontend to S3**
   ```bash
   cd frontend
   npm run build
   aws s3 sync dist/ s3://your-bucket-name
   aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
   ```

2. **Deploy Backend to Elastic Beanstalk**
   ```bash
   cd backend
   mvn clean package
   eb init -p java-17
   eb create predictive-pulse-backend
   eb deploy
   ```

3. **Deploy ML Service to ECS**
   - Create ECR repository
   - Build and push Docker image
   - Create ECS task definition
   - Deploy to ECS cluster

4. **Create RDS MySQL Instance**
   - Create RDS MySQL 8.0 instance
   - Update backend environment variables

### Option 2: Heroku Deployment

#### Frontend (Heroku)
```bash
cd frontend
npm install -g heroku
heroku create your-app-name-frontend
git subtree push --prefix frontend heroku main
```

#### Backend (Heroku)
```bash
cd backend
heroku create your-app-name-backend
heroku addons:create cleardb:ignite  # MySQL addon
heroku config:set SPRING_DATASOURCE_URL=$DATABASE_URL
git subtree push --prefix backend heroku main
```

#### ML Service (Heroku)
```bash
cd ml-service
heroku create your-app-name-ml
git subtree push --prefix ml-service heroku main
```

### Option 3: Railway Deployment

1. **Connect GitHub Repository**
   - Go to railway.app
   - New Project → Deploy from GitHub
   - Select your repository

2. **Configure Services**
   - Add MySQL service
   - Add Python service (ML)
   - Add Java service (Backend)
   - Add Node service (Frontend)

3. **Set Environment Variables**
   - Database connection strings
   - Service URLs
   - API keys

### Option 4: Render Deployment

#### Frontend
1. Create new Static Site
2. Connect GitHub repository
3. Build command: `cd frontend && npm install && npm run build`
4. Publish directory: `frontend/dist`

#### Backend
1. Create new Web Service
2. Environment: Java
3. Build command: `cd backend && ./mvnw clean package`
4. Start command: `java -jar backend/target/*.jar`

#### ML Service
1. Create new Web Service
2. Environment: Python
3. Build command: `cd ml-service && pip install -r requirements.txt`
4. Start command: `cd ml-service && uvicorn main:app --host 0.0.0.0 --port $PORT`

---

## Production Considerations

### Security
1. **Environment Variables**
   - Never commit passwords/secrets
   - Use environment variables or secret managers
   - Update `.gitignore` to exclude sensitive files

2. **HTTPS**
   - Use SSL certificates
   - Configure reverse proxy (Nginx/Apache)
   - Enable HTTPS redirects

3. **CORS Configuration**
   - Update CORS origins in backend and ML service
   - Remove localhost origins in production

### Performance
1. **Database Optimization**
   - Add indexes to frequently queried columns
   - Use connection pooling
   - Enable query caching

2. **Caching**
   - Implement Redis for session management
   - Cache ML model predictions
   - Use CDN for static assets

3. **Monitoring**
   - Add logging (Log4j, Winston)
   - Set up application monitoring (New Relic, Datadog)
   - Monitor database performance

### Scalability
1. **Load Balancing**
   - Use load balancer for multiple instances
   - Configure health checks
   - Implement auto-scaling

2. **Database**
   - Consider read replicas
   - Implement database sharding if needed
   - Regular backups

3. **ML Service**
   - Deploy multiple instances
   - Use model caching
   - Consider GPU instances for larger models

### Backup & Recovery
1. **Database Backups**
   - Daily automated backups
   - Test restore procedures
   - Keep multiple backup copies

2. **Code Versioning**
   - Use Git tags for releases
   - Maintain changelog
   - Document deployment procedures

---

## Quick Deploy Scripts

### Production Build Script

Create `deploy-production.sh`:
```bash
#!/bin/bash

echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Building backend..."
cd backend
./mvnw clean package -DskipTests
cd ..

echo "Building ML service..."
cd ml-service
pip install -r requirements.txt
cd ..

echo "Build complete!"
```

### Environment Variables Template

Create `.env.example`:
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=predictive_pulse
DB_USER=root
DB_PASSWORD=your_password

# ML Service
ML_SERVICE_URL=http://localhost:8000

# Backend
SPRING_PROFILES_ACTIVE=production
SERVER_PORT=8080

# Frontend
VITE_API_URL=http://localhost:8080/api
```

---

## Support

For deployment issues, check:
- [GitHub Issues](https://github.com/Vansh-2102/AI-hypertension-risk-prediction/issues)
- [Documentation](./README.md)
- [MySQL Setup Guide](./MYSQL_SETUP.md)
