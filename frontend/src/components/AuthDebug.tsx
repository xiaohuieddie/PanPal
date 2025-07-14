import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FirebaseService } from '../services/firebaseService';
import { AIService } from '../services/aiService';

const AuthDebug: React.FC = () => {
  const [status, setStatus] = useState<string>('');

  const checkAuthStatus = async () => {
    try {
      setStatus('🔍 Checking authentication status...\n');
      
      const user = FirebaseService.getCurrentUser();
      if (!user) {
        setStatus(prev => prev + '❌ No authenticated user found\n');
        return;
      }
      
      setStatus(prev => prev + `✅ User authenticated: ${user.email}\n`);
      setStatus(prev => prev + `✅ User ID: ${user.uid}\n`);
      
      // Try to get token
      try {
        const token = await user.getIdToken();
        setStatus(prev => prev + `✅ Token obtained: ${token.substring(0, 20)}...\n`);
      } catch (tokenError: any) {
        setStatus(prev => prev + `❌ Token error: ${tokenError.message}\n`);
      }
      
    } catch (error: any) {
      setStatus(prev => prev + `❌ Auth check error: ${error.message}\n`);
    }
  };

  const testHealthCheck = async () => {
    try {
      setStatus(prev => prev + '🏥 Testing health check...\n');
      
      const response = await fetch('http://127.0.0.1:5001/panpal-1aac4/us-central1/api/health');
      const data = await response.json();
      
      setStatus(prev => prev + `✅ Health check: ${JSON.stringify(data)}\n`);
    } catch (error: any) {
      setStatus(prev => prev + `❌ Health check error: ${error.message}\n`);
    }
  };

  const testMealPlanGeneration = async () => {
    try {
      setStatus(prev => prev + '🍽️ Testing meal plan generation...\n');
      
      const testUserProfile = {
        id: 'test-user',
        name: 'Test User',
        age: 30,
        gender: 'male' as const,
        height: 175,
        weight: 70,
        goal: 'lose_fat' as const,
        cuisinePreferences: ['italian', 'mediterranean'],
        allergies: ['nuts'],
        dislikes: ['fish'],
        cookingTime: '15-30' as const,
        budget: 'standard' as const
      };
      
      const mealPlan = await AIService.generateWeeklyMealPlan(testUserProfile);
      setStatus(prev => prev + `✅ Meal plan generated: ${mealPlan.id}\n`);
    } catch (error: any) {
      setStatus(prev => prev + `❌ Meal plan error: ${error.message}\n`);
    }
  };

  const testGetMealPlan = async () => {
    try {
      setStatus(prev => prev + '📅 Testing get meal plan...\n');
      
      const mealPlan = await AIService.getMealPlan('2025-06-29');
      if (mealPlan) {
        setStatus(prev => prev + `✅ Meal plan found: ${mealPlan.id}\n`);
      } else {
        setStatus(prev => prev + 'ℹ️ No meal plan found (expected for new user)\n');
      }
    } catch (error: any) {
      setStatus(prev => prev + `❌ Get meal plan error: ${error.message}\n`);
    }
  };

  const runAllTests = async () => {
    setStatus('🚀 Starting all tests...\n');
    
    await checkAuthStatus();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testHealthCheck();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testMealPlanGeneration();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testGetMealPlan();
    
    setStatus(prev => prev + '🎉 All tests completed!\n');
  };

  const clearStatus = () => {
    setStatus('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Auth Debug</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={runAllTests}>
          <Text style={styles.buttonText}>🚀 Run All Tests</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={checkAuthStatus}>
          <Text style={styles.buttonText}>🔍 Check Auth</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={testHealthCheck}>
          <Text style={styles.buttonText}>🏥 Health Check</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={testMealPlanGeneration}>
          <Text style={styles.buttonText}>🍽️ Generate Meal Plan</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={testGetMealPlan}>
          <Text style={styles.buttonText}>📅 Get Meal Plan</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearStatus}>
          <Text style={styles.buttonText}>🗑️ Clear</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>📋 Status:</Text>
        <Text style={styles.statusText}>{status || 'No tests run yet'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  statusContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});

export default AuthDebug; 