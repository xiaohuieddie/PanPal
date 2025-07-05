# Firebase Setup Guide for PanPal React Native App

## 🚀 Quick Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it "PanPal" or "PanPal-Dev"
4. Follow the setup wizard (you can disable Google Analytics for now)

### 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Optionally enable "Custom" provider for WeChat integration later

### 3. Create Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location close to your users (e.g., "us-central1")

### 4. Register Your App

1. In your Firebase project, click "Add app" (</> icon)
2. Select "Web" platform
3. Register app with:
   - App nickname: "PanPal Web"
   - Firebase Hosting: No (for now)
4. Copy the configuration object

### 5. Configure Your App

1. Copy `firebase.config.example.js` to `firebase.config.js`
2. Replace the placeholder values with your actual Firebase config:

```javascript
export const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

### 6. Set Up Firestore Security Rules

1. Go to "Firestore Database" → "Rules"
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read and write their own profile data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // User preferences can only be accessed by the user
    match /users/{userId}/preferences/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public recipes can be read by anyone
    match /recipes/{recipeId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // User meal plans are private
    match /users/{userId}/mealPlans/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // User check-ins are private
    match /users/{userId}/checkIns/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 7. Test Your Setup

1. Start your development server:
   ```bash
   npm start
   ```

2. Open the app and try to sign up with a test account

3. Check Firebase Console to see if the user was created in Authentication and Firestore

## 🔧 Configuration Details

### Bundle Identifiers

Your app is configured with these bundle identifiers:
- **iOS**: `com.panpal.app`
- **Android**: `com.panpal.app`

### Firebase Services Used

- **Authentication**: Email/password sign-up and sign-in
- **Firestore**: User profiles and app data storage
- **Security Rules**: Data protection and access control

## 📱 App Structure

### Authentication Flow

1. **AuthScreen**: User signs up or signs in
2. **Onboarding**: New users complete health and preference setup
3. **Main App**: Authenticated users access the main features

### Data Flow

1. User signs up → Firebase Auth creates account
2. User completes onboarding → Profile saved to Firestore
3. User signs in → Profile loaded from Firestore
4. User updates profile → Changes saved to Firestore

## 🛠️ Development Tips

### Testing Authentication

```javascript
// In your React Native app
import { FirebaseService } from './src/services/firebaseService';

// Test sign up
try {
  const result = await FirebaseService.signUpWithEmail(
    'test@example.com',
    'password123',
    {
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
    }
  );
  console.log('Sign up successful:', result.user.name);
} catch (error) {
  console.error('Sign up failed:', error.message);
}
```

### Debugging

1. **Check Firebase Console**: Monitor Authentication and Firestore
2. **Enable Debug Logs**: Add console.log statements in your service methods
3. **Test with Expo**: Use Expo Go for quick testing

### Common Issues

1. **"Firebase config not found"**: Make sure `firebase.config.js` exists and has correct values
2. **"Permission denied"**: Check Firestore security rules
3. **"User not found"**: Ensure user profile is created in Firestore after sign up

## 🔒 Security Considerations

1. **Never commit `firebase.config.js`** to version control
2. **Use environment variables** for production
3. **Implement proper validation** on both client and server
4. **Regularly review security rules**

## 📈 Next Steps

1. **WeChat Integration**: Add WeChat OAuth for Chinese users
2. **Push Notifications**: Implement Firebase Cloud Messaging
3. **Analytics**: Add Firebase Analytics for user behavior tracking
4. **Crashlytics**: Add crash reporting for better debugging

## 🆘 Troubleshooting

### Firebase Connection Issues

1. Check your internet connection
2. Verify Firebase project is active
3. Ensure API keys are correct
4. Check if Firebase services are enabled

### Authentication Issues

1. Verify email/password authentication is enabled
2. Check if user exists in Firebase Console
3. Ensure proper error handling in your app

### Firestore Issues

1. Check security rules
2. Verify database exists and is in the correct region
3. Ensure proper data structure

## 📞 Support

If you encounter issues:

1. Check Firebase Console for error logs
2. Review Firebase documentation
3. Test with Firebase emulators for local development
4. Check React Native Firebase troubleshooting guide 