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
  cuisine?: string;
  budget?: 'economic' | 'standard' | 'premium';
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
  totalCalories?: number;
  totalProtein?: number;
  totalFat?: number;
  totalCarbs?: number;
} 