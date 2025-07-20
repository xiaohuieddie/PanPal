import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';
import { ShoppingList } from '../types';

interface ShoppingListPreviewProps {
  shoppingList: ShoppingList;
  onViewFullList: () => void;
  maxItems?: number;
}

export default function ShoppingListPreview({ 
  shoppingList, 
  onViewFullList, 
  maxItems = 5 
}: ShoppingListPreviewProps) {
  const previewItems = shoppingList.items.slice(0, maxItems);
  const remainingItems = shoppingList.items.length - maxItems;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping List Preview</Text>
        <TouchableOpacity onPress={onViewFullList} style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.itemsContainer}
        contentContainerStyle={styles.itemsContent}
      >
        {previewItems.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.itemIcon}>
              <Ionicons 
                name={item.isChecked ? 'checkmark-circle' : 'ellipse-outline'} 
                size={16} 
                color={item.isChecked ? theme.colors.primary : '#ccc'} 
              />
            </View>
            <Text style={[styles.itemName, item.isChecked && styles.itemNameChecked]}>
              {item.name}
            </Text>
            <Text style={styles.itemAmount}>
              {item.amount} {item.unit}
            </Text>
          </View>
        ))}
        
        {remainingItems > 0 && (
          <View style={styles.moreItemsCard}>
            <Text style={styles.moreItemsText}>+{remainingItems} more</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.totalText}>
          Total: ${shoppingList.totalEstimatedCost?.toFixed(2) || '0.00'}
        </Text>
        <TouchableOpacity style={styles.orderButton} onPress={onViewFullList}>
          <Text style={styles.orderButtonText}>Order Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  itemsContainer: {
    maxHeight: 80,
  },
  itemsContent: {
    paddingRight: 16,
  },
  itemCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  itemIcon: {
    marginBottom: 4,
  },
  itemName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginBottom: 2,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  itemAmount: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  moreItemsCard: {
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreItemsText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  orderButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  orderButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
}); 