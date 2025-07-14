import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../utils/theme';
import { useMealPlan } from '../../contexts/MealPlanContext';

export default function MealPlanScreen() {
  const { currentMealPlan, loading, refreshMealPlan } = useMealPlan();
  const [selectedDay, setSelectedDay] = useState(0);

  const handleRefresh = async () => {
    await refreshMealPlan();
  };

  const renderMealCard = (meal: any, mealType: string) => (
    <View style={styles.mealSection}>
      <Text style={styles.mealTypeTitle}>{mealType}</Text>
      <TouchableOpacity style={styles.recipeCard}>
        <View style={styles.recipeImage}>
          <Text style={styles.recipeImagePlaceholder}>
            {mealType.includes('Breakfast') ? '🥣' : mealType.includes('Lunch') ? '🍖' : '🍜'}
          </Text>
        </View>
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeName}>{meal.name}</Text>
          <Text style={styles.recipeDetails}>
            {meal.calories} kcal • {meal.cookingTime} min
          </Text>
          <View style={styles.recipeActions}>
            <TouchableOpacity style={styles.viewRecipeButton}>
              <Text style={styles.viewRecipeText}>View Recipe</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.replaceButton}>
              <Text style={styles.replaceText}>Replace</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Generating your personalized meal plan...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentMealPlan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noMealPlanContainer}>
          <Text style={styles.noMealPlanText}>No meal plan generated yet</Text>
          <TouchableOpacity style={styles.generateButton} onPress={handleRefresh}>
            <Text style={styles.generateButtonText}>Generate Meal Plan</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Meal Plan</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Ionicons name="refresh" size={20} color={theme.colors.primary} />
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* Week Navigation */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.weekNav}
        contentContainerStyle={styles.weekNavContent}
      >
        {currentMealPlan.dailyMeals.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayTab,
              selectedDay === index && styles.selectedDayTab,
            ]}
            onPress={() => setSelectedDay(index)}
          >
            <Text
              style={[
                styles.dayText,
                selectedDay === index && styles.selectedDayText,
              ]}
            >
              {day.day}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Daily Meals */}
        <View style={styles.dayContainer}>
          <Text style={styles.dateText}>
            {currentMealPlan.dailyMeals[selectedDay].day} • {currentMealPlan.dailyMeals[selectedDay].date}
          </Text>

          {/* Breakfast */}
          {renderMealCard(
            currentMealPlan.dailyMeals[selectedDay].meals.breakfast,
            '🌅 Breakfast'
          )}

          {/* Lunch */}
          {renderMealCard(
            currentMealPlan.dailyMeals[selectedDay].meals.lunch,
            '☀️ Lunch'
          )}

          {/* Dinner */}
          {renderMealCard(
            currentMealPlan.dailyMeals[selectedDay].meals.dinner,
            '🌙 Dinner'
          )}

          {/* Daily Nutrition Summary */}
          <View style={styles.nutritionCard}>
            <Text style={styles.nutritionTitle}>Today's Nutrition</Text>
            <View style={styles.nutritionRow}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>
                  {currentMealPlan.dailyMeals[selectedDay].totalCalories}
                </Text>
                <Text style={styles.nutritionLabel}>Total Calories</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>
                  {currentMealPlan.dailyMeals[selectedDay].totalProtein}g
                </Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>
                  {currentMealPlan.dailyMeals[selectedDay].totalFat}g
                </Text>
                <Text style={styles.nutritionLabel}>Fat</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>
                  {currentMealPlan.dailyMeals[selectedDay].totalCarbs}g
                </Text>
                <Text style={styles.nutritionLabel}>Carbs</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Generate Shopping List Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.shoppingListButton}>
          <Text style={styles.shoppingListText}>🛒 Generate Shopping List</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    padding: 8,
  },
  refreshText: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  weekNav: {
    maxHeight: 60,
  },
  weekNavContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  dayTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  selectedDayTab: {
    backgroundColor: theme.colors.primary,
  },
  dayText: {
    fontSize: 14,
    color: '#666',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dayContainer: {
    paddingBottom: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  mealSection: {
    marginBottom: 20,
  },
  mealTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  recipeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  recipeImagePlaceholder: {
    fontSize: 32,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  recipeDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  recipeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewRecipeButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewRecipeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  replaceButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  replaceText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  nutritionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  nutritionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  shoppingListButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
  },
  shoppingListText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  noMealPlanContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMealPlanText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});