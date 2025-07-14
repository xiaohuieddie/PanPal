# PanPal Frontend-Backend Integration Guide

## Overview
This guide explains how the React Native frontend integrates with the Firebase Functions backend for the PanPal meal planning application.

## Architecture

### Backend (Firebase Functions)
- **Location**: `PanPal/backend/`
- **Framework**: Express.js with Firebase Functions
- **Authentication**: Firebase Admin SDK for JWT token verification
- **API Base URL**: `http://127.0.0.1:5001/panpal-1aac4/us-central1/api`

### Frontend (React Native/Expo)
- **Location**: `PanPal/frontend/`
- **Framework**: React Native with Expo
- **Authentication**: Firebase Auth for user management
- **API Client**: Custom AIService class

## API Endpoints

### Authentication Required Endpoints
All endpoints require a valid Firebase JWT token in the Authorization header:
```
Authorization: Bearer <firebase_id_token>
```

### Available Endpoints

1. **Health Check**
   - `GET /health`
   - No authentication required
   - Returns API status

2. **Generate Meal Plan**
   - `POST /ai/generate-meal-plan`
   - Requires user profile data
   - Returns personalized weekly meal plan

3. **Get Meal Plan**
   - `GET /ai/meal-plan/:week`
   - Returns meal plan for specific week

4. **Regenerate Day Meals**
   - `POST /ai/regenerate-day`
   - Regenerates meals for a specific day

5. **Recipe Suggestions**
   - `GET /ai/recipe-suggestions`
   - Returns recipe suggestions based on preferences

## Setup Instructions

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd PanPal/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create `.env` file with:
     ```
     OPENAI_API_KEY=your_openai_api_key
     NODE_ENV=development
     ```

4. Set up Firebase service account:
   - Download service account key from Firebase Console
   - Save as `serviceAccountKey.json` in backend root

5. Start development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd PanPal/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase configuration:
   - Create `firebase.config.js` in frontend root
   - Add your Firebase project configuration

4. Set environment variables:
   - Create `.env` file with:
     ```
     EXPO_PUBLIC_API_URL=http://127.0.0.1:5001/panpal-1aac4/us-central1/api
     ```

5. Start Expo development server:
   ```bash
   npm start
   ```

## Authentication Flow

1. **User Registration/Login**: Frontend uses Firebase Auth
2. **Token Generation**: Firebase provides JWT token
3. **API Calls**: Frontend includes token in Authorization header
4. **Token Verification**: Backend verifies token using Firebase Admin SDK
5. **User Context**: Backend extracts user ID from verified token

## Testing Integration

Use the `ApiTest` component to verify integration:

```typescript
import ApiTest from './components/ApiTest';

// Add to your screen
<ApiTest />
```

This component provides buttons to test:
- Health check endpoint
- Meal plan generation
- Recipe suggestions

## Error Handling

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS configuration includes frontend origins
   - Check if using correct localhost ports

2. **Authentication Errors**
   - Verify Firebase configuration on both frontend and backend
   - Ensure service account key is properly set up
   - Check if user is authenticated before making API calls

3. **API Connection Errors**
   - Verify backend server is running
   - Check API base URL configuration
   - Ensure network connectivity

### Debugging

1. **Backend Logs**: Check Firebase Functions logs
2. **Frontend Logs**: Use React Native debugger or console logs
3. **Network**: Use browser dev tools or Postman to test endpoints

## Security Considerations

1. **Environment Variables**: Never commit API keys or service account files
2. **CORS**: Configure allowed origins properly for production
3. **Token Validation**: Always verify JWT tokens on backend
4. **Input Validation**: Use Joi schemas to validate request data

## Production Deployment

1. **Backend**: Deploy to Firebase Functions
2. **Frontend**: Build and deploy to app stores
3. **Environment**: Update API URLs and CORS origins
4. **Monitoring**: Set up Firebase Analytics and Crashlytics

## File Structure

```
PanPal/
├── backend/
│   ├── src/
│   │   ├── middleware/auth.ts          # Authentication middleware
│   │   ├── routes/ai.ts                # AI API routes
│   │   ├── services/aiService.ts       # AI service logic
│   │   └── app.ts                      # Express app configuration
│   └── package.json
└── frontend/
    ├── src/
    │   ├── services/
    │   │   ├── aiService.ts            # API client
    │   │   └── firebaseService.ts      # Firebase operations
    │   ├── components/
    │   │   └── ApiTest.tsx             # Integration test component
    │   └── types/index.ts              # TypeScript interfaces
    └── package.json
``` 