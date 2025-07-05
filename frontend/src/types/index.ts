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
  createdAt?: Date;
  updatedAt?: Date;
}

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

export interface MealPlan {
  id: string;
  week: string;
  meals: DailyMeals[];
}

export interface DailyMeals {
  date: string;
  breakfast: Recipe;
  lunch: Recipe;
  dinner: Recipe;
}

export interface CheckIn {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  photo?: string;
  completed: boolean;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  type: 'coupon' | 'badge' | 'discount';
  value: string;
  platform: string;
  unlocked: boolean;
  claimed: boolean;
}