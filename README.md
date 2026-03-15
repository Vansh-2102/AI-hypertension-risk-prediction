# Predictive Pulse - Hypertension Risk Predictor

A full-stack web application that uses machine learning to predict hypertension risk based on patient clinical metrics. Built with React, Spring Boot, and Python FastAPI.

## Project Structure

```
predictive-pulse/
├── ml-service/          # Python FastAPI ML microservice
├── backend/             # Spring Boot REST API
└── frontend/            # React frontend application
```

## Prerequisites

- Python 3.8+
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.6+

## Setup Instructions

### 1. Database Setup

Create a MySQL database named `predictive_pulse`:

```sql
CREATE DATABASE predictive_pulse;
```

Update database credentials in `backend/src/main/resources/application.properties` if needed.

### 2. Running the Application

Open three separate terminal windows:

#### Terminal 1 — Python ML Service

```bash
cd ml-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The ML service will automatically train a model on first startup if `bp_model.pkl` doesn't exist.

#### Terminal 2 — Spring Boot Backend

```bash
cd backend
./mvnw spring-boot:run
```

Or on Windows:

```bash
cd backend
mvnw.cmd spring-boot:run
```

The backend will start on port 8080 and connect to MySQL.

#### Terminal 3 — React Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on port 5173 (Vite default).

## Access the Application

Open your browser and navigate to: **http://localhost:5173**

## Features

- **Risk Prediction**: Enter patient metrics to get ML-powered hypertension risk assessment
- **Prediction History**: View all past predictions stored in the database
- **Clinical Insights**: Receive personalized recommendations based on risk level
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## API Endpoints

### Backend (Spring Boot - Port 8080)

- `POST /api/predict` - Submit patient data and get risk prediction
- `GET /api/history` - Retrieve all prediction history

### ML Service (Python FastAPI - Port 8000)

- `POST /predict` - Internal endpoint for ML model predictions

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Axios, React Router DOM
- **Backend**: Spring Boot 3.x, Spring Data JPA, MySQL, Lombok
- **ML Service**: Python FastAPI, scikit-learn, Random Forest Classifier

## Notes

- The ML model is automatically trained on synthetic data if no model file exists
- All predictions are persisted to MySQL for historical tracking
- The application includes comprehensive error handling at all layers

## Disclaimer

This tool is for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.
