import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/RootNavigator';
import { theme } from '../../utils/theme';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  const handleGetStarted = () => {
    navigation.navigate('HealthSetup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.gradients.primary}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>🍳</Text>
            <Text style={styles.appName}>PanPal</Text>
            <Text style={styles.subtitle}>Have Fun With Cooking</Text>
          </View>

          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Make Healthy Eating Simple</Text>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🎯</Text>
              <Text style={styles.featureText}>Personalized meal recommendations</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🛒</Text>
              <Text style={styles.featureText}>One-click shopping lists</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>📱</Text>
              <Text style={styles.featureText}>Daily check-ins & rewards</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={handleGetStarted}>
            <Text style={styles.startButtonText}>Get Started</Text>
          </TouchableOpacity>

          <Text style={styles.loginText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoText: {
    fontSize: 80,
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 60,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    color: 'white',
    flex: 1,
  },
  startButton: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: theme.borderRadius.round,
    marginBottom: 20,
    ...theme.shadows.medium,
  },
  startButtonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.primary,
    textAlign: 'center',
  },
  loginText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});