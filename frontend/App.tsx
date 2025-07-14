import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AuthDebug from './src/components/AuthDebug';
import RootNavigator from './src/navigation/RootNavigator';
import { OnboardingProvider } from './src/utils/OnboardingContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { SignUpProvider } from './src/contexts/SignUpContext';
import { HealthDataProvider } from './src/contexts/HealthDataContext';
import { MealPlanProvider } from './src/contexts/MealPlanContext';

export default function App() {
  return (
    <AuthProvider>
      <SignUpProvider>
        <HealthDataProvider>
          <MealPlanProvider>
            <OnboardingProvider>
              <RootNavigator />
              <StatusBar style="auto" />
            </OnboardingProvider>
          </MealPlanProvider>
        </HealthDataProvider>
      </SignUpProvider>
    </AuthProvider>
  );
}
