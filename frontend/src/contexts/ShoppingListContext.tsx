import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShoppingList, ShoppingItem, GroceryPlatform, GroceryOrder, SupportedPlatform } from '../types';
import { ShoppingListService } from '../services/shoppingListService';
import { useMealPlan } from './MealPlanContext';

interface ShoppingListContextType {
  currentShoppingList: ShoppingList | null;
  shoppingLists: ShoppingList[];
  groceryPlatforms: GroceryPlatform[];
  groceryOrders: GroceryOrder[];
  loading: boolean;
  generateShoppingList: () => Promise<void>;
  saveShoppingList: (list: ShoppingList) => Promise<void>;
  deleteShoppingList: (id: string) => Promise<void>;
  updateShoppingItem: (listId: string, itemId: string, updates: Partial<ShoppingItem>) => Promise<void>;
  linkGroceryPlatform: (platform: SupportedPlatform) => Promise<void>;
  unlinkGroceryPlatform: (platformId: string) => Promise<void>;
  placeOrder: (platform: SupportedPlatform) => Promise<GroceryOrder>;
  getCartUrl: (platform: SupportedPlatform) => string;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export const useShoppingList = () => {
  const context = useContext(ShoppingListContext);
  if (context === undefined) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
};

interface ShoppingListProviderProps {
  children: React.ReactNode;
}

export const ShoppingListProvider: React.FC<ShoppingListProviderProps> = ({ children }) => {
  const { currentMealPlan } = useMealPlan();
  const [currentShoppingList, setCurrentShoppingList] = useState<ShoppingList | null>(null);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [groceryPlatforms, setGroceryPlatforms] = useState<GroceryPlatform[]>([]);
  const [groceryOrders, setGroceryOrders] = useState<GroceryOrder[]>([]);
  const [loading, setLoading] = useState(false);

  // Load shopping lists on mount
  useEffect(() => {
    loadShoppingLists();
    loadGroceryPlatforms();
    loadGroceryOrders();
  }, []);

  // Load shopping lists from storage
  const loadShoppingLists = async () => {
    try {
      const lists = await ShoppingListService.getShoppingLists();
      setShoppingLists(lists);
      
      // Set current shopping list to the most recent one
      if (lists.length > 0) {
        const mostRecent = lists.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        setCurrentShoppingList(mostRecent);
      }
    } catch (error) {
      console.error('Failed to load shopping lists:', error);
    }
  };

  // Load grocery platforms from storage
  const loadGroceryPlatforms = async () => {
    try {
      const platforms = await ShoppingListService.getGroceryPlatforms();
      setGroceryPlatforms(platforms);
    } catch (error) {
      console.error('Failed to load grocery platforms:', error);
    }
  };

  // Load grocery orders from storage
  const loadGroceryOrders = async () => {
    try {
      const orders = await ShoppingListService.getGroceryOrders();
      setGroceryOrders(orders);
    } catch (error) {
      console.error('Failed to load grocery orders:', error);
    }
  };

  // Generate shopping list from current meal plan
  const generateShoppingList = async () => {
    if (!currentMealPlan) {
      console.error('No meal plan available for shopping list generation');
      return;
    }

    setLoading(true);
    try {
      const shoppingList = ShoppingListService.generateFromMealPlan(currentMealPlan);
      await ShoppingListService.saveShoppingList(shoppingList);
      
      setCurrentShoppingList(shoppingList);
      await loadShoppingLists(); // Refresh the lists
      
      console.log('Shopping list generated successfully');
    } catch (error) {
      console.error('Failed to generate shopping list:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save shopping list
  const saveShoppingList = async (list: ShoppingList) => {
    try {
      await ShoppingListService.saveShoppingList(list);
      await loadShoppingLists(); // Refresh the lists
    } catch (error) {
      console.error('Failed to save shopping list:', error);
      throw error;
    }
  };

  // Delete shopping list
  const deleteShoppingList = async (id: string) => {
    try {
      await ShoppingListService.deleteShoppingList(id);
      await loadShoppingLists(); // Refresh the lists
      
      // If we deleted the current shopping list, clear it
      if (currentShoppingList?.id === id) {
        setCurrentShoppingList(null);
      }
    } catch (error) {
      console.error('Failed to delete shopping list:', error);
      throw error;
    }
  };

  // Update shopping list item
  const updateShoppingItem = async (listId: string, itemId: string, updates: Partial<ShoppingItem>) => {
    try {
      await ShoppingListService.updateShoppingListItem(listId, itemId, updates);
      await loadShoppingLists(); // Refresh the lists
    } catch (error) {
      console.error('Failed to update shopping item:', error);
      throw error;
    }
  };

  // Link grocery platform (placeholder for future implementation)
  const linkGroceryPlatform = async (platform: SupportedPlatform) => {
    try {
      // For now, we'll create a mock platform account
      // In the future, this would handle OAuth flow
      const platformAccount: GroceryPlatform = {
        id: `platform_${Date.now()}`,
        name: ShoppingListService.getPlatformConfig(platform).name,
        region: ShoppingListService.getPlatformConfig(platform).region,
        isActive: true,
        authToken: 'mock_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      };

      await ShoppingListService.saveGroceryPlatform(platformAccount);
      await loadGroceryPlatforms(); // Refresh the platforms
      
      console.log(`Linked to ${platformAccount.name} successfully`);
    } catch (error) {
      console.error('Failed to link grocery platform:', error);
      throw error;
    }
  };

  // Unlink grocery platform
  const unlinkGroceryPlatform = async (platformId: string) => {
    try {
      const updatedPlatforms = groceryPlatforms.filter(p => p.id !== platformId);
      // Clear the platforms and save empty array
      await ShoppingListService.saveGroceryPlatform({
        id: 'temp',
        name: 'temp',
        region: 'temp',
        isActive: false,
      });
      
      // Then save the filtered platforms
      for (const platform of updatedPlatforms) {
        await ShoppingListService.saveGroceryPlatform(platform);
      }
      
      await loadGroceryPlatforms(); // Refresh the platforms
    } catch (error) {
      console.error('Failed to unlink grocery platform:', error);
      throw error;
    }
  };

  // Place order (placeholder for future implementation)
  const placeOrder = async (platform: SupportedPlatform): Promise<GroceryOrder> => {
    if (!currentShoppingList) {
      throw new Error('No shopping list available for ordering');
    }

    try {
      const platformAccount = await ShoppingListService.getGroceryPlatform(platform);
      if (!platformAccount) {
        throw new Error(`No ${platform} account linked`);
      }

      // Only include selected items in the order
      const selectedItems = currentShoppingList.items.filter(item => item.isChecked);
      const selectedItemsCost = selectedItems.reduce((total, item) => total + (item.estimatedPrice || 0), 0);

      if (selectedItems.length === 0) {
        throw new Error('No items selected for ordering');
      }

      // Create a mock order with only selected items
      const order: GroceryOrder = {
        id: `order_${Date.now()}`,
        shoppingListId: currentShoppingList.id,
        platform: platformAccount,
        status: 'pending',
        orderNumber: `ORD-${Date.now()}`,
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        totalCost: selectedItemsCost,
        items: selectedItems,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await ShoppingListService.saveGroceryOrder(order);
      await loadGroceryOrders(); // Refresh the orders
      
      console.log(`Order placed successfully: ${order.orderNumber} with ${selectedItems.length} items ($${selectedItemsCost.toFixed(2)})`);
      return order;
    } catch (error) {
      console.error('Failed to place order:', error);
      throw error;
    }
  };

  // Get cart URL for platform
  const getCartUrl = (platform: SupportedPlatform): string => {
    if (!currentShoppingList) {
      return ShoppingListService.getPlatformConfig(platform).baseUrl;
    }
    // Only include selected items in the cart URL
    const selectedItems = currentShoppingList.items.filter(item => item.isChecked);
    return ShoppingListService.generateCartUrl(platform, selectedItems);
  };

  const value: ShoppingListContextType = {
    currentShoppingList,
    shoppingLists,
    groceryPlatforms,
    groceryOrders,
    loading,
    generateShoppingList,
    saveShoppingList,
    deleteShoppingList,
    updateShoppingItem,
    linkGroceryPlatform,
    unlinkGroceryPlatform,
    placeOrder,
    getCartUrl,
  };

  return (
    <ShoppingListContext.Provider value={value}>
      {children}
    </ShoppingListContext.Provider>
  );
}; 