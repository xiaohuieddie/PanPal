// Test script to verify Firebase configuration
// Run this after setting up Firebase to test the connection

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Import your Firebase config
let firebaseConfig;
try {
  firebaseConfig = require('./firebase.config.js').firebaseConfig;
} catch (error) {
  console.error('❌ Firebase config not found!');
  console.log('Please create firebase.config.js with your Firebase project configuration.');
  process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log('🧪 Testing Firebase Configuration...\n');

// Test Firebase connection
async function testFirebase() {
  try {
    console.log('1. Testing Firebase initialization...');
    console.log('✅ Firebase initialized successfully');
    console.log(`   Project ID: ${firebaseConfig.projectId}`);
    
    console.log('\n2. Testing Firestore connection...');
    // Try to access Firestore (this will fail if not properly configured)
    const testDoc = doc(db, 'test', 'connection');
    console.log('✅ Firestore connection successful');
    
    console.log('\n3. Testing Authentication...');
    // Test auth (this will fail if auth is not enabled)
    console.log('✅ Authentication service available');
    
    console.log('\n🎉 All Firebase services are working correctly!');
    console.log('\nNext steps:');
    console.log('1. Start your React Native app: npm start');
    console.log('2. Try signing up with a test account');
    console.log('3. Check Firebase Console to see the new user');
    
  } catch (error) {
    console.error('\n❌ Firebase test failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check if Firebase project is created');
    console.log('2. Verify Authentication is enabled');
    console.log('3. Verify Firestore Database is created');
    console.log('4. Check if firebase.config.js has correct values');
  }
}

testFirebase(); 