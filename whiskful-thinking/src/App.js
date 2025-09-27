import React, { useState } from 'react';

const RecipeInputApp = () => {
  const [ingredients, setIngredients] = useState('');
  const [preferences, setPreferences] = useState({
    dietary_restrictions: '',
    cuisine_preferences: '',
    cooking_time: '',
    skill_level: 'beginner'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');

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
          preferences: preferences
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Recipe saved successfully!');
        // Reset inputs
        setIngredients('');
        setPreferences({
          dietary_restrictions: '',
          cuisine_preferences: '',
          cooking_time: '',
          skill_level: 'beginner'
        });
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            🍳 Whiskful Thinking Recipe Input
          </h1>
          
          <div className="space-y-6">
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
                  placeholder="vegetarian, vegan, gluten-free, etc."
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
                  placeholder="Italian, Asian, Mexican, etc."
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
                  placeholder="30 minutes, 1 hour, etc."
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

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 disabled:transform-none"
            >
              {loading ? 'Saving Recipe...' : 'Save Recipe'}
            </button>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mt-4 p-4 rounded-lg ${
              message.includes('Error') 
                ? 'bg-red-100 text-red-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">How to use:</h3>
          <ol className="text-blue-700 text-sm space-y-1">
            <li>1. Enter your ingredients separated by commas</li>
            <li>2. Fill in your cooking preferences (optional)</li>
            <li>3. Click "Save Recipe" to store in your database</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeInputApp;