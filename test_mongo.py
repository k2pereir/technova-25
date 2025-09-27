from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, PyMongoError
import os

app = Flask(__name__)
CORS(app)  

def get_mongo_client():
    try:
        client = MongoClient(os.getenv("MONGODB_URI"))
        client.admin.command('ping')
        return client
    except ConnectionFailure:
        return None

@app.route('/api/recipes', methods=['POST'])
def add_recipe():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        ingredients = data.get('ingredients', [])
        preferences = data.get('preferences', {})
        
        if not ingredients:
            return jsonify({'error': 'Ingredients are required'}), 400
        
        client = get_mongo_client()
        if not client:
            return jsonify({'error': 'Failed to connect to database'}), 500
        
        db = client["whiskful-thinking"]
        recipes_collection = db["recipes"]
        
        result = recipes_collection.insert_one({
            "ingredients": ingredients,
            "preferences": preferences
        })
        
        client.close()
        
        return jsonify({
            'success': True,
            'id': str(result.inserted_id),
            'message': 'Recipe added successfully'
        }), 201
        
    except PyMongoError as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)