// User Profile Types (simplified for AI service)
export interface UserProfile {
  id: string;
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
  totalCalories?: number;
  totalProtein?: number;
  totalFat?: number;
  totalCarbs?: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
} 