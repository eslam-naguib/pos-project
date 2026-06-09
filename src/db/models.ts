export interface Product {
  id: string;
  barcode: string;
  barcodeType: 'standard' | 'weight-based';
  name: { ar: string; en: string; nl: string };
  categoryId: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  unit: 'piece' | 'kg' | 'gram' | 'liter';
  isWeightBased: boolean;
  weightTareGrams?: number;
  taxRate: number;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: { ar: string; en: string; nl: string };
  icon?: string;
  color: string;
  parentId?: string;
  order: number;
  isActive: boolean;
}

export interface SaleItem {
  productId: string;
  barcode: string;
  name: string;
  quantity: number;
  weightGrams?: number;
  unitPrice: number;
  taxRate: number;
  discount: number;
  total: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  items: SaleItem[];
  subtotal: number;
  taxAmount: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'mixed';
  cashGiven?: number;
  changeAmount?: number;
  cashierId: string;
  customerId?: string;
  invoiceLanguage: 'ar' | 'en' | 'nl';
  status: 'completed' | 'refunded' | 'partial-refund';
  createdAt: Date;
  syncStatus: 'synced' | 'pending';
}

export interface PurchaseItem {
  productId: string;
  quantity: number;
  costPrice: number;
  total: number;
  expiryDate?: Date;
}

export interface Purchase {
  id: string;
  purchaseNumber: string;
  supplierId: string;
  items: PurchaseItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'received' | 'partial';
  paymentStatus: 'paid' | 'pending' | 'partial';
  createdAt: Date;
  syncStatus: 'synced' | 'pending';
}

export interface Permission {
  module: string;
  actions: ('read' | 'write' | 'delete' | 'export')[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  pin: string;
  role: 'super-admin' | 'admin' | 'cashier' | 'inventory-manager';
  permissions: Permission[];
  isActive: boolean;
  createdAt: Date;
}

export interface Settings {
  storeName: { ar: string; en: string; nl: string };
  storeAddress: string;
  storeLogo?: string;
  taxNumber: string;
  currency: string;           // default: 'EUR'
  currencySymbol: string;     // default: '€'
  defaultInvoiceLanguage: 'ar' | 'en' | 'nl';
  thermalPrinterPort?: string;
  thermalPrinterBaudRate?: number;
  cashDrawerPin?: number;
  enableCustomerDisplay: boolean;
  customerDisplayPort?: string;
  receiptFooter: { ar: string; en: string; nl: string };
  taxRate: number;
  enableOfflineMode: boolean;
  autoOpenDrawerOnCash: boolean;
  weightScale?: {
    enabled: boolean;
    port?: string;
    protocol: 'serial' | 'usb';
  };
}
