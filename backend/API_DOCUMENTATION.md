# PanPal API Documentation

## Base URL
- **Development**: `http://localhost:5001/your-project-id/us-central1/api`
- **Production**: `https://your-project-id.web.app/api`

## Authentication
All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Health Check

#### GET /health
Check if the API is running.

**Response:**
```json
{
  "success": true,
  "message": "PanPal API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Authentication

#### POST /auth/signup
Sign up a new user with email/password or WeChat.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "age": 25,
  "gender": "male",
  "height": 175,
  "weight": 70,
  "bodyFat": 15,
  "goal": "lose_fat",
  "cuisinePreferences": ["chinese", "healthy"],
  "allergies": ["peanuts"],
  "dislikes": ["cilantro"],
  "cookingTime": "15-30",
  "budget": "standard"
}
```

**Alternative WeChat Signup:**
```json
{
  "wechatId": "wx_openid_123",
  "wechatToken": "wechat_access_token",
  "name": "John Doe",
  "age": 25,
  "gender": "male",
  "height": 175,
  "weight": 70,
  "goal": "lose_fat",
  "cuisinePreferences": ["chinese", "healthy"],
  "allergies": [],
  "dislikes": [],
  "cookingTime": "15-30",
  "budget": "standard"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_uid",
      "email": "user@example.com",
      "name": "John Doe",
      "age": 25,
      "gender": "male",
      "height": 175,
      "weight": 70,
      "bodyFat": 15,
      "goal": "lose_fat",
      "cuisinePreferences": ["chinese", "healthy"],
      "allergies": ["peanuts"],
      "dislikes": ["cilantro"],
      "cookingTime": "15-30",
      "budget": "standard",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST /auth/signin
Sign in with email/password or WeChat.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Alternative WeChat Signin:**
```json
{
  "wechatId": "wx_openid_123",
  "wechatToken": "wechat_access_token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_uid",
      "email": "user@example.com",
      "name": "John Doe",
      "age": 25,
      "gender": "male",
      "height": 175,
      "weight": 70,
      "bodyFat": 15,
      "goal": "lose_fat",
      "cuisinePreferences": ["chinese", "healthy"],
      "allergies": ["peanuts"],
      "dislikes": ["cilantro"],
      "cookingTime": "15-30",
      "budget": "standard",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### GET /auth/profile
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_uid",
    "email": "user@example.com",
    "name": "John Doe",
    "age": 25,
    "gender": "male",
    "height": 175,
    "weight": 70,
    "bodyFat": 15,
    "goal": "lose_fat",
    "cuisinePreferences": ["chinese", "healthy"],
    "allergies": ["peanuts"],
    "dislikes": ["cilantro"],
    "cookingTime": "15-30",
    "budget": "standard",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /auth/profile
Update current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "age": 26,
  "weight": 68,
  "goal": "maintain",
  "cuisinePreferences": ["chinese", "healthy", "fitness"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_uid",
    "email": "user@example.com",
    "name": "Updated Name",
    "age": 26,
    "gender": "male",
    "height": 175,
    "weight": 68,
    "bodyFat": 15,
    "goal": "maintain",
    "cuisinePreferences": ["chinese", "healthy", "fitness"],
    "allergies": ["peanuts"],
    "dislikes": ["cilantro"],
    "cookingTime": "15-30",
    "budget": "standard",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /auth/verify
Verify JWT token.

**Request Body:**
```json
{
  "token": "jwt_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uid": "user_uid",
    "email": "user@example.com",
    "wechatId": null,
    "displayName": "John Doe"
  }
}
```

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

### Common HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required or invalid token
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

### Validation Errors

When validation fails, the response includes specific field errors:

```json
{
  "success": false,
  "error": "Validation failed: 'age' must be a number"
}
```

## Data Types

### User Profile Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Firebase Auth UID |
| `email` | string | No | User email address |
| `wechatId` | string | No | WeChat OpenID |
| `name` | string | Yes | User's full name (2-50 chars) |
| `age` | number | Yes | User's age (13-120) |
| `gender` | string | Yes | 'male' or 'female' |
| `height` | number | Yes | Height in cm (100-250) |
| `weight` | number | Yes | Weight in kg (30-300) |
| `bodyFat` | number | No | Body fat percentage (5-50) |
| `goal` | string | Yes | 'lose_fat', 'gain_muscle', 'control_sugar', 'maintain' |
| `cuisinePreferences` | string[] | Yes | Array of preferred cuisines |
| `allergies` | string[] | No | Array of food allergies |
| `dislikes` | string[] | No | Array of disliked foods |
| `cookingTime` | string | Yes | '<15', '15-30', or '>30' |
| `budget` | string | Yes | 'economic', 'standard', or 'premium' |

### Cuisine Preferences

Available cuisine types:
- `chinese` - Chinese cuisine
- `healthy` - Healthy/light food
- `fitness` - Fitness-focused meals
- `vegetarian` - Vegetarian options
- `quick` - Quick meals
- `soup` - Soups and stews

### Goals

Available health goals:
- `lose_fat` - Weight loss
- `gain_muscle` - Muscle building
- `control_sugar` - Blood sugar control
- `maintain` - Weight maintenance

### Cooking Time

Available cooking time preferences:
- `<15` - Under 15 minutes
- `15-30` - 15-30 minutes
- `>30` - Over 30 minutes

### Budget

Available budget preferences:
- `economic` - Budget-friendly ($5-10 per meal)
- `standard` - Standard ($10-15 per meal)
- `premium` - Premium ($15+ per meal)

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## Security Notes

1. **JWT Tokens**: Tokens expire after 7 days
2. **Password Security**: Passwords are hashed using bcrypt
3. **CORS**: Configured for specific origins
4. **Input Validation**: All inputs are validated using Joi schemas
5. **Firestore Rules**: Database access is controlled by security rules

## Testing

Use the provided `test-api.js` script to test the API endpoints:

```bash
node test-api.js
```

Make sure to update the `API_BASE_URL` in the test file with your actual Firebase project ID. 