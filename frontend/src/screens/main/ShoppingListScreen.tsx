import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../utils/theme';
import { useShoppingList } from '../../contexts/ShoppingListContext';
import { SupportedPlatform } from '../../types';
import { ShoppingListService } from '../../services/shoppingListService';

export default function ShoppingListScreen() {
  const {
    currentShoppingList,
    loading,
    generateShoppingList,
    updateShoppingItem,
    saveShoppingList,
    linkGroceryPlatform,
    placeOrder,
    getCartUrl,
    groceryPlatforms,
  } = useShoppingList();

  const [selectedPlatform, setSelectedPlatform] = useState<SupportedPlatform | null>(null);
  const [selectAllMode, setSelectAllMode] = useState<'all' | 'none' | 'partial'>('none');

  const handleGenerateShoppingList = async () => {
    try {
      await generateShoppingList();
    } catch (error) {
      Alert.alert('Error', 'Failed to generate shopping list');
    }
  };

  const handleToggleItem = async (itemId: string, isChecked: boolean) => {
    if (!currentShoppingList) return;
    
    try {
      await updateShoppingItem(currentShoppingList.id, itemId, { isChecked: !isChecked });
    } catch (error) {
      Alert.alert('Error', 'Failed to update item');
    }
  };

  const handleLinkPlatform = async (platform: SupportedPlatform) => {
    try {
      await linkGroceryPlatform(platform);
      Alert.alert('Success', `Linked to ${platform} successfully!`);
    } catch (error) {
      Alert.alert('Error', `Failed to link to ${platform}`);
    }
  };

  const handlePlaceOrder = async (platform: SupportedPlatform) => {
    try {
      // Check if any items are selected
      const selectedItems = currentShoppingList?.items.filter(item => item.isChecked) || [];
      
      if (selectedItems.length === 0) {
        Alert.alert('No Items Selected', 'Please select items before placing an order.');
        return;
      }
      
      const order = await placeOrder(platform);
      Alert.alert(
        'Order Placed!',
        `Order ${order.orderNumber} has been placed successfully with ${selectedItems.length} items ($${selectedItemsCost.toFixed(2)}). Estimated delivery: ${order.estimatedDelivery?.toLocaleDateString()}`,
        [
          { text: 'OK', onPress: () => console.log('Order placed successfully') }
        ]
      );
    } catch (error) {
      Alert.alert('Error', `Failed to place order: ${error}`);
    }
  };

  const handleOpenCart = async (platform: SupportedPlatform) => {
    try {
      // Only include selected items in the cart
      const selectedItems = currentShoppingList?.items.filter(item => item.isChecked) || [];
      
      if (selectedItems.length === 0) {
        Alert.alert('No Items Selected', 'Please select items before opening the cart.');
        return;
      }
      
      const url = getCartUrl(platform);
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
        console.log(`🛒 [ShoppingListScreen] Opened ${platform} cart with ${selectedItems.length} selected items`);
      } else {
        Alert.alert('Error', `Cannot open ${platform} cart`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to open ${platform} cart`);
    }
  };

  const handleSelectAll = async () => {
    if (!currentShoppingList) return;
    
    try {
      const allChecked = currentShoppingList.items.every(item => item.isChecked);
      const newCheckedState = !allChecked;
      
      console.log(`🔄 [ShoppingListScreen] ${newCheckedState ? 'Selecting' : 'Deselecting'} all items...`);
      
      // Create a new shopping list with all items updated
      const updatedShoppingList = {
        ...currentShoppingList,
        items: currentShoppingList.items.map(item => ({
          ...item,
          isChecked: newCheckedState
        })),
        updatedAt: new Date()
      };
      
      // Save the entire updated list at once
      await saveShoppingList(updatedShoppingList);
      
      console.log(`✅ [ShoppingListScreen] ${newCheckedState ? 'Selected' : 'Deselected'} all items successfully`);
      console.log(`📊 [ShoppingListScreen] Updated ${updatedShoppingList.items.length} items to ${newCheckedState ? 'checked' : 'unchecked'} state`);
    } catch (error) {
      console.error('❌ [ShoppingListScreen] Failed to select all items:', error);
      Alert.alert('Error', 'Failed to select all items');
    }
  };

  // Calculate select all mode based on current state
  React.useEffect(() => {
    if (!currentShoppingList) {
      setSelectAllMode('none');
      return;
    }
    
    const checkedCount = currentShoppingList.items.filter(item => item.isChecked).length;
    const totalCount = currentShoppingList.items.length;
    
    if (checkedCount === 0) {
      setSelectAllMode('none');
    } else if (checkedCount === totalCount) {
      setSelectAllMode('all');
    } else {
      setSelectAllMode('partial');
    }
  }, [currentShoppingList]);

  // Calculate selected items cost
  const selectedItemsCost = currentShoppingList?.items
    .filter(item => item.isChecked)
    .reduce((total, item) => total + (item.estimatedPrice || 0), 0) || 0;

  const groupedItems = currentShoppingList?.items.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, typeof currentShoppingList.items>) || {};

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Generating your shopping list...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentShoppingList) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noListContainer}>
          <Text style={styles.noListTitle}>No Shopping List</Text>
          <Text style={styles.noListText}>
            Generate a shopping list from your meal plan to get started
          </Text>
          <TouchableOpacity style={styles.generateButton} onPress={handleGenerateShoppingList}>
            <Text style={styles.generateButtonText}>Generate Shopping List</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping List</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.selectAllButton} onPress={handleSelectAll}>
            <Ionicons 
              name={
                selectAllMode === 'all' ? 'checkmark-circle' : 
                selectAllMode === 'partial' ? 'remove-circle' : 'ellipse-outline'
              } 
              size={20} 
              color={theme.colors.primary} 
            />
            <Text style={styles.selectAllText}>
              {selectAllMode === 'all' ? 'Deselect All' : 'Select All'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.refreshButton} onPress={handleGenerateShoppingList}>
            <Ionicons name="refresh" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Week of {new Date(currentShoppingList.weekStartDate).toLocaleDateString()}</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{currentShoppingList.items.length}</Text>
              <Text style={styles.summaryLabel}>Total Items</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {currentShoppingList.items.filter(item => item.isChecked).length}
              </Text>
              <Text style={styles.summaryLabel}>Selected</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                ${selectedItemsCost.toFixed(2)}
              </Text>
              <Text style={styles.summaryLabel}>Selected Cost</Text>
            </View>
          </View>
          {selectAllMode !== 'none' && (
            <View style={styles.selectionStatus}>
              <Ionicons 
                name={
                  selectAllMode === 'all' ? 'checkmark-circle' : 'remove-circle'
                } 
                size={16} 
                color={selectAllMode === 'all' ? theme.colors.primary : '#FF9500'} 
              />
              <Text style={styles.selectionStatusText}>
                {selectAllMode === 'all' ? 'All items selected' : 'Some items selected'}
              </Text>
            </View>
          )}
          
          {/* Show cost comparison when not all items are selected */}
          {selectAllMode === 'partial' && currentShoppingList.totalEstimatedCost && (
            <View style={styles.costComparison}>
              <Text style={styles.costComparisonText}>
                Total: ${currentShoppingList.totalEstimatedCost.toFixed(2)} • 
                Selected: ${selectedItemsCost.toFixed(2)} • 
                Savings: ${(currentShoppingList.totalEstimatedCost - selectedItemsCost).toFixed(2)}
              </Text>
            </View>
          )}
        </View>

        {/* Shopping Items by Category */}
        {Object.entries(groupedItems).map(([category, items]) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category}</Text>
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.itemCard, item.isChecked && styles.itemCardChecked]}
                onPress={() => handleToggleItem(item.id, item.isChecked)}
              >
                <View style={styles.itemCheckbox}>
                  <Ionicons
                    name={item.isChecked ? 'checkmark-circle' : 'ellipse-outline'}
                    size={24}
                    color={item.isChecked ? theme.colors.primary : '#ccc'}
                  />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, item.isChecked && styles.itemNameChecked]}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemDetails}>
                    {item.amount} {item.unit} • ${item.estimatedPrice?.toFixed(2) || '0.00'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Grocery Platform Options */}
        <View style={styles.platformSection}>
          <View style={styles.platformHeader}>
            <Text style={styles.platformTitle}>Order from Grocery Platforms</Text>
            {currentShoppingList.items.filter(item => item.isChecked).length > 0 ? (
              <Text style={styles.platformSubtitle}>
                {currentShoppingList.items.filter(item => item.isChecked).length} items selected • ${selectedItemsCost.toFixed(2)}
              </Text>
            ) : (
              <Text style={styles.platformSubtitle}>
                Select items above to place an order
              </Text>
            )}
          </View>
          
          {/* Amazon Fresh */}
          <View style={styles.platformCard}>
            <View style={styles.platformInfo}>
              <Text style={styles.platformName}>Amazon Fresh</Text>
              <Text style={styles.platformRegion}>US</Text>
            </View>
            <View style={styles.platformActions}>
              {groceryPlatforms.some(p => p.name.includes('Amazon')) ? (
                <>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleOpenCart('amazon_fresh')}
                  >
                    <Text style={styles.actionButtonText}>Open Cart</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.primaryButton]}
                    onPress={() => handlePlaceOrder('amazon_fresh')}
                  >
                    <Text style={[styles.actionButtonText, styles.primaryButtonText]}>Place Order</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={[styles.actionButton, styles.primaryButton]}
                  onPress={() => handleLinkPlatform('amazon_fresh')}
                >
                  <Text style={[styles.actionButtonText, styles.primaryButtonText]}>Link Account</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Hema */}
          <View style={styles.platformCard}>
            <View style={styles.platformInfo}>
              <Text style={styles.platformName}>盒马鲜生</Text>
              <Text style={styles.platformRegion}>China</Text>
            </View>
            <View style={styles.platformActions}>
              {groceryPlatforms.some(p => p.name.includes('盒马')) ? (
                <>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleOpenCart('hema')}
                  >
                    <Text style={styles.actionButtonText}>Open Cart</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.primaryButton]}
                    onPress={() => handlePlaceOrder('hema')}
                  >
                    <Text style={[styles.actionButtonText, styles.primaryButtonText]}>Place Order</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={[styles.actionButton, styles.primaryButton]}
                  onPress={() => handleLinkPlatform('hema')}
                >
                  <Text style={[styles.actionButtonText, styles.primaryButtonText]}>Link Account</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Meituan */}
          <View style={styles.platformCard}>
            <View style={styles.platformInfo}>
              <Text style={styles.platformName}>美团买菜</Text>
              <Text style={styles.platformRegion}>China</Text>
            </View>
            <View style={styles.platformActions}>
              {groceryPlatforms.some(p => p.name.includes('美团')) ? (
                <>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleOpenCart('meituan')}
                  >
                    <Text style={styles.actionButtonText}>Open Cart</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.primaryButton]}
                    onPress={() => handlePlaceOrder('meituan')}
                  >
                    <Text style={[styles.actionButtonText, styles.primaryButtonText]}>Place Order</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={[styles.actionButton, styles.primaryButton]}
                  onPress={() => handleLinkPlatform('meituan')}
                >
                  <Text style={[styles.actionButtonText, styles.primaryButtonText]}>Link Account</Text>
                </TouchableOpacity>
              )}
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.primary,
    marginLeft: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
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
  },
  noListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noListTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  noListText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  generateButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: theme.borderRadius.medium,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
  },
  selectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  selectionStatusText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  costComparison: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  costComparisonText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  itemCardChecked: {
    backgroundColor: '#f8f9fa',
  },
  itemCheckbox: {
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
  },
  platformSection: {
    marginBottom: 20,
  },
  platformHeader: {
    marginBottom: 16,
  },
  platformTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  platformSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  platformCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  platformInfo: {
    flex: 1,
  },
  platformName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  platformRegion: {
    fontSize: 14,
    color: '#666',
  },
  platformActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  primaryButtonText: {
    color: 'white',
  },
});