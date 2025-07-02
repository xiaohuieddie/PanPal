import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/RootNavigator';

type HealthSetupScreenNavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'HealthSetup'>;

export default function HealthSetupScreen() {
  const navigation = useNavigation<HealthSetupScreenNavigationProp>();
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState<string | null>(null);

  const goals = [
    { id: 'lose_fat', label: 'Lose Weight', icon: '🏃‍♂️' },
    { id: 'gain_muscle', label: 'Build Muscle', icon: '💪' },
    { id: 'control_sugar', label: 'Control Sugar', icon: '🩺' },
    { id: 'maintain', label: 'Maintain Weight', icon: '⚖️' },
  ];

  const handleNext = () => {
    if (gender && age && height && weight && goal) {
      navigation.navigate('PreferencesSetup');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const isFormValid = gender && age && height && weight && goal;

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
          <Text style={styles.title}>Tell us about yourself</Text>
          <Text style={styles.subtitle}>Help us create your personalized plan</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gender</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'male' && styles.selectedButton]}
              onPress={() => setGender('male')}
            >
              <Text style={[styles.genderText, gender === 'male' && styles.selectedText]}>
                👨 Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'female' && styles.selectedButton]}
              onPress={() => setGender('female')}
            >
              <Text style={[styles.genderText, gender === 'female' && styles.selectedText]}>
                👩 Female
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="Enter your age"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              placeholder="Enter your height"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder="Enter your weight"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Health Goal</Text>
          <View style={styles.goalsContainer}>
            {goals.map((goalItem) => (
              <TouchableOpacity
                key={goalItem.id}
                style={[
                  styles.goalButton,
                  goal === goalItem.id && styles.selectedGoalButton,
                ]}
                onPress={() => setGoal(goalItem.id)}
              >
                <Text style={styles.goalIcon}>{goalItem.icon}</Text>
                <Text
                  style={[
                    styles.goalText,
                    goal === goalItem.id && styles.selectedGoalText,
                  ]}
                >
                  {goalItem.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !isFormValid && styles.disabledButton]}
          onPress={handleNext}
          disabled={!isFormValid}
        >
          <Text style={[styles.nextButtonText, !isFormValid && styles.disabledText]}>
            Next
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
    marginBottom: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  selectedButton: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
  },
  genderText: {
    fontSize: 16,
    color: '#666',
  },
  selectedText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  goalsContainer: {
    gap: 12,
  },
  goalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
  },
  selectedGoalButton: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
  },
  goalIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  goalText: {
    fontSize: 16,
    color: '#666',
  },
  selectedGoalText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  footer: {
    padding: 24,
    paddingBottom: 34,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  disabledText: {
    color: '#999',
  },
});