import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
import joblib
import os

# Set random seed for reproducibility
np.random.seed(42)

# Generate synthetic data
def generate_data(num_samples=5000):
    transport_modes = ['car', 'bus', 'metro', 'bike', 'walking']
    weather_conditions = ['clear', 'rain', 'snow', 'fog']
    traffic_levels = ['low', 'medium', 'high']
    
    data = []
    
    for _ in range(num_samples):
        mode = np.random.choice(transport_modes)
        weather = np.random.choice(weather_conditions)
        traffic = np.random.choice(traffic_levels)
        
        # Distance between 0.5km and 50km
        distance = round(np.random.uniform(0.5, 50.0), 2)
        
        # Base speeds (km/h)
        speeds = {'car': 40, 'bus': 25, 'metro': 35, 'bike': 15, 'walking': 5}
        base_speed = speeds[mode]
        
        # Traffic multiplier on speed
        if mode in ['car', 'bus']:
            if traffic == 'high':
                base_speed *= 0.5
            elif traffic == 'medium':
                base_speed *= 0.8
                
        # Weather multiplier on speed
        if weather in ['rain', 'snow']:
            if mode in ['bike', 'walking']:
                base_speed *= 0.7
            else:
                base_speed *= 0.8
                
        # Calculate time in minutes
        time = round((distance / base_speed) * 60, 2)
        
        # Calculate Carbon Emission (kg CO2 per km)
        emission_factors = {
            'car': 0.192,
            'bus': 0.105, # Assuming average occupancy
            'metro': 0.065,
            'bike': 0.0,
            'walking': 0.0
        }
        
        # Traffic increases emissions for cars and buses
        emission_factor = emission_factors[mode]
        if mode in ['car', 'bus'] and traffic == 'high':
            emission_factor *= 1.3
            
        carbon_emission = round(distance * emission_factor, 3)
        
        # Eco Score Calculation Calculate a heuristic score to train the model on
        # Score is 0-100, higher is better (greener, faster)
        # 1. Base score heavily weighted by emission
        max_emission = 50.0 * 0.192 * 1.3 # Max possible emission roughly
        emission_score = max(0, 100 - (carbon_emission / max_emission) * 100)
        
        # 2. Add some penalty for extreme times relative to distance
        time_penalty = 0
        if time > 120: 
            time_penalty = 10
            
        eco_score = round(max(0, min(100, emission_score - time_penalty)), 2)
        
        # Special adjustment for active transport
        if mode in ['bike', 'walking']:
            eco_score = min(100, eco_score + 10) # Bonus for zero emission
            
        data.append({
            'distance': distance,
            'travel_time': time,
            'transport_mode': mode,
            'traffic_level': traffic,
            'weather_conditions': weather,
            'carbon_emission': carbon_emission,
            'eco_score': eco_score
        })
        
    return pd.DataFrame(data)

def train_and_save_model():
    print("Generating synthetic data...")
    df = generate_data(10000)
    
    # Feature engineering / Encoding
    label_encoders = {}
    categorical_cols = ['transport_mode', 'traffic_level', 'weather_conditions']
    
    for col in categorical_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        label_encoders[col] = le
        
    # We want to predict both eco_score and carbon_emission.
    # We can train two separate models or a MultiOutputRegressor. 
    # For simplicity and distinct predictions, we'll train two Random Forest models.
    
    X = df[['distance', 'travel_time', 'transport_mode', 'traffic_level', 'weather_conditions']]
    y_eco = df['eco_score']
    y_carbon = df['carbon_emission']
    
    # Scale numerical features
    scaler = StandardScaler()
    X[['distance', 'travel_time']] = scaler.fit_transform(X[['distance', 'travel_time']])
    
    print("Training Eco Score Model...")
    X_train, X_test, y_eco_train, y_eco_test = train_test_split(X, y_eco, test_size=0.2, random_state=42)
    eco_model = RandomForestRegressor(n_estimators=100, random_state=42)
    eco_model.fit(X_train, y_eco_train)
    print(f"Eco Score Model R^2: {eco_model.score(X_test, y_eco_test):.4f}")
    
    print("Training Carbon Emission Model...")
    X_train, X_test, y_carbon_train, y_carbon_test = train_test_split(X, y_carbon, test_size=0.2, random_state=42)
    carbon_model = RandomForestRegressor(n_estimators=100, random_state=42)
    carbon_model.fit(X_train, y_carbon_train)
    print(f"Carbon Emission Model R^2: {carbon_model.score(X_test, y_carbon_test):.4f}")
    
    # Save the models and preprocessing objects
    print("Saving models to disk...")
    os.makedirs('ml-model', exist_ok=True)
    joblib.dump(eco_model, 'model_eco.pkl')
    joblib.dump(carbon_model, 'model_carbon.pkl')
    joblib.dump(scaler, 'scaler.pkl')
    joblib.dump(label_encoders, 'label_encoders.pkl')
    print("Done! Models saved successfully.")

if __name__ == '__main__':
    train_and_save_model()
