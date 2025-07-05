import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';

interface OnboardingContextType {
  isOnboarded: boolean;
  completeOnboarding: () => Promise<void>;
  checkOnboardingStatus: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const ONBOARDING_KEY = 'panpal_onboarding_complete';

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const { userProfile } = useAuth();
  
  const checkOnboardingStatus = async () => {
    try {
      // Check if user has completed onboarding in storage
      const onboardingComplete = await AsyncStorage.getItem(ONBOARDING_KEY);
      
      // Also check if user profile exists and has required fields
      const hasCompleteProfile = Boolean(userProfile && 
        userProfile.name && 
        userProfile.age && 
        userProfile.gender && 
        userProfile.height && 
        userProfile.weight && 
        userProfile.goal && 
        userProfile.cuisinePreferences && 
        userProfile.cookingTime && 
        userProfile.budget);

      const isComplete = onboardingComplete === 'true' || hasCompleteProfile;
      setIsOnboarded(isComplete);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // Fallback: check if user profile has required fields
      const hasCompleteProfile = Boolean(userProfile && 
        userProfile.name && 
        userProfile.age && 
        userProfile.gender && 
        userProfile.height && 
        userProfile.weight && 
        userProfile.goal && 
        userProfile.cuisinePreferences && 
        userProfile.cookingTime && 
        userProfile.budget);
      
      setIsOnboarded(hasCompleteProfile);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      setIsOnboarded(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setIsOnboarded(true); // Still set to true even if storage fails
    }
  };

  // Check onboarding status when user profile changes
  useEffect(() => {
    checkOnboardingStatus();
  }, [userProfile]);

  return (
    <OnboardingContext.Provider value={{ 
      isOnboarded, 
      completeOnboarding, 
      checkOnboardingStatus 
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};