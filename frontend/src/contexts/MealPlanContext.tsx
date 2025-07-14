import React, { createContext, useContext, useState, useEffect } from 'react';
import { AIService } from '../services/aiService';
import { MealPlan, DailyMeals } from '../types';
import { useAuth } from './AuthContext';

interface MealPlanContextType {
  currentMealPlan: MealPlan | null;
  todayMeals: DailyMeals | null;
  loading: boolean;
  generateMealPlan: () => Promise<void>;
  refreshMealPlan: () => Promise<void>;
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

export const useMealPlan = () => {
  const context = useContext(MealPlanContext);
  if (context === undefined) {
    throw new Error('useMealPlan must be used within a MealPlanProvider');
  }
  return context;
};

interface MealPlanProviderProps {
  children: React.ReactNode;
}

export const MealPlanProvider: React.FC<MealPlanProviderProps> = ({ children }) => {
  const { userProfile } = useAuth();
  const [currentMealPlan, setCurrentMealPlan] = useState<MealPlan | null>(null);
  const [todayMeals, setTodayMeals] = useState<DailyMeals | null>(null);
  const [loading, setLoading] = useState(false);

  // Get today's meals from current meal plan
  const getTodayMeals = (mealPlan: MealPlan): DailyMeals | null => {
    const today = new Date().toISOString().split('T')[0];
    return mealPlan.meals.find((day: DailyMeals) => day.date === today) || null;
  };

  // Generate new meal plan
  const generateMealPlan = async () => {
    if (!userProfile) {
      console.error('No user profile available for meal plan generation');
      return;
    }

    setLoading(true);
    try {
      const mealPlan = await AIService.getCurrentWeekMealPlan(userProfile);
      setCurrentMealPlan(mealPlan);
      setTodayMeals(getTodayMeals(mealPlan));
    } catch (error) {
      console.error('Error generating meal plan:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh meal plan (same as generate but with different intent)
  const refreshMealPlan = async () => {
    await generateMealPlan();
  };

  // Auto-generate meal plan when user profile is available
  useEffect(() => {
    if (userProfile && !currentMealPlan) {
      generateMealPlan();
    }
  }, [userProfile]);

  // Update today's meals when meal plan changes
  useEffect(() => {
    if (currentMealPlan) {
      setTodayMeals(getTodayMeals(currentMealPlan));
    }
  }, [currentMealPlan]);

  const value: MealPlanContextType = {
    currentMealPlan,
    todayMeals,
    loading,
    generateMealPlan,
    refreshMealPlan,
  };

  return (
    <MealPlanContext.Provider value={value}>
      {children}
    </MealPlanContext.Provider>
  );
}; 