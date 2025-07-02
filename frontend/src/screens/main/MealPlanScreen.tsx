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
import { theme } from '../../utils/theme';

const mockMealPlan = [
  {
    date: '2024-07-01',
    day: '周一',
    meals: {
      breakfast: { name: '燕麦牛奶杯', calories: 320, time: '15分钟' },
      lunch: { name: '蒜蓉西兰花鸡胸肉', calories: 450, time: '25分钟' },
      dinner: { name: '番茄鸡蛋面', calories: 380, time: '20分钟' },
    },
  },
  {
    date: '2024-07-02',
    day: '周二',
    meals: {
      breakfast: { name: '全麦吐司配牛油果', calories: 280, time: '10分钟' },
      lunch: { name: '香煎三文鱼配糙米', calories: 520, time: '30分钟' },
      dinner: { name: '冬瓜排骨汤', calories: 300, time: '45分钟' },
    },
  },
  {
    date: '2024-07-03',
    day: '周三',
    meals: {
      breakfast: { name: '紫薯小米粥', calories: 240, time: '20分钟' },
      lunch: { name: '虾仁炒河粉', calories: 420, time: '25分钟' },
      dinner: { name: '蒸蛋羹配青菜', calories: 260, time: '15分钟' },
    },
  },
];

export default function MealPlanScreen() {
  const [selectedDay, setSelectedDay] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>本周菜谱</Text>
        <TouchableOpacity style={styles.refreshButton}>
          <Text style={styles.refreshText}>🔄 换一换</Text>
        </TouchableOpacity>
      </View>

      {/* Week Navigation */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.weekNav}
        contentContainerStyle={styles.weekNavContent}
      >
        {mockMealPlan.map((day, index) => (
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
            {mockMealPlan[selectedDay].day} • {mockMealPlan[selectedDay].date}
          </Text>

          {/* Breakfast */}
          <View style={styles.mealSection}>
            <Text style={styles.mealTypeTitle}>🌅 早餐</Text>
            <TouchableOpacity style={styles.recipeCard}>
              <View style={styles.recipeImage}>
                <Text style={styles.recipeImagePlaceholder}>🥣</Text>
              </View>
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>
                  {mockMealPlan[selectedDay].meals.breakfast.name}
                </Text>
                <Text style={styles.recipeDetails}>
                  {mockMealPlan[selectedDay].meals.breakfast.calories} kcal • {mockMealPlan[selectedDay].meals.breakfast.time}
                </Text>
                <View style={styles.recipeActions}>
                  <TouchableOpacity style={styles.viewRecipeButton}>
                    <Text style={styles.viewRecipeText}>查看食谱</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.replaceButton}>
                    <Text style={styles.replaceText}>换一换</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Lunch */}
          <View style={styles.mealSection}>
            <Text style={styles.mealTypeTitle}>☀️ 午餐</Text>
            <TouchableOpacity style={styles.recipeCard}>
              <View style={styles.recipeImage}>
                <Text style={styles.recipeImagePlaceholder}>🍖</Text>
              </View>
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>
                  {mockMealPlan[selectedDay].meals.lunch.name}
                </Text>
                <Text style={styles.recipeDetails}>
                  {mockMealPlan[selectedDay].meals.lunch.calories} kcal • {mockMealPlan[selectedDay].meals.lunch.time}
                </Text>
                <View style={styles.recipeActions}>
                  <TouchableOpacity style={styles.viewRecipeButton}>
                    <Text style={styles.viewRecipeText}>查看食谱</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.replaceButton}>
                    <Text style={styles.replaceText}>换一换</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Dinner */}
          <View style={styles.mealSection}>
            <Text style={styles.mealTypeTitle}>🌙 晚餐</Text>
            <TouchableOpacity style={styles.recipeCard}>
              <View style={styles.recipeImage}>
                <Text style={styles.recipeImagePlaceholder}>🍜</Text>
              </View>
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>
                  {mockMealPlan[selectedDay].meals.dinner.name}
                </Text>
                <Text style={styles.recipeDetails}>
                  {mockMealPlan[selectedDay].meals.dinner.calories} kcal • {mockMealPlan[selectedDay].meals.dinner.time}
                </Text>
                <View style={styles.recipeActions}>
                  <TouchableOpacity style={styles.viewRecipeButton}>
                    <Text style={styles.viewRecipeText}>查看食谱</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.replaceButton}>
                    <Text style={styles.replaceText}>换一换</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Daily Nutrition Summary */}
          <View style={styles.nutritionCard}>
            <Text style={styles.nutritionTitle}>今日营养摄入</Text>
            <View style={styles.nutritionRow}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>1,150</Text>
                <Text style={styles.nutritionLabel}>总热量</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>78g</Text>
                <Text style={styles.nutritionLabel}>蛋白质</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>32g</Text>
                <Text style={styles.nutritionLabel}>脂肪</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>145g</Text>
                <Text style={styles.nutritionLabel}>碳水</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Generate Shopping List Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.shoppingListButton}>
          <Text style={styles.shoppingListText}>🛒 生成购物清单</Text>
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
});