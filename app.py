from flask import Flask, request, jsonify, send_from_directory
import joblib
import numpy as np
from datetime import datetime
import os

app = Flask(__name__)

# Load all four models
models = {
    "model1": joblib.load("models/demand_prediction_model1.pkl"),
    "model2": joblib.load("models/demand_prediction_model2.pkl"),
    "model3": joblib.load("models/demand_prediction.pkl"),  # Newly added
    "model4": joblib.load("models/demand_prediction_model2.pkl")  # Newly added
}

@app.route("/")
def home():
    return send_from_directory("static", "index.html")

@app.route('/all_markers.html')
def all_markers():
    return send_from_directory("templates",'all_markers.html')  # Serve index.html properly

@app.route('/heatmap.html')
def heatmap():
    return send_from_directory("templates",'heatmap.html')  # Serve index.html properly

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    model_choice = data.get("model", "model1")  # Default to model1
    latitude = float(data["latitude"])
    longitude = float(data["longitude"])
    time_str = data["time"]

    # Convert time to numerical format (minutes since midnight)
    time_obj = datetime.strptime(time_str, "%H:%M")
    time_numeric = time_obj.hour * 60 + time_obj.minute

    # Prepare input for model
    input_features = np.array([[latitude, longitude, time_numeric]])

    # Ensure the selected model exists
    if model_choice not in models:
        return jsonify({"error": "Invalid model choice"}), 400

    prediction = models[model_choice].predict(input_features)

    # Convert prediction result
    demand_status = "High" if prediction[0] == 1 else "Low"

    return jsonify({"demand": demand_status})

if __name__ == "__main__":
    app.run(debug=True)
