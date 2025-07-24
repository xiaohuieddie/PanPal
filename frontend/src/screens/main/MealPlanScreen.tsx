import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../utils/theme';
import { useMealPlan } from '../../contexts/MealPlanContext';
import { AIService } from '../../services/aiService';
import { YouTubeVideo } from '../../types/recipe';
import { WebView } from 'react-native-webview';

export default function MealPlanScreen() {
  const { currentMealPlan, loading, refreshMealPlan } = useMealPlan();
  const [selectedDay, setSelectedDay] = useState(0);
  const [viewMode, setViewMode] = useState<'video' | 'recipe'>('video');
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');
  const [currentVideo, setCurrentVideo] = useState<YouTubeVideo | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  // Get current meal type based on time
  const getCurrentMealType = (): 'breakfast' | 'lunch' | 'dinner' => {
    const currentHour = new Date().getHours();
    if (currentHour < 10) return 'breakfast';
    if (currentHour < 16) return 'lunch';
    return 'dinner';
  };



  // Ensure selectedDay is within bounds and set initial meal type
  React.useEffect(() => {
    if (currentMealPlan?.meals && selectedDay >= currentMealPlan.meals.length) {
      setSelectedDay(0);
    }
    
    // Set initial meal type based on current time
    setSelectedMealType(getCurrentMealType());
  }, [currentMealPlan, selectedDay]);

  useEffect(() => {
    if (viewMode === 'video') {
      fetchCookingVideo();
      setShowVideoPlayer(false);
    }
    // eslint-disable-next-line
  }, [selectedDay, selectedMealType, viewMode]);

  const fetchCookingVideo = async () => {
    const meal = getCurrentMeal();
    if (!meal?.name) {
      setCurrentVideo(null);
      return;
    }
    setVideoLoading(true);
    try {
      const videos = await AIService.searchCookingVideos(meal.name, 1);
      setCurrentVideo(videos[0] || null);
    } catch (e) {
      setCurrentVideo(null);
    } finally {
      setVideoLoading(false);
    }
  };

  const handleRefresh = async () => {
    await refreshMealPlan();
  };

  // Get current meal data based on selected meal type
  const getCurrentMeal = () => {
    if (!currentMealPlan?.meals?.[selectedDay]) return null;
    return currentMealPlan.meals[selectedDay][selectedMealType];
  };

  const renderMealCard = (meal: any, mealType: string) => {
    if (!meal) {
      return (
        <View style={styles.mealSection}>
          <Text style={styles.mealTypeTitle}>{mealType}</Text>
          <View style={styles.recipeCard}>
            <View style={styles.recipeImage}>
              <Text style={styles.recipeImagePlaceholder}>
                {mealType.includes('Breakfast') ? '🥣' : mealType.includes('Lunch') ? '🍖' : '🍜'}
              </Text>
            </View>
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeName}>No meal available</Text>
              <Text style={styles.recipeDetails}>0 kcal • 0 min</Text>
              <View style={styles.recipeActions}>
                <TouchableOpacity style={styles.replaceButton}>
                  <Text style={styles.replaceText}>Generate Meal</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.mealSection}>
        <Text style={styles.mealTypeTitle}>{mealType}</Text>
        <View style={styles.recipeCard}>
          <View style={styles.recipeImage}>
            <Text style={styles.recipeImagePlaceholder}>
              {mealType.includes('Breakfast') ? '🥣' : mealType.includes('Lunch') ? '🍖' : '🍜'}
            </Text>
          </View>
          <View style={styles.recipeInfo}>
            <Text style={styles.recipeName}>{meal.name || 'Unnamed Meal'}</Text>
            <Text style={styles.recipeDetails}>
              {meal.nutrition?.calories || meal.calories || 0} kcal • {meal.cookingTime || 0} min
            </Text>
            <View style={styles.recipeActions}>
              <Text style={styles.tapToViewText}>Recipe details available</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Generating your personalized meal plan...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentMealPlan || !currentMealPlan.meals || currentMealPlan.meals.length === 0) {
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
        {currentMealPlan.meals.map((day, index) => (
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
              {new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Daily Meals */}
        <View style={styles.dayContainer}>
          {currentMealPlan.meals[selectedDay] && (
            <>
              <Text style={styles.dateText}>
                {new Date(currentMealPlan.meals[selectedDay].date + 'T12:00:00').toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>

              {/* Video/Recipe Slider */}
              <View style={styles.videoRecipeSlider}>
                {/* Meal Type Selection */}
                <View style={styles.mealTypeSelector}>
                  <TouchableOpacity 
                    style={[styles.mealTypeButton, selectedMealType === 'breakfast' && styles.activeMealTypeButton]}
                    onPress={() => setSelectedMealType('breakfast')}
                  >
                    <Text style={styles.mealTypeIcon}>🌅</Text>
                    <Text style={[styles.mealTypeText, selectedMealType === 'breakfast' && styles.activeMealTypeText]}>
                      Breakfast
                    </Text>
                    {getCurrentMealType() === 'breakfast' && (
                      <View style={styles.currentTimeIndicator}>
                        <Text style={styles.currentTimeText}>Now</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.mealTypeButton, selectedMealType === 'lunch' && styles.activeMealTypeButton]}
                    onPress={() => setSelectedMealType('lunch')}
                  >
                    <Text style={styles.mealTypeIcon}>☀️</Text>
                    <Text style={[styles.mealTypeText, selectedMealType === 'lunch' && styles.activeMealTypeText]}>
                      Lunch
                    </Text>
                    {getCurrentMealType() === 'lunch' && (
                      <View style={styles.currentTimeIndicator}>
                        <Text style={styles.currentTimeText}>Now</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.mealTypeButton, selectedMealType === 'dinner' && styles.activeMealTypeButton]}
                    onPress={() => setSelectedMealType('dinner')}
                  >
                    <Text style={styles.mealTypeIcon}>🌙</Text>
                    <Text style={[styles.mealTypeText, selectedMealType === 'dinner' && styles.activeMealTypeText]}>
                      Dinner
                    </Text>
                    {getCurrentMealType() === 'dinner' && (
                      <View style={styles.currentTimeIndicator}>
                        <Text style={styles.currentTimeText}>Now</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                {/* View Mode Toggle */}
                <View style={styles.viewModeToggle}>
                  <TouchableOpacity 
                    style={[styles.toggleButton, viewMode === 'video' && styles.activeToggleButton]}
                    onPress={() => setViewMode('video')}
                  >
                    <Ionicons name="play-circle" size={20} color={viewMode === 'video' ? 'white' : '#666'} />
                    <Text style={[styles.toggleText, viewMode === 'video' && styles.activeToggleText]}>
                      Video
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.toggleButton, viewMode === 'recipe' && styles.activeToggleButton]}
                    onPress={() => setViewMode('recipe')}
                  >
                    <Ionicons name="document-text" size={20} color={viewMode === 'recipe' ? 'white' : '#666'} />
                    <Text style={[styles.toggleText, viewMode === 'recipe' && styles.activeToggleText]}>
                      Recipe
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.sliderContent}>
                  {viewMode === 'video' ? (
                    <View style={styles.videoContainer}>
                      {videoLoading ? (
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                      ) : currentVideo && currentVideo.embedUrl && currentVideo.embedUrl.startsWith('https://www.youtube.com/embed/') ? (
                        <WebView
                          source={{ uri: currentVideo.embedUrl }}
                          style={{ width: 320, height: 180, borderRadius: 12 }}
                          allowsFullscreenVideo
                          javaScriptEnabled
                          domStorageEnabled
                          originWhitelist={['*']}
                          startInLoadingState
                        />
                      ) : (
                        <View style={styles.videoPlaceholder}>
                          <Ionicons name="play-circle" size={80} color="#ccc" />
                          <Text style={styles.videoPlaceholderText}>
                            {getCurrentMeal()?.name || `${selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)} Video`}
                          </Text>
                          <Text style={styles.videoPlaceholderSubtext}>
                            How to cook {getCurrentMeal()?.name || selectedMealType} tutorial
                          </Text>
                        </View>
                      )}
                    </View>
                  ) : (
                    <ScrollView style={styles.recipeContent}>
                      {getCurrentMeal() ? (
                        <>
                          <View style={styles.recipeSection}>
                            <Text style={styles.recipeSectionTitle}>
                              {getCurrentMeal()?.name || `${selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)} Recipe`}
                            </Text>
                            <Text style={styles.recipeText}>
                              {`Delicious ${selectedMealType} recipe`}
                            </Text>
                          </View>
                          
                          <View style={styles.recipeSection}>
                            <Text style={styles.recipeSectionTitle}>Ingredients</Text>
                            <Text style={styles.recipeText}>
                              {getCurrentMeal()?.ingredients?.join('\n• ') || 'Ingredients not available'}
                            </Text>
                          </View>
                          
                          <View style={styles.recipeSection}>
                            <Text style={styles.recipeSectionTitle}>Instructions</Text>
                            <Text style={styles.recipeText}>
                              Cooking instructions not available
                            </Text>
                          </View>
                          
                          <View style={styles.recipeSection}>
                            <Text style={styles.recipeSectionTitle}>Nutrition</Text>
                            <Text style={styles.recipeText}>
                              Calories: {getCurrentMeal()?.nutrition?.calories || 0} kcal{'\n'}
                              Protein: {getCurrentMeal()?.nutrition?.protein || 0}g{'\n'}
                              Fat: {getCurrentMeal()?.nutrition?.fat || 0}g{'\n'}
                              Carbs: {getCurrentMeal()?.nutrition?.carbs || 0}g{'\n'}
                              Cooking Time: {getCurrentMeal()?.cookingTime || 0} min
                            </Text>
                          </View>
                        </>
                      ) : (
                        <View style={styles.recipeSection}>
                          <Text style={styles.recipeSectionTitle}>No {selectedMealType} available</Text>
                          <Text style={styles.recipeText}>
                            No {selectedMealType} recipe is available for today. Please check other meal types or generate a new meal plan.
                          </Text>
                        </View>
                      )}
                    </ScrollView>
                  )}
                </View>
              </View>

              {/* Breakfast */}
              {renderMealCard(
                currentMealPlan.meals[selectedDay].breakfast,
                '🌅 Breakfast'
              )}

              {/* Lunch */}
              {renderMealCard(
                currentMealPlan.meals[selectedDay].lunch,
                '☀️ Lunch'
              )}

              {/* Dinner */}
              {renderMealCard(
                currentMealPlan.meals[selectedDay].dinner,
                '🌙 Dinner'
              )}
            </>
          )}

          {/* Daily Nutrition Summary */}
          <View style={styles.nutritionCard}>
            <Text style={styles.nutritionTitle}>Today's Nutrition</Text>
            <View style={styles.nutritionRow}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>
                  {currentMealPlan.meals[selectedDay]?.totalCalories || 0}
                </Text>
                <Text style={styles.nutritionLabel}>Total Calories</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>
                  {currentMealPlan.meals[selectedDay]?.totalProtein || 0}g
                </Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>
                  {currentMealPlan.meals[selectedDay]?.totalFat || 0}g
                </Text>
                <Text style={styles.nutritionLabel}>Fat</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>
                  {currentMealPlan.meals[selectedDay]?.totalCarbs || 0}g
                </Text>
                <Text style={styles.nutritionLabel}>Carbs</Text>
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
    borderWidth: 1,
    borderColor: '#f0f0f0',
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

  viewModeToggle: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  activeToggleButton: {
    backgroundColor: theme.colors.primary,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 6,
  },
  activeToggleText: {
    color: 'white',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 300,
  },
  videoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 40,
    width: '100%',
    height: 250,
  },
  videoPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  videoPlaceholderSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  recipeContent: {
    padding: 20,
  },
  recipeSection: {
    marginBottom: 24,
  },
  recipeSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  recipeText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  tapToViewText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontStyle: 'italic',
  },
  // Video/Recipe Slider styles
  videoRecipeSlider: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sliderContent: {
    padding: 20,
  },
  // Meal type selector styles
  mealTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mealTypeButton: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    minWidth: 80,
  },
  activeMealTypeButton: {
    backgroundColor: theme.colors.primary,
  },
  mealTypeIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  mealTypeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  activeMealTypeText: {
    color: 'white',
  },
  currentTimeIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  currentTimeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
});