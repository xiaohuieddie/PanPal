import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../utils/theme';
import { useMealPlan } from '../../contexts/MealPlanContext';
import { useAuth } from '../../contexts/AuthContext';

export default function HomeScreen() {
  const { userProfile } = useAuth();
  const { todayMeals, currentMealPlan, loading, refreshMealPlan } = useMealPlan();
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);
  
  const weeklyProgress = 3; // out of 7 days
  const streakDays = 5;
  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });

  const handleRefreshMeals = async () => {
    await refreshMealPlan();
  };

  const renderMealCard = (meal: any, mealType: string) => (
    <View style={styles.mealCard}>
      <View style={styles.mealHeader}>
        <Text style={styles.mealType}>{mealType}</Text>
        <Text style={styles.mealCalories}>{meal.nutrition?.calories || 0} kcal</Text>
      </View>
      <Text style={styles.mealName}>{meal.name}</Text>
      <Text style={styles.mealTime}>{meal.cookingTime} min</Text>
    </View>
  );

  const renderWeeklyView = () => (
    <Modal
      visible={showWeeklyModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Weekly Meal Plan</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowWeeklyModal(false)}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          {currentMealPlan?.meals.map((day, index) => (
            <View key={index} style={styles.weeklyDayCard}>
              <Text style={styles.weeklyDayTitle}>{day.date}</Text>
              <View style={styles.weeklyMealsContainer}>
                {renderMealCard(day.breakfast, '🌅 Breakfast')}
                {renderMealCard(day.lunch, '☀️ Lunch')}
                {renderMealCard(day.dinner, '🌙 Dinner')}
              </View>
              <View style={styles.dailyNutrition}>
                <Text style={styles.nutritionText}>
                  {day.totalCalories || 0} kcal • {day.totalProtein || 0}g protein • {day.totalFat || 0}g fat • {day.totalCarbs || 0}g carbs
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.dateText}>{currentDate}</Text>
              <Text style={styles.greeting}>Hi, {userProfile?.name || 'User'}</Text>
            </View>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>🍳</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>What would you like to cook today?</Text>
        </View>

        {/* Today's Menu Section */}
        <View style={styles.todayMenuSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Menu</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.refreshButton} onPress={handleRefreshMeals}>
                <Ionicons name="refresh" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.expandButton} 
                onPress={() => setShowWeeklyModal(true)}
              >
                <Ionicons name="calendar-outline" size={16} color={theme.colors.primary} />
                <Text style={styles.expandButtonText}>Weekly</Text>
              </TouchableOpacity>
            </View>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Generating your personalized menu...</Text>
            </View>
          ) : todayMeals ? (
            <LinearGradient
              colors={theme.gradients.primary as [string, string]}
              style={styles.todayMenuCard}
            >
              <View style={styles.todayMenuContent}>
                <Text style={styles.todayMenuTitle}>Your Personalized Meals</Text>
                
                <View style={styles.todayMealsContainer}>
                  {renderMealCard(todayMeals.breakfast, '🌅 Breakfast')}
                  {renderMealCard(todayMeals.lunch, '☀️ Lunch')}
                  {renderMealCard(todayMeals.dinner, '🌙 Dinner')}
                </View>

                <View style={styles.todayNutrition}>
                  <Text style={styles.todayNutritionTitle}>Today's Nutrition</Text>
                  <Text style={styles.todayNutritionText}>
                    {todayMeals.totalCalories} kcal • {todayMeals.totalProtein}g protein • {todayMeals.totalFat}g fat • {todayMeals.totalCarbs}g carbs
                  </Text>
                </View>

                <TouchableOpacity style={styles.startCookingButton}>
                  <Text style={styles.startCookingText}>Start Cooking</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          ) : (
            <View style={styles.noMealsContainer}>
              <Text style={styles.noMealsText}>No meals generated yet</Text>
              <TouchableOpacity style={styles.generateButton} onPress={handleRefreshMeals}>
                <Text style={styles.generateButtonText}>Generate Menu</Text>
              </TouchableOpacity>
            </View>
          )}
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

      {/* Weekly Modal */}
      {renderWeeklyView()}
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
  todayMenuSection: {
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    padding: theme.spacing.sm,
  },
  expandButton: {
    padding: theme.spacing.sm,
  },
  expandButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
  },
  todayMenuCard: {
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  todayMenuContent: {
    flex: 1,
  },
  todayMenuTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text.white,
    marginBottom: theme.spacing.xs,
  },
  todayMealsContainer: {
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  todayNutrition: {
    marginBottom: theme.spacing.xl,
  },
  todayNutritionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text.white,
    marginBottom: theme.spacing.sm,
  },
  todayNutritionText: {
    fontSize: theme.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  startCookingButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    alignSelf: 'flex-start',
  },
  startCookingText: {
    color: theme.colors.text.white,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
  },
  noMealsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMealsText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  generateButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
  },
  generateButtonText: {
    color: theme.colors.text.white,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
  },
  section: {
    marginBottom: theme.spacing.xxl,
  },
  mealCard: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.medium,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  mealType: {
    fontSize: theme.fontSize.sm,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  mealCalories: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  mealName: {
    fontSize: theme.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  mealTime: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
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
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  modalTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  modalContent: {
    flex: 1,
  },
  weeklyDayCard: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primaryLight,
  },
  weeklyDayTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  weeklyMealsContainer: {
    marginBottom: theme.spacing.md,
  },
  dailyNutrition: {
    marginTop: theme.spacing.md,
  },
  nutritionText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
  },
});