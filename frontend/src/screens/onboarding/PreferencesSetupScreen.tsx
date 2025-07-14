import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/RootNavigator';
import { useOnboarding } from '../../utils/OnboardingContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSignUp } from '../../contexts/SignUpContext';
import { useHealthData } from '../../contexts/HealthDataContext';
import { useMealPlan } from '../../contexts/MealPlanContext';

type PreferencesSetupScreenNavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'PreferencesSetup'>;

const cuisineOptions = [
  'Chinese', 'Italian', 'Mexican', 'Japanese', 'Indian', 'Thai', 'Mediterranean', 'American'
];

const cookingTimeOptions = [
  { label: '15 minutes or less', value: '15' },
  { label: '15-30 minutes', value: '30' },
  { label: '30-45 minutes', value: '45' },
  { label: '45+ minutes', value: '60' }
];

const budgetOptions = [
  { label: 'Budget-friendly ($)', value: 'low' },
  { label: 'Moderate ($$)', value: 'medium' },
  { label: 'Premium ($$$)', value: 'high' }
];

export default function PreferencesSetupScreen() {
  const navigation = useNavigation<PreferencesSetupScreenNavigationProp>();
  const { healthData } = useHealthData();
  const { credentials } = useSignUp();
  const { signUp } = useAuth();
  const { completeOnboarding } = useOnboarding();
  const { generateMealPlan } = useMealPlan();
  
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [cookingTime, setCookingTime] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines(prev => 
      prev.includes(cuisine) 
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const handleComplete = async () => {
    if (!credentials) {
      Alert.alert('Error', 'Sign-up credentials not found. Please start over.');
      return;
    }

    if (!healthData) {
      Alert.alert('Error', 'Health data not found. Please go back and complete health setup.');
      return;
    }

    if (selectedCuisines.length === 0 || !cookingTime || !budget) {
      Alert.alert('Error', 'Please select all preferences');
      return;
    }

    setLoading(true);
    try {
      // Create user profile with all collected data
      const userData = {
        name: credentials.name,
        gender: healthData.gender,
        age: healthData.age,
        height: healthData.height,
        weight: healthData.weight,
        goal: healthData.goal,
        cuisinePreferences: selectedCuisines,
        allergies: [], // Default empty array
        dislikes: [], // Default empty array
        cookingTime: cookingTime === '15' ? '<15' : cookingTime === '30' ? '15-30' : '>30' as '<15' | '15-30' | '>30',
        budget: budget === 'low' ? 'economic' : budget === 'medium' ? 'standard' : 'premium' as 'economic' | 'standard' | 'premium',
      };

      // Complete sign-up process
      await signUp(credentials.email, credentials.password, userData);
      
      // Mark onboarding as complete
      await completeOnboarding();
      
      // Generate personalized meal plan
      await generateMealPlan();
      
      // Navigation will be handled automatically by AuthContext
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Set Your Preferences</Text>
          <Text style={styles.subtitle}>
            Help us create personalized meal plans just for you
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favorite Cuisines</Text>
          <Text style={styles.sectionSubtitle}>Select all that apply</Text>
          <View style={styles.optionsGrid}>
            {cuisineOptions.map((cuisine) => (
              <TouchableOpacity
                key={cuisine}
                style={[
                  styles.optionChip,
                  selectedCuisines.includes(cuisine) && styles.optionChipSelected
                ]}
                onPress={() => toggleCuisine(cuisine)}
              >
                <Text style={[
                  styles.optionChipText,
                  selectedCuisines.includes(cuisine) && styles.optionChipTextSelected
                ]}>
                  {cuisine}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Maximum Cooking Time</Text>
          <Text style={styles.sectionSubtitle}>How much time can you spend cooking?</Text>
          {cookingTimeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                cookingTime === option.value && styles.optionButtonSelected
              ]}
              onPress={() => setCookingTime(option.value)}
            >
              <Text style={[
                styles.optionButtonText,
                cookingTime === option.value && styles.optionButtonTextSelected
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Preference</Text>
          <Text style={styles.sectionSubtitle}>What's your typical meal budget?</Text>
          {budgetOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                budget === option.value && styles.optionButtonSelected
              ]}
              onPress={() => setBudget(option.value)}
            >
              <Text style={[
                styles.optionButtonText,
                budget === option.value && styles.optionButtonTextSelected
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.completeButton, loading && styles.completeButtonDisabled]}
          onPress={handleComplete}
          disabled={loading}
        >
          <Text style={styles.completeButtonText}>
            {loading ? 'Creating Account...' : 'Complete Setup'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButtonContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  optionChipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionChipText: {
    fontSize: 14,
    color: '#333',
  },
  optionChipTextSelected: {
    color: '#fff',
  },
  optionButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
  },
  optionButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionButtonText: {
    fontSize: 16,
    color: '#333',
  },
  optionButtonTextSelected: {
    color: '#fff',
  },
  footer: {
    padding: 24,
    paddingBottom: 34,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});