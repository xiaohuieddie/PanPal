import React from 'react';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { OnboardingProvider } from './src/utils/OnboardingContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { SignUpProvider } from './src/contexts/SignUpContext';
import { HealthDataProvider } from './src/contexts/HealthDataContext';

export default function App() {
  return (
    <AuthProvider>
      <SignUpProvider>
        <HealthDataProvider>
          <OnboardingProvider>
            <RootNavigator />
            <StatusBar style="auto" />
          </OnboardingProvider>
        </HealthDataProvider>
      </SignUpProvider>
    </AuthProvider>
  );
}
