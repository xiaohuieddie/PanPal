# PanPal Backend

Firebase backend for PanPal - AI-powered meal planning app with user authentication and profile management.

## Features

- **User Authentication**: Email/password and WeChat sign-up/sign-in
- **User Profile Management**: Store body stats, goals, and dietary preferences
- **Firebase Firestore**: NoSQL database for user data
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Joi schema validation for all API requests
- **TypeScript**: Full type safety and better development experience

## Tech Stack

- **Firebase Functions**: Serverless backend
- **Firebase Firestore**: NoSQL database
- **Firebase Auth**: User authentication
- **Express.js**: Web framework
- **TypeScript**: Type-safe JavaScript
- **Joi**: Input validation
- **JWT**: Token-based authentication
- **bcryptjs**: Password hashing

## Prerequisites

- Node.js 18 or higher
- Firebase CLI
- Firebase project

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Firebase Project Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Enable Authentication (Email/Password and Custom providers)
4. Get your Firebase project configuration

### 3. Firebase CLI Setup

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in the project
firebase init

# Select the following options:
# - Functions: Configure a Cloud Functions directory and its files
# - Firestore: Configure security rules and indexes
# - Use an existing project
# - Select your Firebase project
```

### 4. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# WeChat Configuration (for WeChat integration)
WECHAT_APP_ID=your-wechat-app-id
WECHAT_APP_SECRET=your-wechat-app-secret

# Environment
NODE_ENV=development
```

### 5. Build and Deploy

```bash
# Build TypeScript
npm run build

# Deploy to Firebase
npm run deploy
```

### 6. Local Development

```bash
# Start Firebase emulators
npm run serve

# This will start:
# - Functions emulator on http://localhost:5001
# - Firestore emulator on http://localhost:8080
# - Auth emulator on http://localhost:9099
# - Emulator UI on http://localhost:4000
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Sign up with email/password or WeChat
- `POST /api/auth/signin` - Sign in with email/password or WeChat
- `GET /api/auth/profile` - Get current user profile (authenticated)
- `PUT /api/auth/profile` - Update current user profile (authenticated)
- `POST /api/auth/verify` - Verify JWT token

### Health Check

- `GET /health` - API health check

## Database Schema

### Users Collection

```typescript
interface UserProfile {
  id: string;                    // Firebase Auth UID
  email?: string;                // User email
  wechatId?: string;             // WeChat OpenID
  name: string;                  // User's full name
  age: number;                   // User's age
  gender: 'male' | 'female';     // User's gender
  height: number;                // Height in cm
  weight: number;                // Weight in kg
  bodyFat?: number;              // Body fat percentage (optional)
  goal: 'lose_fat' | 'gain_muscle' | 'control_sugar' | 'maintain';
  cuisinePreferences: string[];  // Preferred cuisines
  allergies: string[];           // Food allergies
  dislikes: string[];            // Disliked foods
  cookingTime: '<15' | '15-30' | '>30';  // Preferred cooking time
  budget: 'economic' | 'standard' | 'premium';  // Budget preference
  createdAt: Date;               // Account creation date
  updatedAt: Date;               // Last update date
}
```

## Security Rules

Firestore security rules ensure that:
- Users can only access their own profile data
- User preferences are private
- Public recipes can be read by anyone
- User meal plans and check-ins are private

## WeChat Integration

The backend includes placeholder WeChat integration. To implement full WeChat support:

1. Register a WeChat Official Account or Mini Program
2. Implement WeChat OAuth flow
3. Replace the placeholder `verifyWeChatToken` method in `AuthService`
4. Add proper WeChat API error handling

## Development Workflow

1. **Local Development**: Use Firebase emulators for local development
2. **Testing**: Write tests for authentication and user management
3. **Deployment**: Deploy to Firebase Functions for production
4. **Monitoring**: Use Firebase Console for monitoring and logs

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `FIREBASE_PRIVATE_KEY` | Firebase service account private key | Yes |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account client email | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `WECHAT_APP_ID` | WeChat app ID | No |
| `WECHAT_APP_SECRET` | WeChat app secret | No |
| `NODE_ENV` | Environment (development/production) | No |

## Troubleshooting

### Common Issues

1. **Firebase Admin SDK initialization error**
   - Ensure service account credentials are properly configured
   - Check environment variables

2. **CORS errors**
   - Update CORS configuration in `app.ts` with your frontend domain
   - Ensure Firebase Functions are deployed

3. **Authentication errors**
   - Verify JWT secret is set
   - Check Firebase Auth configuration

4. **Firestore permission errors**
   - Deploy Firestore security rules
   - Check user authentication status

### Getting Help

- Check Firebase Console for function logs
- Review Firestore security rules
- Verify environment variables
- Test with Firebase emulators first

## Next Steps

1. **Recipe Management**: Add recipe CRUD operations
2. **Meal Planning**: Implement AI-powered meal plan generation
3. **Check-in System**: Add daily meal check-in functionality
4. **Rewards System**: Implement achievement and reward system
5. **Analytics**: Add user behavior analytics
6. **Notifications**: Implement push notifications 