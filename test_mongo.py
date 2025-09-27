from pymongo import MongoClient
import os

def mongo(ingredients, preferences):
    client = MongoClient(os.getenv("MONGODB_URI"))

    db = client["whiskful-thinking"]
    ingredients_collection = db["ingredients"]
    preferences_collection = db["preferences"]

    ingredients_result = ingredients_collection.insert_one({"ingredients": ingredients})
    preferences_result = preferences_collection.insert_one({"preferences": preferences})
    print("Inserted with ID:", preferences_result.inserted_id, ingredients_result.inserted_id)

def main():
    ingredients = ["tomatoes, pineapple, beans"]  
    preferences = {
        "dietary_restrictions": "none",
        "cuisine_preferences": "Any",
        "cooking_time": "80 minutes",
        "skill_level": "beginner"
    }
    mongo(ingredients, preferences)
    print("should've been added!")

if __name__ == "__main__":
    main()