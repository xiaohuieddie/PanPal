import { UserProfile, MealPlan, Recipe } from '../types';
import { FirebaseService } from './firebaseService';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:5001/panpal-1aac4/us-central1/api';

export class AIService {
  /**
   * Get authentication token for API calls
   */
  private static async getAuthToken(): Promise<string> {
    try {
      console.log('🔐 [AIService] Getting auth token...');
      const user = FirebaseService.getCurrentUser();
      if (!user) {
        console.error('❌ [AIService] No authenticated user found');
        throw new Error('User not authenticated');
      }
      const token = await user.getIdToken();
      console.log('✅ [AIService] Auth token obtained successfully');
      return token;
    } catch (error: any) {
      console.error('❌ [AIService] Failed to get auth token:', error);
      throw error;
    }
  }

  /**
   * Make authenticated API request
   */
  private static async makeAuthenticatedRequest(
    endpoint: string, 
    method: 'GET' | 'POST' = 'GET', 
    body?: any
  ): Promise<any> {
    try {
      console.log(`🌐 [AIService] Making ${method} request to: ${API_BASE_URL}${endpoint}`);
      
      const token = await this.getAuthToken();
      console.log(`🔑 [AIService] Token obtained: ${token}, making request...`);
      
      const requestConfig = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: body ? JSON.stringify(body) : undefined
      };

      if (body) {
        console.log('📦 [AIService] Request body:', JSON.stringify(body, null, 2));
      }

      console.log('🚀 [AIService] Sending request...');
      const response = await fetch(`${API_BASE_URL}${endpoint}`, requestConfig);
      
      console.log(`📡 [AIService] Response status: ${response.status} ${response.statusText}`);
      console.log('📋 [AIService] Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ [AIService] API Error Response:', errorData);
        throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [AIService] API Response received:', JSON.stringify(data, null, 2));
      return data;
    } catch (error: any) {
      console.error('❌ [AIService] API request failed:', error);
      console.error('❌ [AIService] Error details:', {
        message: error.message,
        stack: error.stack,
        endpoint,
        method,
        body: body ? JSON.stringify(body) : undefined
      });
      throw new Error(error.message || 'Failed to connect to AI service');
    }
  }

  /**
   * Filter user profile to match backend API schema
   */
  private static filterUserProfileForAPI(userProfile: UserProfile): any {
    console.log('🔧 [AIService] Filtering user profile for API...');
    
    // Extract only the fields expected by the backend API
    const filteredProfile: any = {
      id: userProfile.id,
      name: userProfile.name,
      age: userProfile.age,
      gender: userProfile.gender,
      height: userProfile.height,
      weight: userProfile.weight,
      goal: userProfile.goal,
      cuisinePreferences: userProfile.cuisinePreferences,
      allergies: userProfile.allergies || [],
      dislikes: userProfile.dislikes || [],
      cookingTime: userProfile.cookingTime,
      budget: userProfile.budget
    };

    // Add optional bodyFat if present
    if (userProfile.bodyFat !== undefined) {
      filteredProfile.bodyFat = userProfile.bodyFat;
    }

    console.log('✅ [AIService] Filtered profile:', JSON.stringify(filteredProfile, null, 2));
    return filteredProfile;
  }

  /**
   * Generate personalized weekly meal plan
   */
  static async generateWeeklyMealPlan(userProfile: UserProfile): Promise<MealPlan> {
    try {
      console.log('🍽️ [AIService] Starting meal plan generation...');
      console.log('👤 [AIService] Original user profile:', JSON.stringify(userProfile, null, 2));
      
      // Filter user profile to match backend API schema
      const filteredProfile = this.filterUserProfileForAPI(userProfile);
      
      // Validate userProfile structure
      console.log('🔍 [AIService] Validating userProfile structure...');
      if (!filteredProfile.id) {
        console.error('❌ [AIService] Missing userProfile.id');
        throw new Error('User profile missing ID');
      }
      if (!filteredProfile.name) {
        console.error('❌ [AIService] Missing userProfile.name');
        throw new Error('User profile missing name');
      }
      if (!filteredProfile.age || typeof filteredProfile.age !== 'number') {
        console.error('❌ [AIService] Invalid userProfile.age:', filteredProfile.age);
        throw new Error('User profile missing or invalid age');
      }
      if (!filteredProfile.gender || !['male', 'female'].includes(filteredProfile.gender)) {
        console.error('❌ [AIService] Invalid userProfile.gender:', filteredProfile.gender);
        throw new Error('User profile missing or invalid gender');
      }
      if (!filteredProfile.height || typeof filteredProfile.height !== 'number') {
        console.error('❌ [AIService] Invalid userProfile.height:', filteredProfile.height);
        throw new Error('User profile missing or invalid height');
      }
      if (!filteredProfile.weight || typeof filteredProfile.weight !== 'number') {
        console.error('❌ [AIService] Invalid userProfile.weight:', filteredProfile.weight);
        throw new Error('User profile missing or invalid weight');
      }
      if (!filteredProfile.goal || !['lose_fat', 'gain_muscle', 'control_sugar', 'maintain'].includes(filteredProfile.goal)) {
        console.error('❌ [AIService] Invalid userProfile.goal:', filteredProfile.goal);
        throw new Error('User profile missing or invalid goal');
      }
      if (!filteredProfile.cuisinePreferences || !Array.isArray(filteredProfile.cuisinePreferences) || filteredProfile.cuisinePreferences.length === 0) {
        console.error('❌ [AIService] Invalid userProfile.cuisinePreferences:', filteredProfile.cuisinePreferences);
        throw new Error('User profile missing or invalid cuisine preferences');
      }
      if (!filteredProfile.cookingTime || !['<15', '15-30', '>30'].includes(filteredProfile.cookingTime)) {
        console.error('❌ [AIService] Invalid userProfile.cookingTime:', filteredProfile.cookingTime);
        throw new Error('User profile missing or invalid cooking time');
      }
      if (!filteredProfile.budget || !['economic', 'standard', 'premium'].includes(filteredProfile.budget)) {
        console.error('❌ [AIService] Invalid userProfile.budget:', filteredProfile.budget);
        throw new Error('User profile missing or invalid budget');
      }
      
      console.log('✅ [AIService] UserProfile validation passed');
      
      const response = await this.makeAuthenticatedRequest(
        '/ai/generate-meal-plan',
        'POST',
        filteredProfile
      );

      if (!response.success) {
        console.error('❌ [AIService] Meal plan generation failed:', response.error);
        throw new Error(response.error || 'Failed to generate meal plan');
      }

      console.log('✅ [AIService] Meal plan generated successfully!');
      return response.data;
    } catch (error: any) {
      console.error('❌ [AIService] Generate meal plan error:', error);
      throw error;
    }
  }

  /**
   * Get meal plan for specific week
   */
  static async getMealPlan(week: string): Promise<MealPlan | null> {
    try {
      console.log(`📅 [AIService] Getting meal plan for week: ${week}`);
      
      const response = await this.makeAuthenticatedRequest(`/ai/meal-plan/${week}`);
      
      // Check if meal plan has any meals (backend now returns 200 with empty meals array)
      if (!response.data.meals || response.data.meals.length === 0) {
        console.log(`ℹ️ [AIService] No meal plan found for week: ${week} (empty meals array)`);
        return null;
      }
      
      console.log('✅ [AIService] Meal plan retrieved successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ [AIService] Get meal plan error:', error);
      throw error;
    }
  }

  /**
   * Regenerate meals for a specific day
   */
  static async regenerateDayMeals(week: string, date: string, mealType: string): Promise<MealPlan> {
    try {
      console.log(`🔄 [AIService] Regenerating day meals - Week: ${week}, Date: ${date}, Meal: ${mealType}`);
      
      const response = await this.makeAuthenticatedRequest(
        '/ai/regenerate-day',
        'POST',
        { week, date, mealType }
      );

      if (!response.success) {
        console.error('❌ [AIService] Regenerate day meals failed:', response.error);
        throw new Error(response.error || 'Failed to regenerate day meals');
      }

      console.log('✅ [AIService] Day meals regenerated successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ [AIService] Regenerate day meals error:', error);
      throw error;
    }
  }

  /**
   * Get recipe suggestions based on user preferences
   */
  static async getRecipeSuggestions(mealType: string, limit: number = 10): Promise<Recipe[]> {
    try {
      console.log(`📖 [AIService] Getting recipe suggestions - Meal: ${mealType}, Limit: ${limit}`);
      
      const response = await this.makeAuthenticatedRequest(
        `/ai/recipe-suggestions?mealType=${mealType}&limit=${limit}`
      );

      if (!response.success) {
        console.error('❌ [AIService] Get recipe suggestions failed:', response.error);
        throw new Error(response.error || 'Failed to get recipe suggestions');
      }

      console.log(`✅ [AIService] Recipe suggestions retrieved: ${response.data.length} recipes`);
      return response.data;
    } catch (error: any) {
      console.error('❌ [AIService] Get recipe suggestions error:', error);
      throw error;
    }
  }

  /**
   * Get or generate meal plan for current week
   */
  static async getCurrentWeekMealPlan(userProfile: UserProfile): Promise<MealPlan> {
    try {
      console.log('📅 [AIService] Getting current week meal plan...');
      
      // Get current week start date (Sunday)
      const today = new Date();
      const day = today.getDay();
      const diff = today.getDate() - day;
      const weekStart = new Date(today.setDate(diff));
      const weekString = weekStart.toISOString().split('T')[0];
      
      console.log(`📅 [AIService] Current week: ${weekString}`);

      // Try to get existing meal plan
      let mealPlan = await this.getMealPlan(weekString);
      
      // If no meal plan exists, generate a new one
      if (!mealPlan) {
        console.log('🔄 [AIService] No existing meal plan found, generating new one...');
        mealPlan = await this.generateWeeklyMealPlan(userProfile);
        console.log('✅ [AIService] New meal plan generated successfully: ', JSON.stringify(mealPlan, null, 2));
      } else {
        console.log('✅ [AIService] Existing meal plan found');
      }

      return mealPlan;
    } catch (error: any) {
      console.error('❌ [AIService] Get current week meal plan error:', error);
      throw error;
    }
  }
} 