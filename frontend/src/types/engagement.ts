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