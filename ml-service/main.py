import os
from typing import Literal

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, conint, confloat
from sklearn.ensemble import RandomForestClassifier


MODEL_PATH = "bp_model.pkl"


class PredictRequest(BaseModel):
    age: conint(ge=18, le=120)
    bmi: confloat(ge=10, le=60)
    systolic_bp: conint(ge=60, le=260)
    diastolic_bp: conint(ge=40, le=200)
    cholesterol: conint(ge=80, le=400)
    smoking: conint(ge=0, le=1)
    diabetes: conint(ge=0, le=1)


class PredictResponse(BaseModel):
    risk: Literal["High", "Low"]
    confidence: float


app = FastAPI(title="Predictive Pulse - Hypertension Risk Predictor")

origins = [
    "http://localhost:8080",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def generate_synthetic_data(n_rows: int = 1000) -> pd.DataFrame:
    rng = np.random.default_rng(seed=42)

    age = rng.integers(18, 90, size=n_rows)
    bmi = rng.uniform(18, 40, size=n_rows)
    systolic_bp = rng.integers(90, 200, size=n_rows)
    diastolic_bp = rng.integers(60, 120, size=n_rows)
    cholesterol = rng.integers(150, 300, size=n_rows)
    smoking = rng.integers(0, 2, size=n_rows)
    diabetes = rng.integers(0, 2, size=n_rows)

    # Base risk score with some weighting
    risk_score = (
        0.03 * (age - 40)
        + 0.08 * (bmi - 25)
        + 0.06 * (systolic_bp - 130)
        + 0.05 * (diastolic_bp - 80)
        + 0.02 * (cholesterol - 200) / 10
        + 0.8 * smoking
        + 0.9 * diabetes
    )

    # Add noise to avoid a hard rule and keep accuracy realistic
    noise = rng.normal(0, 1.8, size=n_rows)
    risk_score_noisy = risk_score + noise

    prob_high = 1 / (1 + np.exp(-risk_score_noisy / 4))
    y = (prob_high > 0.5).astype(int)

    data = pd.DataFrame(
        {
            "age": age,
            "bmi": bmi,
            "systolic_bp": systolic_bp,
            "diastolic_bp": diastolic_bp,
            "cholesterol": cholesterol,
            "smoking": smoking,
            "diabetes": diabetes,
            "target": y,
        }
    )

    return data


def train_and_save_model(path: str = MODEL_PATH) -> RandomForestClassifier:
    data = generate_synthetic_data(1000)
    feature_cols = [
        "age",
        "bmi",
        "systolic_bp",
        "diastolic_bp",
        "cholesterol",
        "smoking",
        "diabetes",
    ]
    X = data[feature_cols]
    y = data["target"]

    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=5,
        min_samples_leaf=10,
        random_state=42,
    )
    model.fit(X, y)
    joblib.dump(model, path)
    return model


model: RandomForestClassifier | None = None


@app.on_event("startup")
def load_or_create_model() -> None:
    global model
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
    else:
        model = train_and_save_model(MODEL_PATH)


@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest) -> PredictResponse:
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    features = np.array(
        [
            [
                request.age,
                request.bmi,
                request.systolic_bp,
                request.diastolic_bp,
                request.cholesterol,
                request.smoking,
                request.diabetes,
            ]
        ]
    )

    try:
        proba = model.predict_proba(features)[0]
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Inference error: {exc}") from exc

    # Assuming classes [0, 1]; get probability of class 1 (High)
    if len(proba) == 2:
        prob_high = float(proba[1])
    else:
        # Fallback in unexpected cases
        prob_high = float(proba.max())

    risk_label: Literal["High", "Low"] = "High" if prob_high >= 0.5 else "Low"
    confidence = round(prob_high * 100 if risk_label == "High" else (1 - prob_high) * 100, 1)

    return PredictResponse(risk=risk_label, confidence=confidence)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

