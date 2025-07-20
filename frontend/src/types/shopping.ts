export interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  unit: string;
  category: string;
  estimatedPrice?: number;
  notes?: string;
  isChecked: boolean;
  // Platform-specific data
  amazonProductId?: string;
  amazonProductUrl?: string;
  hemaProductId?: string;
  meituanProductId?: string;
  jdProductId?: string;
}

export interface ShoppingList {
  id: string;
  weekStartDate: string;
  items: ShoppingItem[];
  totalEstimatedCost?: number;
  createdAt: Date;
  updatedAt: Date;
  platform?: GroceryPlatform;
}

export interface GroceryPlatform {
  id: string;
  name: string;
  region: string;
  isActive: boolean;
  authToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export interface GroceryOrder {
  id: string;
  shoppingListId: string;
  platform: GroceryPlatform;
  status: 'pending' | 'processing' | 'confirmed' | 'delivered' | 'cancelled';
  orderNumber?: string;
  estimatedDelivery?: Date;
  totalCost?: number;
  items: ShoppingItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Supported grocery platforms
export type SupportedPlatform = 'amazon_fresh' | 'hema' | 'meituan' | 'jd_home';

export interface PlatformConfig {
  platform: SupportedPlatform;
  name: string;
  region: string;
  baseUrl: string;
  isAvailable: boolean;
  requiresAuth: boolean;
  authUrl?: string;
  apiEndpoints?: {
    search?: string;
    addToCart?: string;
    checkout?: string;
  };
} 