# PanPal Backend - Local Development Guide

This guide will help you set up and run the PanPal backend server locally for development.

## Prerequisites

1. **Node.js** (version 18 or higher)
   ```bash
   node --version  # Should be >= 18
   ```

2. **npm** or **yarn**
   ```bash
   npm --version
   ```

3. **Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase --version
   ```

4. **Firebase Project**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Note down your project ID

## Setup Steps

### 1. Install Dependencies

```bash
cd PanPal/backend
npm install
```

### 2. Firebase Configuration

#### A. Login to Firebase
```bash
firebase login
```

#### B. Initialize Firebase (if not already done)
```bash
firebase init functions
```
- Select your Firebase project
- Choose TypeScript
- Use ESLint: No
- Install dependencies: Yes

#### C. Set up Environment Variables
```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your Firebase project details
nano .env
```

**Required Environment Variables:**
```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-panpal-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Firebase Private Key Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Environment
NODE_ENV=development

# CORS Origins
CORS_ORIGINS=http://localhost:3000,http://localhost:19006
```

#### D. Get Firebase Service Account Key
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Download the JSON file
6. Copy the values to your `.env` file:
   - `private_key` → `FIREBASE_PRIVATE_KEY`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `project_id` → `FIREBASE_PROJECT_ID`

### 3. Build the Project

```bash
npm run build
```

## Running the Server

### Option 1: Using Firebase Emulators (Recommended)

```bash
# Start the development server
npm run dev
```

This will:
- Build the TypeScript code
- Start Firebase emulators
- Serve the API at `http://localhost:5001/panpal-backend/us-central1/api`

### Option 2: Using Firebase Shell

```bash
npm run shell
```

### Option 3: Direct Development Server

If you want to run without Firebase emulators (for testing only):

```bash
# Build the project
npm run build

# Start with ts-node (requires ts-node installation)
npx ts-node src/index.ts
```

## API Endpoints

Once running, your API will be available at:
- **Base URL**: `http://localhost:5001/panpal-backend/us-central1/api`
- **Health Check**: `GET /health`
- **Auth Routes**: `/auth/*`
- **AI Routes**: `/ai/*`

### Test the API

```bash
# Health check
curl http://localhost:5001/panpal-backend/us-central1/api/health

# Test AI service
npm run test:ai
```

## Development Workflow

### 1. Start Development Server
```bash
npm run dev
```

### 2. Make Changes
- Edit files in `src/`
- The server will automatically rebuild when you restart

### 3. Test Changes
```bash
# Test AI endpoints
npm run test:ai

# Run all tests
npm test
```

### 4. View Logs
```bash
firebase functions:log
```

## Troubleshooting

### Common Issues

#### 1. "Firebase project not found"
```bash
# Check your project ID
firebase projects:list

# Set the correct project
firebase use your-project-id
```

#### 2. "Permission denied" errors
- Ensure your Firebase service account has the necessary permissions
- Check that your `.env` file has the correct credentials

#### 3. "Port already in use"
```bash
# Kill processes on port 5001
lsof -ti:5001 | xargs kill -9
```

#### 4. TypeScript compilation errors
```bash
# Clean and rebuild
rm -rf lib/
npm run build
```

#### 5. "Module not found" errors
```bash
# Reinstall dependencies
rm -rf node_modules/
npm install
```

### Debug Mode

To run with more verbose logging:

```bash
# Set debug environment variable
export DEBUG=firebase-functions:*
npm run dev
```

## Database Setup

### Firestore Emulator
The Firebase emulator includes Firestore. You can access it at:
- **Emulator UI**: `http://localhost:4000`
- **Firestore**: `http://localhost:8080`

### Sample Data
You can add sample recipes to test the AI service:

```javascript
// Add to Firestore emulator
const sampleRecipe = {
  name: "Oatmeal with Berries",
  ingredients: [
    { name: "Oats", amount: "1/2", unit: "cup" },
    { name: "Berries", amount: "1/2", unit: "cup" }
  ],
  nutrition: { calories: 320, protein: 12, fat: 8, carbs: 55 },
  cookingTime: 10,
  difficulty: "easy",
  tags: ["breakfast", "healthy"],
  cuisine: "International",
  budget: "economic",
  rating: 4.5
};
```

## Production Deployment

When ready to deploy:

```bash
# Deploy to Firebase Functions
npm run deploy
```

## Useful Commands

```bash
# Quick setup (install + build)
npm run install-deps

# Development server
npm run dev

# Test AI service
npm run test:ai

# View logs
npm run logs

# Deploy to production
npm run deploy
```

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `FIREBASE_PROJECT_ID` | Your Firebase project ID | Yes |
| `FIREBASE_PRIVATE_KEY` | Firebase service account private key | Yes |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email | Yes |
| `JWT_SECRET` | Secret for JWT token signing | Yes |
| `NODE_ENV` | Environment (development/production) | No |
| `CORS_ORIGINS` | Allowed CORS origins | No |
| `WECHAT_APP_ID` | WeChat app ID (for WeChat auth) | No |
| `WECHAT_APP_SECRET` | WeChat app secret | No |

## Next Steps

1. **Test the API**: Use the test script to verify all endpoints work
2. **Add Sample Data**: Populate Firestore with recipes
3. **Connect Frontend**: Update frontend to use local API
4. **Deploy**: Deploy to Firebase Functions when ready 