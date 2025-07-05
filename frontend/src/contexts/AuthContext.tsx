import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { FirebaseService } from '../services/firebaseService';
import { UserProfile } from '../types';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isSigningUp: boolean;
  signUp: (email: string, password: string, userData: Omit<UserProfile, 'id' | 'email' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  startSignUp: () => void;
  cancelSignUp: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    const unsubscribe = FirebaseService.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const profile = await FirebaseService.getCurrentUserProfile();
          setUserProfile(profile);
        } catch (error) {
          console.error('Error loading user profile:', error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const startSignUp = () => {
    setIsSigningUp(true);
  };

  const cancelSignUp = () => {
    setIsSigningUp(false);
  };

  const signUp = async (
    email: string, 
    password: string, 
    userData: Omit<UserProfile, 'id' | 'email' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const result = await FirebaseService.signUpWithEmail(email, password, userData);
      setUserProfile(result.user);
      setIsSigningUp(false);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await FirebaseService.signInWithEmail(email, password);
      setUserProfile(result.user);
      setIsSigningUp(false);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await FirebaseService.signOut();
      setUserProfile(null);
      setIsSigningUp(false);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const updatedProfile = await FirebaseService.updateUserProfile(updates);
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    isSigningUp,
    signUp,
    signIn,
    signOut,
    updateProfile,
    startSignUp,
    cancelSignUp,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 