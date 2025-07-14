# PanPal AI Service Backend

A simplified backend service focused on AI-powered meal plan generation for the PanPal app.

## Features

- **AI Meal Plan Generation**: Generate personalized weekly meal plans based on user preferences
- **Recipe Suggestions**: Get recipe recommendations based on meal type and preferences
- **Meal Plan Management**: Retrieve and regenerate meal plans
- **Firebase Integration**: Uses Firebase Admin SDK for data storage

## Quick Start

### Prerequisites
- Node.js 18+
- Firebase CLI
- Firebase project with service account

### Setup
```bash
# Install dependencies
npm install

# Set up Firebase project
firebase use your-project-id

# Build the project
npm run build

# Start development server
npm run dev
```

## API Endpoints

### Generate Meal Plan
```http
POST /api/ai/generate-meal-plan
```

**Request Body:**
```json
{
  "id": "user-123",
  "name": "John Doe",
  "age": 30,
  "gender": "male",
  "height": 175,
  "weight": 70,
  "goal": "lose_fat",
  "cuisinePreferences": ["Chinese", "Italian"],
  "allergies": ["nuts"],
  "dislikes": ["cilantro"],
  "cookingTime": "15-30",
  "budget": "standard"
}
```

### Get Meal Plan
```http
GET /api/ai/meal-plan/:week
```

### Regenerate Day Meals
```http
POST /api/ai/regenerate-day
```

**Request Body:**
```json
{
  "week": "2024-01-07",
  "date": "2024-01-08",
  "mealType": "breakfast",
  "userId": "user-123"
}
```

### Get Recipe Suggestions
```http
GET /api/ai/recipe-suggestions?mealType=breakfast&limit=10&userId=user-123
```

## Testing

```bash
# Test the AI API
npm run test:ai
```

## Development

```bash
# Build TypeScript
npm run build

# Start development server
npm run dev

# View logs
npm run logs
```

## Project Structure

```
src/
├── config/
│   └── firebase.ts          # Firebase Admin SDK configuration
├── routes/
│   └── ai.ts               # AI service endpoints
├── services/
│   └── aiService.ts        # AI meal plan generation logic
├── types/
│   └── index.ts            # TypeScript type definitions
├── validation/
│   └── schemas.ts          # Request validation schemas
├── app.ts                  # Express app setup
└── index.ts               # Firebase Functions entry point
```

## Environment Variables

The service uses Firebase service account authentication. Ensure your `serviceAccountKey.json` is properly configured.

## Deployment

```bash
# Deploy to Firebase Functions
npm run deploy
```

## License

MIT 