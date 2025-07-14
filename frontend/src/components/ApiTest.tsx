import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AIService } from '../services/aiService';
import { UserProfile } from '../types';

const ApiTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const testUserProfile: UserProfile = {
    id: 'test-user',
    name: 'Test User',
    age: 30,
    gender: 'male',
    height: 175,
    weight: 70,
    goal: 'lose_fat',
    cuisinePreferences: ['italian', 'mediterranean'],
    allergies: ['nuts'],
    dislikes: ['fish'],
    cookingTime: '15-30',
    budget: 'standard'
  };

  const testHealthCheck = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const response = await fetch('http://127.0.0.1:5001/panpal-1aac4/us-central1/api/health');
      const data = await response.json();
      setResult(`Health Check: ${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      setResult(`Health Check Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testMealPlanGeneration = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const mealPlan = await AIService.generateWeeklyMealPlan(testUserProfile);
      setResult(`Meal Plan Generated: ${JSON.stringify(mealPlan, null, 2)}`);
    } catch (error: any) {
      setResult(`Meal Plan Error: ${error.message}`);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const testRecipeSuggestions = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const suggestions = await AIService.getRecipeSuggestions('breakfast', 5);
      setResult(`Recipe Suggestions: ${JSON.stringify(suggestions, null, 2)}`);
    } catch (error: any) {
      setResult(`Recipe Suggestions Error: ${error.message}`);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Integration Test</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={testHealthCheck}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Testing...' : 'Test Health Check'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={testMealPlanGeneration}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Generating...' : 'Test Meal Plan Generation'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={testRecipeSuggestions}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Loading...' : 'Test Recipe Suggestions'}
        </Text>
      </TouchableOpacity>

      {result ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Result:</Text>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
});

export default ApiTest; 