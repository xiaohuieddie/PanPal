import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../utils/theme';

export default function HomeScreen() {
  const weeklyProgress = 3; // out of 7 days
  const streakDays = 5;
  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.dateText}>{currentDate}</Text>
              <Text style={styles.greeting}>Hi, User</Text>
            </View>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>🍳</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>What would you like to cook today?</Text>
        </View>

        {/* Featured Recipe Card */}
        <View style={styles.featuredSection}>
          <LinearGradient
            colors={theme.gradients.primary as [string, string]}
            style={styles.featuredCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.featuredContent}>
              <Text style={styles.featuredTitle}>Garlic Broccoli Chicken Breast</Text>
              <Text style={styles.featuredSubtitle}>Balanced Nutrition • 25 min</Text>
              <TouchableOpacity style={styles.continueButton}>
                <Text style={styles.continueButtonText}>▶ Continue Cooking</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.featuredImageContainer}>
              <Text style={styles.featuredImagePlaceholder}>🍖</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Best Chef Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Chefs</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chefScrollContent}
          >
            {[
              { name: 'Chef Lin', image: '👨‍🍳', specialty: 'Sichuan Cuisine' },
              { name: 'Chef Mei', image: '👩‍🍳', specialty: 'Light Meals' },
              { name: 'Chef Hua', image: '👨‍🍳', specialty: 'Cantonese' },
              { name: 'Chef Ya', image: '👩‍🍳', specialty: 'Vegetarian' },
            ].map((chef, index) => (
              <TouchableOpacity key={index} style={styles.chefCard}>
                <View style={styles.chefImageContainer}>
                  <Text style={styles.chefImage}>{chef.image}</Text>
                </View>
                <Text style={styles.chefName}>{chef.name}</Text>
                <Text style={styles.chefSpecialty}>{chef.specialty}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Just for You Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.recommendationGrid}>
            <TouchableOpacity style={styles.largeRecipeCard}>
              <LinearGradient
                colors={['#FF6B6B', '#FF8A80']}
                style={styles.recipeCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.recipeContent}>
                  <Text style={styles.recipeTitle}>Garlic Broccoli</Text>
                  <Text style={styles.recipeSubtitle}>Balanced Nutrition</Text>
                  <View style={styles.recipeImageContainer}>
                    <Text style={styles.recipeImagePlaceholder}>🥦</Text>
                  </View>
                  <TouchableOpacity style={styles.tryButton}>
                    <Text style={styles.tryButtonText}>Try It</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.largeRecipeCard}>
              <LinearGradient
                colors={['#4A4A4A', '#6B6B6B']}
                style={styles.recipeCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.recipeContent}>
                  <Text style={styles.recipeTitle}>Tomato Egg Noodles</Text>
                  <Text style={styles.recipeSubtitle}>Simple & Delicious</Text>
                  <View style={styles.recipeImageContainer}>
                    <Text style={styles.recipeImagePlaceholder}>🍜</Text>
                  </View>
                  <TouchableOpacity style={styles.tryButton}>
                    <Text style={styles.tryButtonText}>Try It</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.section}>
          <View style={styles.progressSection}>
            <View style={styles.progressCard}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressTitle}>Weekly Progress</Text>
                <Text style={styles.progressStats}>{weeklyProgress}/7 days</Text>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${(weeklyProgress / 7) * 100}%` }]} />
                  </View>
                </View>
                <Text style={styles.streakText}>🔥 {streakDays} day streak</Text>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
  },
  header: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  dateText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  greeting: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
  },
  featuredSection: {
    marginBottom: theme.spacing.xxl,
  },
  featuredCard: {
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  featuredContent: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text.white,
    marginBottom: theme.spacing.xs,
  },
  featuredSubtitle: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: theme.spacing.lg,
  },
  continueButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    alignSelf: 'flex-start',
  },
  continueButtonText: {
    color: theme.colors.text.white,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
  },
  featuredImageContainer: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.large,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.lg,
  },
  featuredImagePlaceholder: {
    fontSize: 40,
  },
  section: {
    marginBottom: theme.spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  seeAllText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  chefScrollContent: {
    paddingRight: theme.spacing.xl,
  },
  chefCard: {
    alignItems: 'center',
    marginRight: theme.spacing.lg,
    width: 80,
  },
  chefImageContainer: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  chefImage: {
    fontSize: 28,
  },
  chefName: {
    fontSize: theme.fontSize.xs,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 2,
    textAlign: 'center',
  },
  chefSpecialty: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  recommendationGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  largeRecipeCard: {
    flex: 1,
    height: 200,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  recipeCardGradient: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  recipeContent: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text.white,
    marginBottom: theme.spacing.xs,
  },
  recipeSubtitle: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: theme.spacing.lg,
  },
  recipeImageContainer: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.md,
  },
  recipeImagePlaceholder: {
    fontSize: 32,
  },
  tryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
    alignSelf: 'flex-start',
  },
  tryButtonText: {
    color: theme.colors.text.white,
    fontSize: theme.fontSize.xs,
    fontWeight: '600',
  },
  progressSection: {
    marginBottom: theme.spacing.xl,
  },
  progressCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.xl,
    ...theme.shadows.medium,
  },
  progressInfo: {
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  progressStats: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  progressBarContainer: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.small,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.small,
  },
  streakText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
});