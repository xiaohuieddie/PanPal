import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/RootNavigator';
import { useOnboarding } from '../../utils/OnboardingContext';

type PreferencesSetupScreenNavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'PreferencesSetup'>;

export default function PreferencesSetupScreen() {
  const navigation = useNavigation<PreferencesSetupScreenNavigationProp>();
  const { completeOnboarding } = useOnboarding();
  const [cuisinePreferences, setCuisinePreferences] = useState<string[]>([]);
  const [cookingTime, setCookingTime] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);

  const cuisines = [
    { id: 'chinese', label: 'Chinese', icon: '🥢' },
    { id: 'healthy', label: 'Healthy', icon: '🥗' },
    { id: 'fitness', label: 'Fitness', icon: '💪' },
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥕' },
    { id: 'quick', label: 'Quick Meals', icon: '⚡' },
    { id: 'soup', label: 'Soups', icon: '🍲' },
  ];

  const timeOptions = [
    { id: '<15', label: 'Under 15 minutes', icon: '⚡' },
    { id: '15-30', label: '15-30 minutes', icon: '⏰' },
    { id: '>30', label: 'Over 30 minutes', icon: '🕐' },
  ];

  const budgetOptions = [
    { id: 'economic', label: 'Budget-Friendly', description: '$5-10 per meal', icon: '💰' },
    { id: 'standard', label: 'Standard', description: '$10-15 per meal', icon: '💳' },
    { id: 'premium', label: 'Premium', description: '$15+ per meal', icon: '💎' },
  ];

  const toggleCuisine = (cuisineId: string) => {
    setCuisinePreferences(prev =>
      prev.includes(cuisineId)
        ? prev.filter(id => id !== cuisineId)
        : [...prev, cuisineId]
    );
  };

  const handleComplete = () => {
    // In a real app, save user preferences to AsyncStorage or API
    console.log('Preferences setup completed');
    completeOnboarding();
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const isFormValid = cuisinePreferences.length > 0 && cookingTime && budget;

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Set Your Preferences</Text>
          <Text style={styles.subtitle}>Let us recommend the perfect recipes for you</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Cuisine Types</Text>
          <Text style={styles.sectionSubtitle}>You can select multiple</Text>
          <View style={styles.cuisineGrid}>
            {cuisines.map((cuisine) => (
              <TouchableOpacity
                key={cuisine.id}
                style={[
                  styles.cuisineButton,
                  cuisinePreferences.includes(cuisine.id) && styles.selectedCuisine,
                ]}
                onPress={() => toggleCuisine(cuisine.id)}
              >
                <Text style={styles.cuisineIcon}>{cuisine.icon}</Text>
                <Text
                  style={[
                    styles.cuisineText,
                    cuisinePreferences.includes(cuisine.id) && styles.selectedCuisineText,
                  ]}
                >
                  {cuisine.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cooking Time per Meal</Text>
          <View style={styles.timeContainer}>
            {timeOptions.map((timeOption) => (
              <TouchableOpacity
                key={timeOption.id}
                style={[
                  styles.timeButton,
                  cookingTime === timeOption.id && styles.selectedTime,
                ]}
                onPress={() => setCookingTime(timeOption.id)}
              >
                <Text style={styles.timeIcon}>{timeOption.icon}</Text>
                <Text
                  style={[
                    styles.timeText,
                    cookingTime === timeOption.id && styles.selectedTimeText,
                  ]}
                >
                  {timeOption.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Preference</Text>
          <View style={styles.budgetContainer}>
            {budgetOptions.map((budgetOption) => (
              <TouchableOpacity
                key={budgetOption.id}
                style={[
                  styles.budgetButton,
                  budget === budgetOption.id && styles.selectedBudget,
                ]}
                onPress={() => setBudget(budgetOption.id)}
              >
                <View style={styles.budgetContent}>
                  <Text style={styles.budgetIcon}>{budgetOption.icon}</Text>
                  <View style={styles.budgetTextContainer}>
                    <Text
                      style={[
                        styles.budgetText,
                        budget === budgetOption.id && styles.selectedBudgetText,
                      ]}
                    >
                      {budgetOption.label}
                    </Text>
                    <Text style={styles.budgetDescription}>
                      {budgetOption.description}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.completeButton, !isFormValid && styles.disabledButton]}
          onPress={handleComplete}
          disabled={!isFormValid}
        >
          <Text style={[styles.completeButtonText, !isFormValid && styles.disabledText]}>
            Complete Setup
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
  cuisineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cuisineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
    marginBottom: 8,
  },
  selectedCuisine: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
  },
  cuisineIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  cuisineText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCuisineText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  timeContainer: {
    gap: 12,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
  },
  selectedTime: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
  },
  timeIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  timeText: {
    fontSize: 16,
    color: '#666',
  },
  selectedTimeText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  budgetContainer: {
    gap: 12,
  },
  budgetButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
  },
  selectedBudget: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
  },
  budgetContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  budgetTextContainer: {
    flex: 1,
  },
  budgetText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  selectedBudgetText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  budgetDescription: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
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
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  disabledText: {
    color: '#999',
  },
});