from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI(
    title="EcoRoute ML API",
    description="Predicts eco score and carbon emissions for routes"
)

# Load models and preprocessors
try:
    eco_model = joblib.load("model_eco.pkl")
    carbon_model = joblib.load("model_carbon.pkl")
    scaler = joblib.load("scaler.pkl")
    label_encoders = joblib.load("label_encoders.pkl")
    print("✅ Models loaded successfully")
except Exception as e:
    print(f"❌ Error loading models. Did you run train_model.py first? {e}")
    eco_model = None
    carbon_model = None
    scaler = None
    label_encoders = None


# Request schema
class RouteFeatures(BaseModel):
    distance: float
    travel_time: float
    transport_mode: str
    traffic_level: str
    weather_conditions: str


# Root endpoint
@app.get("/")
def home():
    return {"message": "EcoRoute ML API running"}


# Health check
@app.get("/health")
def health_check():
    return {"status": "ok"}


# Prediction endpoint
@app.post("/predict-eco-score")
def predict_score(features: RouteFeatures):

    if eco_model is None:
        raise HTTPException(status_code=500, detail="Models not loaded")

    try:
        # Validate categories
        if features.transport_mode not in label_encoders["transport_mode"].classes_:
            features.transport_mode = "car"

        if features.traffic_level not in label_encoders["traffic_level"].classes_:
            features.traffic_level = "medium"

        if features.weather_conditions not in label_encoders["weather_conditions"].classes_:
            features.weather_conditions = "clear"

        # Encode categorical values
        encoded_mode = label_encoders["transport_mode"].transform([features.transport_mode])[0]
        encoded_traffic = label_encoders["traffic_level"].transform([features.traffic_level])[0]
        encoded_weather = label_encoders["weather_conditions"].transform([features.weather_conditions])[0]

        # Scale numerical values
        scaled_nums = scaler.transform([[features.distance, features.travel_time]])

        # Model input
        X = np.array([[
            scaled_nums[0][0],
            scaled_nums[0][1],
            encoded_mode,
            encoded_traffic,
            encoded_weather
        ]])

        # Predictions
        eco_score = float(eco_model.predict(X)[0])
        carbon_emission = float(carbon_model.predict(X)[0])

        return {
            "eco_score": round(max(0, min(100, eco_score)), 2),
            "predicted_carbon_emission": round(max(0, carbon_emission), 3)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))