const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/your-project-id/us-central1/api';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
  age: 25,
  gender: 'male',
  height: 175,
  weight: 70,
  goal: 'lose_fat',
  cuisinePreferences: ['chinese', 'healthy'],
  allergies: [],
  dislikes: [],
  cookingTime: '15-30',
  budget: 'standard'
};

async function testAPI() {
  console.log('🧪 Testing PanPal API...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.message);

    // Test signup
    console.log('\n2. Testing user signup...');
    const signupResponse = await axios.post(`${API_BASE_URL}/auth/signup`, testUser);
    console.log('✅ Signup successful:', signupResponse.data.data.user.name);
    
    const token = signupResponse.data.data.token;

    // Test signin
    console.log('\n3. Testing user signin...');
    const signinResponse = await axios.post(`${API_BASE_URL}/auth/signin`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Signin successful');

    // Test get profile
    console.log('\n4. Testing get profile...');
    const profileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Get profile successful:', profileResponse.data.data.name);

    // Test update profile
    console.log('\n5. Testing update profile...');
    const updateResponse = await axios.put(`${API_BASE_URL}/auth/profile`, {
      name: 'Updated Test User'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Update profile successful:', updateResponse.data.data.name);

    // Test token verification
    console.log('\n6. Testing token verification...');
    const verifyResponse = await axios.post(`${API_BASE_URL}/auth/verify`, {
      token: token
    });
    console.log('✅ Token verification successful');

    console.log('\n🎉 All tests passed!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      console.log('\n💡 Make sure the Firebase Functions are running:');
      console.log('   npm run serve');
    }
  }
}

// Run tests
testAPI(); 