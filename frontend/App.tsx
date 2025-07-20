import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AuthDebug from './src/components/AuthDebug';
import RootNavigator from './src/navigation/RootNavigator';
import { OnboardingProvider } from './src/utils/OnboardingContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { SignUpProvider } from './src/contexts/SignUpContext';
import { HealthDataProvider } from './src/contexts/HealthDataContext';
import { MealPlanProvider } from './src/contexts/MealPlanContext';
import { ShoppingListProvider } from './src/contexts/ShoppingListContext';

export default function App() {
  return (
    <AuthProvider>
      <SignUpProvider>
        <HealthDataProvider>
          <MealPlanProvider>
            <ShoppingListProvider>
              <OnboardingProvider>
                <RootNavigator />
                <StatusBar style="auto" />
              </OnboardingProvider>
            </ShoppingListProvider>
          </MealPlanProvider>
        </HealthDataProvider>
      </SignUpProvider>
    </AuthProvider>
  );
}
