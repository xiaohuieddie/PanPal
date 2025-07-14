const axios = require('axios');

const BASE_URL = 'http://localhost:5001/panpal-backend/us-central1/api';

// Test data
const testUserProfile = {
  id: 'test-user-123',
  name: 'Test User',
  age: 30,
  gender: 'male',
  height: 175,
  weight: 70,
  goal: 'lose_fat',
  cuisinePreferences: ['Chinese', 'Italian'],
  allergies: ['nuts'],
  dislikes: ['cilantro'],
  cookingTime: '15-30',
  budget: 'standard'
};

async function testAIApi() {
  console.log('🧪 Testing PanPal AI API...\n');

  try {
    // Test 1: Generate meal plan
    console.log('1. Testing meal plan generation...');
    const generateResponse = await axios.post(`${BASE_URL}/ai/generate-meal-plan`, testUserProfile);
    console.log('✅ Meal plan generated successfully');
    console.log('   Week:', generateResponse.data.data.week);
    console.log('   Days:', generateResponse.data.data.meals.length);
    console.log('   Sample breakfast:', generateResponse.data.data.meals[0].breakfast.name);
    console.log('');

    // Test 2: Get meal plan for specific week
    console.log('2. Testing meal plan retrieval...');
    const week = generateResponse.data.data.week;
    const getResponse = await axios.get(`${BASE_URL}/ai/meal-plan/${week}`);
    console.log('✅ Meal plan retrieved successfully');
    console.log('   Week:', getResponse.data.data.week);
    console.log('');

    // Test 3: Get recipe suggestions
    console.log('3. Testing recipe suggestions...');
    const suggestionsResponse = await axios.get(`${BASE_URL}/ai/recipe-suggestions?mealType=breakfast&limit=5`);
    console.log('✅ Recipe suggestions retrieved successfully');
    console.log('   Suggestions count:', suggestionsResponse.data.data.length);
    console.log('   Sample suggestion:', suggestionsResponse.data.data[0]?.name);
    console.log('');

    console.log('🎉 All AI API tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run tests
testAIApi(); 