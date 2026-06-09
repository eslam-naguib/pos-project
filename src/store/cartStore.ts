import { create } from 'zustand';
import type { SaleItem } from '../db/models';

interface HeldOrder {
  id: string;
  customerName: string;
  items: SaleItem[];
  timestamp: number;
}

interface CartState {
  items: SaleItem[];
  customerName: string;
  heldOrders: HeldOrder[];
  setCustomerName: (name: string) => void;
  addItem: (item: SaleItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  holdOrder: () => void;
  recallOrder: (id: string) => void;
  subtotal: number;
  taxAmount: number;
  total: number;
}

const calculateTotals = (items: SaleItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const taxAmount = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity * (item.taxRate / 100)), 0);
  const total = subtotal + taxAmount;
  return { subtotal, taxAmount, total };
};

const syncToDisplay = (items: SaleItem[], total: number) => {
  localStorage.setItem('cart-sync', JSON.stringify({ items, total, timestamp: Date.now() }));
};

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
