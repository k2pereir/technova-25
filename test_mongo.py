from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, PyMongoError
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app) 

def get_mongo_client():
    try:
        mongodb_uri = os.getenv("MONGODB_URI")
        client = MongoClient(mongodb_uri)
        client.admin.command('ping')
        return client
    except ConnectionFailure:
        return None

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-2.5-flash')

def generate_recipe(meal_type, ingredients, preferences):
    prompt = f"""
        Please create a detailed recipe for {meal_type} using all of the following ingredients: {', '.join(ingredients)}.
        Ensure that the flavours of the ingredients complement the recipe well. Avoid suggesting obscure or hard to find ingredients.
        You can include multiple courses if necessary (e.g ingredients don't compliment each other well).
        
        Please keep in mind the following preferences and constraints:
        - Dietary restrictions: {preferences.get('dietary_restrictions', 'None')}
        - Cuisine preferences: {preferences.get('cuisine_preferences', 'Any')}
        - Cooking time: {preferences.get('cooking_time', 'Two hours')}
        - Skill level: {preferences.get('skill_level', 'Beginner')}
        
        Please provide the following details:
        - Recipe name
        - Ingredients list with quantities in cups/teaspoons/tablespoons as appropriate.
        - Step by step cooking instructions
        - Estimated cooking time
        - Difficulty level
        
        Format the response clearly and make it practical for home cooking.
    """
    
    response = model.generate_content(prompt)
    return response.text

@app.route('/api/recipes', methods=['POST'])
def add_recipe_and_generate():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        ingredients = data.get('ingredients', [])
        preferences = data.get('preferences', {})
        meal_type = data.get('meal_type', 'meal')  # Default to 'meal' if not specified
        
        if not ingredients:
            return jsonify({'error': 'Ingredients are required'}), 400
        
        client = get_mongo_client()
        if not client:
            return jsonify({'error': 'Failed to connect to database'}), 500
        
        db = client["whiskful-thinking"]
        recipes_collection = db["recipes"]
        
        # Save to database
        result = recipes_collection.insert_one({
            "ingredients": ingredients,
            "preferences": preferences,
            "meal_type": meal_type
        })
        
        # Generate recipe using AI
        try:
            recipe_text = generate_recipe(meal_type, ingredients, preferences)
        except Exception as ai_error:
            client.close()
            return jsonify({'error': f'Failed to generate recipe: {str(ai_error)}'}), 500
        
        client.close()
        
        return jsonify({
            'success': True,
            'id': str(result.inserted_id),
            'recipe': recipe_text,
            'message': 'Recipe generated and saved successfully'
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