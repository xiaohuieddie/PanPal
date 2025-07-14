# PanPal AI Service

This document describes the AI-powered meal planning service implementation in the PanPal backend.

## Overview

The AI service provides personalized meal plan generation based on user preferences, dietary restrictions, and health goals. It uses intelligent algorithms to create balanced, nutritious meal plans that match user preferences.

## Features

- **Personalized Meal Planning**: Generate weekly meal plans based on user profile
- **Smart Recipe Selection**: AI-powered recipe filtering based on preferences
- **Nutritional Balance**: Automatic calorie and macronutrient calculation
- **Dietary Restrictions**: Support for allergies, dislikes, and dietary preferences
- **Cuisine Preferences**: Filter recipes by preferred cuisines
- **Budget Considerations**: Recipe selection based on budget constraints
- **Cooking Time Optimization**: Match recipes to available cooking time

## API Endpoints

### 1. Generate Weekly Meal Plan
```
POST /api/ai/generate-meal-plan
```

**Request Body:**
```json
{
  "id": "user-id",
  "name": "User Name",
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

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "meal-plan-123",
    "userId": "user-id",
    "week": "2024-01-07",
    "meals": [
      {
        "date": "2024-01-07",
        "breakfast": { /* recipe object */ },
        "lunch": { /* recipe object */ },
        "dinner": { /* recipe object */ },
        "totalCalories": 1800,
        "totalProtein": 120,
        "totalFat": 60,
        "totalCarbs": 180
      }
    ],
    "createdAt": "2024-01-07T00:00:00.000Z"
  }
}
```

### 2. Get Meal Plan
```
GET /api/ai/meal-plan/:week
```

**Response:**
```json
{
  "success": true,
  "data": { /* meal plan object */ }
}
```

### 3. Regenerate Day Meals
```
POST /api/ai/regenerate-day
```

**Request Body:**
```json
{
  "week": "2024-01-07",
  "date": "2024-01-08",
  "mealType": "breakfast"
}
```

### 4. Get Recipe Suggestions
```
GET /api/ai/recipe-suggestions?mealType=breakfast&limit=10
```

## AI Algorithm Details

### 1. Calorie Calculation
- Uses Mifflin-St Jeor Equation for BMR calculation
- Applies activity multiplier (1.55 for moderate activity)
- Adjusts based on goal:
  - Lose fat: -500 calories
  - Gain muscle: +300 calories
  - Control sugar: -200 calories
  - Maintain: no adjustment

### 2. Recipe Filtering
- **Cuisine Preferences**: Filters recipes by preferred cuisines
- **Budget**: Matches recipe budget to user budget
- **Cooking Time**: Filters by maximum available cooking time
- **Allergies**: Excludes recipes with allergenic ingredients
- **Dislikes**: Excludes recipes with disliked ingredients

### 3. Recipe Scoring
- **Calorie Match**: Closer to target = higher score
- **Nutrition Balance**: Scores based on ideal protein/fat/carb ratios
- **Cooking Time**: Shorter time = higher score
- **Cuisine Preference**: Bonus points for preferred cuisines

### 4. Meal Type Classification
- **Breakfast**: Tags: breakfast, morning, oatmeal, eggs, toast, smoothie
- **Lunch**: Tags: lunch, main, protein, vegetables, rice, noodles
- **Dinner**: Tags: dinner, evening, soup, light, comfort

## Database Schema

### Recipes Collection
```typescript
interface Recipe {
  id: string;
  name: string;
  image: string;
  ingredients: Ingredient[];
  steps: string[];
  nutrition: NutritionInfo;
  cookingTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  cuisine: string;
  budget: 'economic' | 'standard' | 'premium';
  rating: number;
}
```

### Meal Plans Collection
```typescript
interface MealPlan {
  id: string;
  userId: string;
  week: string;
  meals: DailyMeals[];
  createdAt: Date;
}
```

## Error Handling

The service includes comprehensive error handling:
- Database connection failures
- Missing user profiles
- Invalid recipe data
- Authentication errors
- Validation errors

## Fallback Mechanisms

When the database is unavailable or insufficient recipes are found:
1. Returns fallback recipes with basic nutritional information
2. Uses mock data for testing
3. Graceful degradation of features

## Testing

Run the AI service tests:
```bash
cd backend
node test-ai-api.js
```

## Future Enhancements

1. **Machine Learning Integration**: Use ML models for better recipe recommendations
2. **Seasonal Recipes**: Consider seasonal availability of ingredients
3. **Social Features**: Share meal plans and get community recommendations
4. **Nutritional Goals**: More sophisticated nutritional goal tracking
5. **Recipe Generation**: AI-generated recipes based on available ingredients

## Security Considerations

- All endpoints require authentication
- User data is validated and sanitized
- Rate limiting should be implemented for production
- API keys and secrets should be properly managed 