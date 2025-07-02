import React from 'react';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { OnboardingProvider } from './src/utils/OnboardingContext';

export default function App() {
  return (
    <OnboardingProvider>
      <RootNavigator />
      <StatusBar style="auto" />
    </OnboardingProvider>
  );
}
