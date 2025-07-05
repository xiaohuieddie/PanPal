import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Import Firebase configuration
// You need to create firebase.config.js in the root directory
let firebaseConfig;
try {
  firebaseConfig = require('../../firebase.config.js').firebaseConfig;
} catch (error) {
  // Fallback configuration - replace with your actual Firebase config
  firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
  };
  
  console.warn('Firebase config not found. Please create firebase.config.js with your Firebase project configuration.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db }; 