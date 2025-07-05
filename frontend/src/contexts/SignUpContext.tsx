import React, { createContext, useContext, useState } from 'react';

interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
}

interface SignUpContextType {
  credentials: SignUpCredentials | null;
  setCredentials: (credentials: SignUpCredentials) => void;
  clearCredentials: () => void;
}

const SignUpContext = createContext<SignUpContextType | undefined>(undefined);

export const useSignUp = () => {
  const context = useContext(SignUpContext);
  if (context === undefined) {
    throw new Error('useSignUp must be used within a SignUpProvider');
  }
  return context;
};

interface SignUpProviderProps {
  children: React.ReactNode;
}

export const SignUpProvider: React.FC<SignUpProviderProps> = ({ children }) => {
  const [credentials, setCredentialsState] = useState<SignUpCredentials | null>(null);

  const setCredentials = (newCredentials: SignUpCredentials) => {
    setCredentialsState(newCredentials);
  };

  const clearCredentials = () => {
    setCredentialsState(null);
  };

  const value: SignUpContextType = {
    credentials,
    setCredentials,
    clearCredentials,
  };

  return (
    <SignUpContext.Provider value={value}>
      {children}
    </SignUpContext.Provider>
  );
}; 