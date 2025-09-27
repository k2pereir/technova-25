import google.generativeai as genai
import os

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

def main():
    meal_type = "breakfast"
    ingredients = ["spinach, yogurt, onions"]  
    preferences = {
        "dietary_restrictions": "vegetarian",
        "cuisine_preferences": "Any",
        "cooking_time": "30 minutes",
        "skill_level": "intermediate"
    }
    recipe = generate_recipe(meal_type, ingredients, preferences)
    print(recipe)

if __name__ == "__main__":
    main()