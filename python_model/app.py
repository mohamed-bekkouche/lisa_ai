from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os
import logging


logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

CORS(app, resources={
    r"/predict": {
        "origins": ["http://localhost:8000", "http://127.0.0.1:8000"],
        "methods": ["POST"],
        "allow_headers": ["Content-Type"]
    }
})

try:
    model = load_model('model.keras')
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Error loading model: {str(e)}")
    raise

class_labels = ['Lung_Opacity', 'Normal', 'Pneumonia']

def preprocess_image(img_path):
    try:
        logger.debug(f"Processing image at path: {img_path}")
        img = image.load_img(img_path, target_size=(64, 64))
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    except Exception as e:
        logger.error(f"Error preprocessing image: {str(e)}")
        raise

@app.route('/predict', methods=['POST'])
def predict():
    logger.info("Received prediction request")
    
    logger.debug(f"Request headers: {request.headers}")
    logger.debug(f"Request content type: {request.content_type}")
    
    if not request.is_json:
        logger.error("Request is not JSON")
        return jsonify({'error': 'Request must be JSON'}), 400
        
    data = request.get_json()
    logger.debug(f"Request data: {data}")
    
    img_path = data.get('imagePath')
    if not img_path:
        logger.error("No imagePath provided")
        return jsonify({'error': 'imagePath is required'}), 400

    if not os.path.exists(img_path):
        logger.error(f"Image not found at path: {img_path}")
        return jsonify({'error': 'Invalid image path'}), 400

    try:
        processed_img = preprocess_image(img_path)
        prediction = model.predict(processed_img)
        predicted_class = class_labels[np.argmax(prediction)]
        confidence = float(np.max(prediction))
        
        logger.info(f"Prediction successful: {predicted_class} (confidence: {confidence})")
        
        return jsonify({
            'predicted_class': predicted_class,
            'confidence': confidence
        })
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = 5001 
    logger.info(f"Starting Flask server on port {port}")
    app.run(port=port, debug=True)