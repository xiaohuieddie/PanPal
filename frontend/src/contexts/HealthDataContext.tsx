import React, { createContext, useContext, useState } from 'react';

interface HealthData {
  age: number;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  bodyFat?: number;
  goal: 'lose_fat' | 'gain_muscle' | 'control_sugar' | 'maintain';
}

interface HealthDataContextType {
  healthData: HealthData | null;
  setHealthData: (data: HealthData) => void;
  clearHealthData: () => void;
}

const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined);

export const useHealthData = () => {
  const context = useContext(HealthDataContext);
  if (context === undefined) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
};

interface HealthDataProviderProps {
  children: React.ReactNode;
}

export const HealthDataProvider: React.FC<HealthDataProviderProps> = ({ children }) => {
  const [healthData, setHealthDataState] = useState<HealthData | null>(null);

  const setHealthData = (data: HealthData) => {
    setHealthDataState(data);
  };

  const clearHealthData = () => {
    setHealthDataState(null);
  };

  const value: HealthDataContextType = {
    healthData,
    setHealthData,
    clearHealthData,
  };

  return (
    <HealthDataContext.Provider value={value}>
      {children}
    </HealthDataContext.Provider>
  );
}; 