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