import { create } from 'zustand';
import type { SaleItem } from '../db/models';

/**
 * Represents a suspended checkout session.
 */
export interface HeldOrder {
  id: string;
  customerName: string;
  items: SaleItem[];
  timestamp: number;
}

/**
 * Interface defining the Cart state and logic for active POS transactions.
 */
interface CartState {
  /** Items currently scanned/added to the cart */
  items: SaleItem[];
  /** Optional customer name associated with the current transaction */
  customerName: string;
  /** Array of orders that were put on hold */
  heldOrders: HeldOrder[];
  /** Calculated subtotal before tax */
  subtotal: number;
  /** Calculated tax amount */
  taxAmount: number;
  /** Final calculated total */
  total: number;
  
  /** Updates the active customer name */
  setCustomerName: (name: string) => void;
  /** Adds a new item or increments an existing one */
  addItem: (item: SaleItem) => void;
  /** Removes an item completely from the cart */
  removeItem: (productId: string) => void;
  /** Overrides the quantity of an existing item */
  updateQuantity: (productId: string, quantity: number) => void;
  /** Clears the cart back to an empty state */
  clearCart: () => void;
  /** Suspends the current cart and moves it into the heldOrders queue */
  holdOrder: () => void;
  /** Restores a held order back into the active cart */
  recallOrder: (id: string) => void;
}

/** Helper to recalculate cart financials */
const calculateTotals = (items: SaleItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const taxAmount = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity * (item.taxRate / 100)), 0);
  const total = subtotal + taxAmount;
  return { subtotal, taxAmount, total };
};

/** Helper to broadcast cart updates to an external Customer Display */
const syncToDisplay = (items: SaleItem[], total: number) => {
  localStorage.setItem('cart-sync', JSON.stringify({ items, total, timestamp: Date.now() }));
};

/**
 * Zustand store for managing the POS checkout cart.
 */
export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  customerName: '',
  heldOrders: [],
  subtotal: 0,
  taxAmount: 0,
  total: 0,
  
  setCustomerName: (name) => set({ customerName: name }),
  
  addItem: (newItem) => {
    const { items } = get();
    const existingItemIndex = items.findIndex(item => item.productId === newItem.productId);
    
    let newItems = [...items];
    if (existingItemIndex >= 0) {
      newItems[existingItemIndex].quantity += newItem.quantity;
      newItems[existingItemIndex].total = newItems[existingItemIndex].quantity * newItems[existingItemIndex].unitPrice;
    } else {
      newItems.push({ ...newItem, total: newItem.quantity * newItem.unitPrice });
    }
    
    const totals = calculateTotals(newItems);
    syncToDisplay(newItems, totals.total);
    set({ items: newItems, ...totals });
  },
  
  removeItem: (productId) => {
    const newItems = get().items.filter(item => item.productId !== productId);
    const totals = calculateTotals(newItems);
    syncToDisplay(newItems, totals.total);
    set({ items: newItems, ...totals });
  },
  
  updateQuantity: (productId, quantity) => {
    const newItems = get().items.map(item => {
      if (item.productId === productId) {
        return { ...item, quantity, total: quantity * item.unitPrice };
      }
      return item;
    });
    const totals = calculateTotals(newItems);
    syncToDisplay(newItems, totals.total);
    set({ items: newItems, ...totals });
  },
  
  clearCart: () => {
    syncToDisplay([], 0);
    set({ items: [], subtotal: 0, taxAmount: 0, total: 0, customerName: '' });
  },
  
  holdOrder: () => {
    const { items, customerName, heldOrders } = get();
    if (items.length === 0) return;
    
    const newHeldOrder: HeldOrder = {
      id: Date.now().toString(),
      customerName: customerName || `Order #${heldOrders.length + 1}`,
      items: [...items],
      timestamp: Date.now()
    };
    
    set({ heldOrders: [...heldOrders, newHeldOrder] });
    get().clearCart();
  },
  
  recallOrder: (id) => {
    const { heldOrders } = get();
    const orderToRecall = heldOrders.find(o => o.id === id);
    if (!orderToRecall) return;
    
    const newHeldOrders = heldOrders.filter(o => o.id !== id);
    const totals = calculateTotals(orderToRecall.items);
    syncToDisplay(orderToRecall.items, totals.total);
    
    set({ 
      items: orderToRecall.items, 
      customerName: orderToRecall.customerName,
      heldOrders: newHeldOrders,
      ...totals 
    });
  }
}));
