import React, { useState } from 'react';

function Header() {
  return (
    <header>
      <img 
        src="/cover for technova.png" 
        alt="Technova header"
        style={{
          width: '100%',
          maxHeight: '300px',
          objectFit: 'cover',
          display: 'block'
        }}
      />
    </header>
  );
}

const RecipeInputApp = () => {
  const [ingredients, setIngredients] = useState('');
  const [preferences, setPreferences] = useState({
    dietary_restrictions: '',
    cuisine_preferences: '',
    cooking_time: '',
    skill_level: 'beginner'
  });
  const [mealType, setMealType] = useState('meal');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [recipe, setRecipe] = useState('');

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGetRecipe = async () => {
    setLoading(true);
    setMessage('');
    setRecipe('');

    try {
      // Convert ingredients string to array
      const ingredientsArray = ingredients
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      if (ingredientsArray.length === 0) {
        setMessage('Please enter at least one ingredient');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: ingredientsArray,
          preferences: preferences,
          meal_type: mealType
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Recipe generated successfully!');
        setRecipe(data.recipe);
        // Reset inputs
        setIngredients('');
        setPreferences({
          dietary_restrictions: '',
          cuisine_preferences: '',
          cooking_time: '',
          skill_level: 'beginner'
        });
        setMealType('meal');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatRecipe = (recipeText) => {
    // Split the recipe into lines and format for better display
    return recipeText.split('\n').map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      
      // Make headers bold (lines that end with : or are all caps)
      if (line.includes(':') && line.trim().length < 50) {
        return <div key={index} className="font-bold text-lg mt-4 mb-2 text-orange-600">{line}</div>;
      }
      
      // Format numbered steps
      if (line.match(/^\d+\./)) {
        return <div key={index} className="mb-2 pl-4">{line}</div>;
      }
      
      // Format ingredient lists (lines starting with -)
      if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
        return <div key={index} className="ml-4 mb-1">{line}</div>;
      }
      
      return <div key={index} className="mb-2">{line}</div>;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <img 
        src="/cover for technova.png" 
        alt="Technova header"
        style={{
          width: '100%',
          maxHeight: '10000px',
          objectFit: 'cover',
          margin: -10,
        }}
      />
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            🍳 Whiskful Thinking Recipe Generator
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700">Recipe Inputs</h2>
              
              {/* Meal Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Type
                </label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                  <option value="dessert">Dessert</option>
                  <option value="meal">Any Meal</option>
                </select>
              </div>

              {/* Ingredients Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingredients (comma-separated)
                </label>
                <textarea
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="tomatoes, onions, garlic, pasta..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  rows="3"
                />
              </div>

              {/* Preferences Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Cooking Preferences</h3>
                
                {/* Dietary Restrictions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dietary Restrictions
                  </label>
                  <input
                    type="text"
                    value={preferences.dietary_restrictions}
                    onChange={(e) => handlePreferenceChange('dietary_restrictions', e.target.value)}
                    placeholder="vegan, nut allergy, etc"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {/* Cuisine Preferences */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuisine Preferences
                  </label>
                  <input
                    type="text"
                    value={preferences.cuisine_preferences}
                    onChange={(e) => handlePreferenceChange('cuisine_preferences', e.target.value)}
                    placeholder="none, Italian, Spicy, etc."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {/* Cooking Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Cooking Time
                  </label>
                  <input
                    type="text"
                    value={preferences.cooking_time}
                    onChange={(e) => handlePreferenceChange('cooking_time', e.target.value)}
                    placeholder="20 mins, 1 hour, etc."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {/* Skill Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Level
                  </label>
                  <select
                    value={preferences.skill_level}
                    onChange={(e) => handlePreferenceChange('skill_level', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Get Recipe Button */}
              <button
                onClick={handleGetRecipe}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 disabled:transform-none"
              >
                {loading ? 'Generating Recipe...' : 'Get Recipe'}
              </button>

              {/* Message Display */}
              {message && (
                <div className={`p-4 rounded-lg ${
                  message.includes('Error') 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {message}
                </div>
              )}
            </div>

            {/* Recipe Display Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">Generated Recipe</h2>
              
              {loading && (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="animate-pulse">
                    <div className="text-lg text-gray-500">Please hold, we're cooking up your recipe...</div>
                    <div className="text-sm text-gray-400 mt-2">This might take a few moments</div>
                  </div>
                </div>
              )}

              {recipe && !loading && (
                <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
                  <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {formatRecipe(recipe)}
                  </div>
                </div>
              )}

              {!recipe && !loading && (
                <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
                  Enter your ingredients and preferences, then click "Get Recipe" to generate a personalized recipe!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">How to use:</h3>
          <ol className="text-blue-700 text-sm space-y-1">
            <li>Choose your meal type</li>
            <li>Enter your ingredients separated by commas</li>
            <li>Fill in your cooking preferences (optional)</li>
            <li>Click "Get Recipe" to generate a personalized recipe</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeInputApp;