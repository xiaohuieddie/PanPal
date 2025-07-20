import { ShoppingList, ShoppingItem, MealPlan, Recipe, Ingredient, GroceryPlatform, GroceryOrder, PlatformConfig, SupportedPlatform } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseService } from './firebaseService';

const SHOPPING_LISTS_KEY = 'shopping_lists';
const GROCERY_PLATFORMS_KEY = 'grocery_platforms';
const GROCERY_ORDERS_KEY = 'grocery_orders';

// Platform configurations
const PLATFORM_CONFIGS: Record<SupportedPlatform, PlatformConfig> = {
  amazon_fresh: {
    platform: 'amazon_fresh',
    name: 'Amazon Fresh',
    region: 'US',
    baseUrl: 'https://www.amazon.com/fresh',
    isAvailable: true,
    requiresAuth: true,
    authUrl: 'https://www.amazon.com/ap/oa',
    apiEndpoints: {
      search: 'https://www.amazon.com/s',
      addToCart: 'https://www.amazon.com/gp/cart/add.html',
    }
  },
  hema: {
    platform: 'hema',
    name: '盒马鲜生',
    region: 'CN',
    baseUrl: 'https://www.hema.com',
    isAvailable: true,
    requiresAuth: true,
    authUrl: 'https://www.hema.com/login',
  },
  meituan: {
    platform: 'meituan',
    name: '美团买菜',
    region: 'CN',
    baseUrl: 'https://maicai.meituan.com',
    isAvailable: true,
    requiresAuth: true,
    authUrl: 'https://maicai.meituan.com/login',
  },
  jd_home: {
    platform: 'jd_home',
    name: '京东到家',
    region: 'CN',
    baseUrl: 'https://daojia.jd.com',
    isAvailable: true,
    requiresAuth: true,
    authUrl: 'https://daojia.jd.com/login',
  }
};

export class ShoppingListService {
  /**
   * Generate shopping list from meal plan
   */
  static generateFromMealPlan(mealPlan: MealPlan): ShoppingList {
    console.log('🛒 [ShoppingListService] Generating shopping list from meal plan...');
    console.log('📅 [ShoppingListService] Meal plan week:', mealPlan.week);
    console.log('🍽️ [ShoppingListService] Number of days in meal plan:', mealPlan.meals.length);
    
    const items: ShoppingItem[] = [];
    const itemMap = new Map<string, ShoppingItem>();
    let totalIngredientsProcessed = 0;
    let totalUniqueIngredients = 0;

    // Extract ingredients from all meals
    mealPlan.meals.forEach((dayMeals, dayIndex) => {
      console.log(`📆 [ShoppingListService] Processing day ${dayIndex + 1}: ${dayMeals.date}`);
      
      [dayMeals.breakfast, dayMeals.lunch, dayMeals.dinner].forEach((meal, mealIndex) => {
        const mealTypes = ['breakfast', 'lunch', 'dinner'];
        const mealType = mealTypes[mealIndex];
        
        if (meal && meal.ingredients) {
          console.log(`🍳 [ShoppingListService] Processing ${mealType}: ${meal.name} (${meal.ingredients.length} ingredients)`);
          
          meal.ingredients.forEach(ingredient => {
            totalIngredientsProcessed++;
            const key = `${ingredient.name.toLowerCase()}_${ingredient.unit}`;
            
            if (itemMap.has(key)) {
              // Merge quantities for same ingredient
              const existing = itemMap.get(key)!;
              const existingAmount = parseFloat(existing.amount) || 0;
              const newAmount = parseFloat(ingredient.amount) || 0;
              const newTotal = existingAmount + newAmount;
              existing.amount = newTotal.toString();
              
              console.log(`🔄 [ShoppingListService] Merged ingredient: ${ingredient.name} ${ingredient.amount}${ingredient.unit} → Total: ${newTotal}${ingredient.unit}`);
            } else {
              // Create new shopping item
              totalUniqueIngredients++;
              const category = this.categorizeIngredient(ingredient.name);
              const estimatedPrice = this.estimatePrice(ingredient.name, ingredient.amount, ingredient.unit);
              
              const shoppingItem: ShoppingItem = {
                id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: ingredient.name,
                amount: ingredient.amount,
                unit: ingredient.unit,
                category: category,
                isChecked: false,
                estimatedPrice: estimatedPrice,
              };
              itemMap.set(key, shoppingItem);
              
              console.log(`➕ [ShoppingListService] Added new ingredient: ${ingredient.name} ${ingredient.amount}${ingredient.unit} (${category}) - Est. $${estimatedPrice?.toFixed(2)}`);
            }
          });
        } else {
          console.log(`⚠️ [ShoppingListService] No meal or ingredients found for ${mealType} on day ${dayIndex + 1}`);
        }
      });
    });

    const shoppingList: ShoppingList = {
      id: `list_${Date.now()}`,
      weekStartDate: mealPlan.week,
      items: Array.from(itemMap.values()),
      totalEstimatedCost: Array.from(itemMap.values()).reduce((sum, item) => sum + (item.estimatedPrice || 0), 0),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log(`✅ [ShoppingListService] Shopping list generation completed:`);
    console.log(`   📊 Total ingredients processed: ${totalIngredientsProcessed}`);
    console.log(`   🛒 Unique items in list: ${shoppingList.items.length}`);
    console.log(`   💰 Estimated total cost: $${shoppingList.totalEstimatedCost?.toFixed(2)}`);
    console.log(`   📅 Week start date: ${shoppingList.weekStartDate}`);
    console.log(`   🆔 Shopping list ID: ${shoppingList.id}`);
    
    return shoppingList;
  }

  /**
   * Categorize ingredients for better organization
   */
  private static categorizeIngredient(name: string): string {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('chicken') || lowerName.includes('beef') || lowerName.includes('pork') || lowerName.includes('fish')) {
      console.log(`🏷️ [ShoppingListService] Categorized "${name}" as Meat & Seafood`);
      return 'Meat & Seafood';
    }
    if (lowerName.includes('milk') || lowerName.includes('cheese') || lowerName.includes('yogurt') || lowerName.includes('butter')) {
      console.log(`🏷️ [ShoppingListService] Categorized "${name}" as Dairy`);
      return 'Dairy';
    }
    if (lowerName.includes('apple') || lowerName.includes('banana') || lowerName.includes('orange') || lowerName.includes('berry')) {
      console.log(`🏷️ [ShoppingListService] Categorized "${name}" as Fruits`);
      return 'Fruits';
    }
    if (lowerName.includes('tomato') || lowerName.includes('onion') || lowerName.includes('carrot') || lowerName.includes('lettuce')) {
      console.log(`🏷️ [ShoppingListService] Categorized "${name}" as Vegetables`);
      return 'Vegetables';
    }
    if (lowerName.includes('rice') || lowerName.includes('pasta') || lowerName.includes('bread') || lowerName.includes('flour')) {
      console.log(`🏷️ [ShoppingListService] Categorized "${name}" as Grains & Bread`);
      return 'Grains & Bread';
    }
    if (lowerName.includes('oil') || lowerName.includes('sauce') || lowerName.includes('spice') || lowerName.includes('salt')) {
      console.log(`🏷️ [ShoppingListService] Categorized "${name}" as Pantry`);
      return 'Pantry';
    }
    
    console.log(`🏷️ [ShoppingListService] Categorized "${name}" as Other (no specific category match)`);
    return 'Other';
  }

  /**
   * Estimate price for ingredients (basic estimation)
   */
  private static estimatePrice(name: string, amount: string, unit: string): number {
    const lowerName = name.toLowerCase();
    const quantity = parseFloat(amount) || 1;
    
    console.log(`💰 [ShoppingListService] Estimating price for: ${name} ${amount}${unit}`);
    
    // Basic price estimates (in USD)
    const priceMap: Record<string, number> = {
      'chicken': 8.99, // per lb
      'beef': 12.99, // per lb
      'salmon': 15.99, // per lb
      'milk': 4.99, // per gallon
      'eggs': 5.99, // per dozen
      'bread': 3.99, // per loaf
      'rice': 2.99, // per lb
      'tomato': 2.99, // per lb
      'onion': 1.99, // per lb
      'carrot': 1.49, // per lb
      'apple': 3.99, // per lb
      'banana': 0.59, // per lb
    };

    for (const [key, price] of Object.entries(priceMap)) {
      if (lowerName.includes(key)) {
        const estimatedPrice = price * quantity;
        console.log(`💰 [ShoppingListService] Found price match for "${key}": $${price} × ${quantity} = $${estimatedPrice.toFixed(2)}`);
        return estimatedPrice;
      }
    }

    const defaultPrice = 3.99 * quantity;
    console.log(`💰 [ShoppingListService] No specific price found for "${name}", using default: $3.99 × ${quantity} = $${defaultPrice.toFixed(2)}`);
    return defaultPrice;
  }

  /**
   * Save shopping list to local storage
   */
  static async saveShoppingList(list: ShoppingList): Promise<void> {
    console.log('💾 [ShoppingListService] Saving shopping list to local storage...');
    console.log(`   🆔 List ID: ${list.id}`);
    console.log(`   📅 Week: ${list.weekStartDate}`);
    console.log(`   🛒 Items: ${list.items.length}`);
    console.log(`   💰 Total cost: $${list.totalEstimatedCost?.toFixed(2)}`);
    
    try {
      const existingLists = await this.getShoppingLists();
      console.log(`📋 [ShoppingListService] Found ${existingLists.length} existing shopping lists`);
      
      const updatedLists = existingLists.filter(l => l.id !== list.id);
      const isNewList = existingLists.length === updatedLists.length;
      
      if (isNewList) {
        console.log('➕ [ShoppingListService] Adding new shopping list');
      } else {
        console.log('🔄 [ShoppingListService] Updating existing shopping list');
      }
      
      updatedLists.push(list);
      
      await AsyncStorage.setItem(SHOPPING_LISTS_KEY, JSON.stringify(updatedLists));
      console.log('✅ [ShoppingListService] Shopping list saved successfully to AsyncStorage');
      console.log(`   📊 Total lists in storage: ${updatedLists.length}`);
    } catch (error) {
      console.error('❌ [ShoppingListService] Failed to save shopping list:', error);
      console.error('❌ [ShoppingListService] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        listId: list.id,
        itemCount: list.items.length
      });
      throw error;
    }
  }

  /**
   * Get all shopping lists
   */
  static async getShoppingLists(): Promise<ShoppingList[]> {
    console.log('📋 [ShoppingListService] Retrieving shopping lists from local storage...');
    
    try {
      const data = await AsyncStorage.getItem(SHOPPING_LISTS_KEY);
      
      if (data) {
        console.log('📄 [ShoppingListService] Found shopping lists data in AsyncStorage');
        const lists = JSON.parse(data);
        console.log(`📊 [ShoppingListService] Parsed ${lists.length} shopping lists from storage`);
        
        const parsedLists = lists.map((list: any, index: number) => {
          const parsedList = {
            ...list,
            createdAt: new Date(list.createdAt),
            updatedAt: new Date(list.updatedAt),
          };
          
          console.log(`📋 [ShoppingListService] List ${index + 1}: ID=${parsedList.id}, Items=${parsedList.items?.length || 0}, Week=${parsedList.weekStartDate}`);
          return parsedList;
        });
        
        console.log('✅ [ShoppingListService] Successfully retrieved shopping lists');
        return parsedLists;
      } else {
        console.log('ℹ️ [ShoppingListService] No shopping lists found in AsyncStorage');
        return [];
      }
    } catch (error) {
      console.error('❌ [ShoppingListService] Failed to get shopping lists:', error);
      console.error('❌ [ShoppingListService] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        storageKey: SHOPPING_LISTS_KEY
      });
      return [];
    }
  }

  /**
   * Get shopping list by ID
   */
  static async getShoppingList(id: string): Promise<ShoppingList | null> {
    console.log(`🔍 [ShoppingListService] Looking for shopping list with ID: ${id}`);
    
    const lists = await this.getShoppingLists();
    const foundList = lists.find(list => list.id === id);
    
    if (foundList) {
      console.log(`✅ [ShoppingListService] Found shopping list: ${foundList.weekStartDate} (${foundList.items.length} items)`);
    } else {
      console.log(`❌ [ShoppingListService] Shopping list with ID ${id} not found`);
    }
    
    return foundList || null;
  }

  /**
   * Delete shopping list
   */
  static async deleteShoppingList(id: string): Promise<void> {
    console.log(`🗑️ [ShoppingListService] Attempting to delete shopping list with ID: ${id}`);
    
    try {
      const lists = await this.getShoppingLists();
      const listToDelete = lists.find(list => list.id === id);
      
      if (listToDelete) {
        console.log(`📋 [ShoppingListService] Found list to delete: ${listToDelete.weekStartDate} (${listToDelete.items.length} items)`);
      } else {
        console.log(`⚠️ [ShoppingListService] Shopping list with ID ${id} not found for deletion`);
      }
      
      const updatedLists = lists.filter(list => list.id !== id);
      const deletedCount = lists.length - updatedLists.length;
      
      await AsyncStorage.setItem(SHOPPING_LISTS_KEY, JSON.stringify(updatedLists));
      console.log(`✅ [ShoppingListService] Shopping list deletion completed`);
      console.log(`   🗑️ Lists deleted: ${deletedCount}`);
      console.log(`   📊 Remaining lists: ${updatedLists.length}`);
    } catch (error) {
      console.error('❌ [ShoppingListService] Failed to delete shopping list:', error);
      console.error('❌ [ShoppingListService] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        listId: id
      });
      throw error;
    }
  }

  /**
   * Update shopping list item
   */
  static async updateShoppingListItem(listId: string, itemId: string, updates: Partial<ShoppingItem>): Promise<void> {
    console.log(`✏️ [ShoppingListService] Updating shopping list item...`);
    console.log(`   📋 List ID: ${listId}`);
    console.log(`   🛒 Item ID: ${itemId}`);
    console.log(`   🔄 Updates:`, updates);
    
    try {
      const lists = await this.getShoppingLists();
      const listIndex = lists.findIndex(list => list.id === listId);
      
      if (listIndex === -1) {
        console.error(`❌ [ShoppingListService] Shopping list with ID ${listId} not found`);
        throw new Error(`Shopping list with ID ${listId} not found`);
      }
      
      const itemIndex = lists[listIndex].items.findIndex(item => item.id === itemId);
      if (itemIndex === -1) {
        console.error(`❌ [ShoppingListService] Item with ID ${itemId} not found in list ${listId}`);
        throw new Error(`Item with ID ${itemId} not found in list ${listId}`);
      }
      
      const originalItem = lists[listIndex].items[itemIndex];
      lists[listIndex].items[itemIndex] = { ...originalItem, ...updates };
      lists[listIndex].updatedAt = new Date();
      
      console.log(`✅ [ShoppingListService] Item updated successfully`);
      console.log(`   📝 Original: ${originalItem.name} (${originalItem.amount}${originalItem.unit})`);
      console.log(`   📝 Updated: ${lists[listIndex].items[itemIndex].name} (${lists[listIndex].items[itemIndex].amount}${lists[listIndex].items[itemIndex].unit})`);
      
      await AsyncStorage.setItem(SHOPPING_LISTS_KEY, JSON.stringify(lists));
      console.log('💾 [ShoppingListService] Updated shopping list saved to AsyncStorage');
    } catch (error) {
      console.error('❌ [ShoppingListService] Failed to update shopping item:', error);
      console.error('❌ [ShoppingListService] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        listId,
        itemId,
        updates
      });
      throw error;
    }
  }

  /**
   * Get platform configurations
   */
  static getPlatformConfigs(): PlatformConfig[] {
    console.log('🏪 [ShoppingListService] Getting platform configurations...');
    const configs = Object.values(PLATFORM_CONFIGS);
    console.log(`📋 [ShoppingListService] Found ${configs.length} platform configurations`);
    configs.forEach(config => {
      console.log(`   🏪 ${config.name} (${config.region}) - Available: ${config.isAvailable}`);
    });
    return configs;
  }

  /**
   * Get platform configuration by platform type
   */
  static getPlatformConfig(platform: SupportedPlatform): PlatformConfig {
    console.log(`🔍 [ShoppingListService] Getting platform config for: ${platform}`);
    const config = PLATFORM_CONFIGS[platform];
    if (config) {
      console.log(`✅ [ShoppingListService] Found config for ${platform}: ${config.name} (${config.region})`);
    } else {
      console.error(`❌ [ShoppingListService] No config found for platform: ${platform}`);
    }
    return config;
  }

  /**
   * Save grocery platform account
   */
  static async saveGroceryPlatform(platform: GroceryPlatform): Promise<void> {
    console.log('💾 [ShoppingListService] Saving grocery platform account...');
    console.log(`   🏪 Platform: ${platform.name} (${platform.region})`);
    console.log(`   🆔 Platform ID: ${platform.id}`);
    console.log(`   ✅ Active: ${platform.isActive}`);
    
    try {
      const platforms = await this.getGroceryPlatforms();
      console.log(`📋 [ShoppingListService] Found ${platforms.length} existing platform accounts`);
      
      const updatedPlatforms = platforms.filter(p => p.id !== platform.id);
      const isNewPlatform = platforms.length === updatedPlatforms.length;
      
      if (isNewPlatform) {
        console.log('➕ [ShoppingListService] Adding new platform account');
      } else {
        console.log('🔄 [ShoppingListService] Updating existing platform account');
      }
      
      updatedPlatforms.push(platform);
      
      await AsyncStorage.setItem(GROCERY_PLATFORMS_KEY, JSON.stringify(updatedPlatforms));
      console.log('✅ [ShoppingListService] Grocery platform saved successfully to AsyncStorage');
      console.log(`   📊 Total platforms in storage: ${updatedPlatforms.length}`);
    } catch (error) {
      console.error('❌ [ShoppingListService] Failed to save grocery platform:', error);
      console.error('❌ [ShoppingListService] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        platformId: platform.id,
        platformName: platform.name
      });
      throw error;
    }
  }

  /**
   * Get all grocery platforms
   */
  static async getGroceryPlatforms(): Promise<GroceryPlatform[]> {
    console.log('📋 [ShoppingListService] Retrieving grocery platforms from local storage...');
    
    try {
      const data = await AsyncStorage.getItem(GROCERY_PLATFORMS_KEY);
      
      if (data) {
        console.log('📄 [ShoppingListService] Found grocery platforms data in AsyncStorage');
        const platforms = JSON.parse(data);
        console.log(`📊 [ShoppingListService] Parsed ${platforms.length} grocery platforms from storage`);
        
        const parsedPlatforms = platforms.map((platform: any, index: number) => {
          const parsedPlatform = {
            ...platform,
            expiresAt: platform.expiresAt ? new Date(platform.expiresAt) : undefined,
          };
          
          console.log(`🏪 [ShoppingListService] Platform ${index + 1}: ${parsedPlatform.name} (${parsedPlatform.region}) - Active: ${parsedPlatform.isActive}`);
          return parsedPlatform;
        });
        
        console.log('✅ [ShoppingListService] Successfully retrieved grocery platforms');
        return parsedPlatforms;
      } else {
        console.log('ℹ️ [ShoppingListService] No grocery platforms found in AsyncStorage');
        return [];
      }
    } catch (error) {
      console.error('❌ [ShoppingListService] Failed to get grocery platforms:', error);
      console.error('❌ [ShoppingListService] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        storageKey: GROCERY_PLATFORMS_KEY
      });
      return [];
    }
  }

  /**
   * Get grocery platform by type
   */
  static async getGroceryPlatform(platformType: SupportedPlatform): Promise<GroceryPlatform | null> {
    console.log(`🔍 [ShoppingListService] Looking for grocery platform: ${platformType}`);
    
    const platforms = await this.getGroceryPlatforms();
    const searchTerm = platformType.replace('_', ' ');
    const foundPlatform = platforms.find(p => p.name.toLowerCase().includes(searchTerm));
    
    if (foundPlatform) {
      console.log(`✅ [ShoppingListService] Found platform: ${foundPlatform.name} (${foundPlatform.region})`);
    } else {
      console.log(`❌ [ShoppingListService] No platform found for type: ${platformType}`);
    }
    
    return foundPlatform || null;
  }

  /**
   * Generate Amazon Fresh cart URL with items
   */
  static generateAmazonFreshCartUrl(items: ShoppingItem[]): string {
    console.log('🛒 [ShoppingListService] Generating Amazon Fresh cart URL...');
    console.log(`   📦 Number of items: ${items.length}`);
    
    const baseUrl = 'https://www.amazon.com/gp/cart/add.html';
    const itemUrls = items.map((item, index) => {
      // For now, we'll use Amazon search URLs since we don't have direct product IDs
      const searchQuery = encodeURIComponent(item.name);
      const searchUrl = `https://www.amazon.com/s?k=${searchQuery}`;
      
      console.log(`   🔗 Item ${index + 1}: ${item.name} → ${searchUrl}`);
      return searchUrl;
    });
    
    // Return the first item's search URL for now
    // In a full implementation, you'd use Amazon's cart API
    const finalUrl = itemUrls[0] || baseUrl;
    console.log(`✅ [ShoppingListService] Generated Amazon Fresh URL: ${finalUrl}`);
    
    return finalUrl;
  }

  /**
   * Generate platform-specific cart URL
   */
  static generateCartUrl(platform: SupportedPlatform, items: ShoppingItem[]): string {
    console.log(`🛒 [ShoppingListService] Generating cart URL for platform: ${platform}`);
    console.log(`   📦 Number of items: ${items.length}`);
    
    const config = this.getPlatformConfig(platform);
    let cartUrl: string;
    
    switch (platform) {
      case 'amazon_fresh':
        cartUrl = this.generateAmazonFreshCartUrl(items);
        break;
      case 'hema':
        cartUrl = `${config.baseUrl}/cart`;
        break;
      case 'meituan':
        cartUrl = `${config.baseUrl}/cart`;
        break;
      case 'jd_home':
        cartUrl = `${config.baseUrl}/cart`;
        break;
      default:
        cartUrl = config.baseUrl;
        break;
    }
    
    console.log(`✅ [ShoppingListService] Generated cart URL for ${platform}: ${cartUrl}`);
    return cartUrl;
  }

  /**
   * Save grocery order
   */
  static async saveGroceryOrder(order: GroceryOrder): Promise<void> {
    console.log('💾 [ShoppingListService] Saving grocery order...');
    console.log(`   🆔 Order ID: ${order.id}`);
    console.log(`   🏪 Platform: ${order.platform.name}`);
    console.log(`   📦 Items: ${order.items.length}`);
    console.log(`   💰 Total cost: $${order.totalCost?.toFixed(2)}`);
    console.log(`   📅 Status: ${order.status}`);
    
    try {
      const orders = await this.getGroceryOrders();
      console.log(`📋 [ShoppingListService] Found ${orders.length} existing orders`);
      
      const updatedOrders = orders.filter(o => o.id !== order.id);
      const isNewOrder = orders.length === updatedOrders.length;
      
      if (isNewOrder) {
        console.log('➕ [ShoppingListService] Adding new grocery order');
      } else {
        console.log('🔄 [ShoppingListService] Updating existing grocery order');
      }
      
      updatedOrders.push(order);
      
      await AsyncStorage.setItem(GROCERY_ORDERS_KEY, JSON.stringify(updatedOrders));
      console.log('✅ [ShoppingListService] Grocery order saved successfully to AsyncStorage');
      console.log(`   📊 Total orders in storage: ${updatedOrders.length}`);
    } catch (error) {
      console.error('❌ [ShoppingListService] Failed to save grocery order:', error);
      console.error('❌ [ShoppingListService] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        orderId: order.id,
        platformName: order.platform.name
      });
      throw error;
    }
  }

  /**
   * Get all grocery orders
   */
  static async getGroceryOrders(): Promise<GroceryOrder[]> {
    console.log('📋 [ShoppingListService] Retrieving grocery orders from local storage...');
    
    try {
      const data = await AsyncStorage.getItem(GROCERY_ORDERS_KEY);
      
      if (data) {
        console.log('📄 [ShoppingListService] Found grocery orders data in AsyncStorage');
        const orders = JSON.parse(data);
        console.log(`📊 [ShoppingListService] Parsed ${orders.length} grocery orders from storage`);
        
        const parsedOrders = orders.map((order: any, index: number) => {
          const parsedOrder = {
            ...order,
            createdAt: new Date(order.createdAt),
            updatedAt: new Date(order.updatedAt),
            estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery) : undefined,
          };
          
          console.log(`📦 [ShoppingListService] Order ${index + 1}: ${parsedOrder.orderNumber || 'No number'} - ${parsedOrder.platform.name} - Status: ${parsedOrder.status}`);
          return parsedOrder;
        });
        
        console.log('✅ [ShoppingListService] Successfully retrieved grocery orders');
        return parsedOrders;
      } else {
        console.log('ℹ️ [ShoppingListService] No grocery orders found in AsyncStorage');
        return [];
      }
    } catch (error) {
      console.error('❌ [ShoppingListService] Failed to get grocery orders:', error);
      console.error('❌ [ShoppingListService] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        storageKey: GROCERY_ORDERS_KEY
      });
      return [];
    }
  }
} 