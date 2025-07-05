// User Profile Types
export interface UserProfile {
  id: string;
  email?: string;
  wechatId?: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  bodyFat?: number;
  goal: 'lose_fat' | 'gain_muscle' | 'control_sugar' | 'maintain';
  cuisinePreferences: string[];
  allergies: string[];
  dislikes: string[];
  cookingTime: '<15' | '15-30' | '>30';
  budget: 'economic' | 'standard' | 'premium';
  createdAt: Date;
  updatedAt: Date;
}

// Authentication Types
export interface AuthUser {
  uid: string;
  email?: string;
  wechatId?: string;
  displayName?: string;
  photoURL?: string;
}

export interface SignUpRequest {
  email?: string;
  password?: string;
  wechatId?: string;
  wechatToken?: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  bodyFat?: number;
  goal: 'lose_fat' | 'gain_muscle' | 'control_sugar' | 'maintain';
  cuisinePreferences: string[];
  allergies: string[];
  dislikes: string[];
  cookingTime: '<15' | '15-30' | '>30';
  budget: 'economic' | 'standard' | 'premium';
}

export interface SignInRequest {
  email?: string;
  password?: string;
  wechatId?: string;
  wechatToken?: string;
}

// Recipe Types
export interface Recipe {
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
}

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

// Meal Plan Types
export interface MealPlan {
  id: string;
  userId: string;
  week: string;
  meals: DailyMeals[];
  createdAt: Date;
}

export interface DailyMeals {
  date: string;
  breakfast: Recipe;
  lunch: Recipe;
  dinner: Recipe;
}

// Check-in Types
export interface CheckIn {
  id: string;
  userId: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  photo?: string;
  completed: boolean;
  createdAt: Date;
}

// Reward Types
export interface Reward {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'coupon' | 'badge' | 'discount';
  value: string;
  platform: string;
  unlocked: boolean;
  claimed: boolean;
  unlockedAt?: Date;
  claimedAt?: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Validation Types
export interface ValidationError {
  field: string;
  message: string;
}

// WeChat Integration Types
export interface WeChatUserInfo {
  openid: string;
  nickname: string;
  sex: number;
  province: string;
  city: string;
  country: string;
  headimgurl: string;
  privilege: string[];
  unionid?: string;
}

export interface WeChatTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  openid: string;
  scope: string;
  unionid?: string;
} 