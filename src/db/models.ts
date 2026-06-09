/**
 * Represents a sellable item in the POS system.
 */
export interface Product {
  /** Unique UUID v4 for the product */
  id: string;
  /** Primary barcode for scanning */
  barcode: string;
  /** Identifies if the barcode is a standard EAN13 or a scale-weighted barcode */
  barcodeType: 'standard' | 'weight-based';
  /** Multi-lingual product name */
  name: { ar: string; en: string; nl: string };
  /** UUID of the associated category */
  categoryId: string;
  /** Selling price to the customer */
  price: number;
  /** Original purchase cost for profit calculation */
  costPrice: number;
  /** Current inventory quantity */
  stock: number;
  /** Threshold for low-stock alerts */
  minStock: number;
  /** Unit of measurement */
  unit: 'piece' | 'kg' | 'gram' | 'liter';
  /** Whether the product must be weighed at checkout */
  isWeightBased: boolean;
  /** Optional tare weight to subtract from scale reading */
  weightTareGrams?: number;
  /** Tax percentage to apply (e.g., 21 for 21%) */
  taxRate: number;
  /** Base64 encoded image string */
  image?: string;
  /** Whether the product is available for sale */
  isActive: boolean;
  /** Timestamp of creation */
  createdAt: Date;
  /** Timestamp of last modification */
  updatedAt: Date;
}

/**
 * Represents a product category.
 */
export interface Category {
  /** Unique UUID v4 for the category */
  id: string;
  /** Multi-lingual category name */
  name: { ar: string; en: string; nl: string };
  /** Optional icon identifier (e.g., Lucide icon name) */
  icon?: string;
  /** Hex color code for UI representation */
  color: string;
  /** Optional parent category UUID for nesting */
  parentId?: string;
  /** Sorting order in the UI */
  order: number;
  /** Whether the category is active and visible */
  isActive: boolean;
}

/**
 * Represents a single line item within a Sale transaction.
 */
export interface SaleItem {
  /** UUID of the purchased product */
  productId: string;
  /** Scanned barcode */
  barcode: string;
  /** Snapshot of the product name at time of sale */
  name: string;
  /** Number of units sold */
  quantity: number;
  /** Optional weight measured by scale */
  weightGrams?: number;
  /** Selling price per unit at time of sale */
  unitPrice: number;
  /** Applied tax rate */
  taxRate: number;
  /** Applied discount value */
  discount: number;
  /** Final total line price (quantity * unitPrice - discount) */
  total: number;
}

/**
 * Represents a completed or refunded sales transaction.
 */
export interface Sale {
  /** Unique UUID v4 for the sale */
  id: string;
  /** Human-readable sequential invoice number */
  invoiceNumber: string;
  /** Array of purchased items */
  items: SaleItem[];
  /** Total before tax */
  subtotal: number;
  /** Total tax amount applied */
  taxAmount: number;
  /** Total global discount applied */
  discount: number;
  /** Final amount paid by customer */
  total: number;
  /** Method of payment */
  paymentMethod: 'cash' | 'card' | 'mixed';
  /** Cash tendered by the customer */
  cashGiven?: number;
  /** Change returned to the customer */
  changeAmount?: number;
  /** UUID of the cashier who processed the sale */
  cashierId: string;
  /** Optional UUID of the linked customer */
  customerId?: string;
  /** Language used to print the receipt */
  invoiceLanguage: 'ar' | 'en' | 'nl';
  /** Current status of the transaction */
  status: 'completed' | 'refunded' | 'partial-refund';
  /** Timestamp of the transaction */
  createdAt: Date;
  /** Background sync status to remote server */
  syncStatus: 'synced' | 'pending';
}

/**
 * Represents an item in a supplier purchase order.
 */
export interface PurchaseItem {
  /** UUID of the received product */
  productId: string;
  /** Number of units received */
  quantity: number;
  /** Cost price per unit */
  costPrice: number;
  /** Total line cost */
  total: number;
  /** Optional expiry date for perishable goods */
  expiryDate?: Date;
}

/**
 * Represents a supplier purchase order to restock inventory.
 */
export interface Purchase {
  /** Unique UUID v4 for the purchase order */
  id: string;
  /** Human-readable purchase order number */
  purchaseNumber: string;
  /** UUID of the supplier */
  supplierId: string;
  /** Array of received items */
  items: PurchaseItem[];
  /** Total cost before tax */
  subtotal: number;
  /** Total tax applied */
  taxAmount: number;
  /** Final total cost */
  total: number;
  /** Receiving status */
  status: 'draft' | 'received' | 'partial';
  /** Financial payment status to supplier */
  paymentStatus: 'paid' | 'pending' | 'partial';
  /** Timestamp of creation */
  createdAt: Date;
  /** Background sync status */
  syncStatus: 'synced' | 'pending';
}

/**
 * Represents granular module access rights.
 */
export interface Permission {
  /** Target system module (e.g., 'sales', 'inventory') */
  module: string;
  /** Allowed actions within the module */
  actions: ('read' | 'write' | 'delete' | 'export')[];
}

/**
 * Represents a system user (Cashier, Admin, etc.)
 */
export interface User {
  /** Unique UUID v4 for the user */
  id: string;
  /** Full display name */
  name: string;
  /** Email address for login/contact */
  email: string;
  /** 4-digit PIN for quick POS switching */
  pin: string;
  /** Base role defining global access level */
  role: 'super-admin' | 'admin' | 'cashier' | 'inventory-manager';
  /** Custom granular permissions overriding role defaults */
  permissions: Permission[];
  /** Whether the user can log in */
  isActive: boolean;
  /** Timestamp of creation */
  createdAt: Date;
}

/**
 * Represents global store configuration.
 */
export interface Settings {
  /** Multi-lingual store name printed on receipts */
  storeName: { ar: string; en: string; nl: string };
  /** Physical store address */
  storeAddress: string;
  /** Base64 encoded logo string */
  storeLogo?: string;
  /** Business tax/VAT registration number */
  taxNumber: string;
  /** 3-letter currency code (e.g., 'EUR') */
  currency: string;
  /** Display symbol (e.g., '€') */
  currencySymbol: string;
  /** Default language for receipt printing */
  defaultInvoiceLanguage: 'ar' | 'en' | 'nl';
  /** Hardware COM port for receipt printer */
  thermalPrinterPort?: string;
  /** Baud rate for serial thermal printer connection */
  thermalPrinterBaudRate?: number;
  /** Physical hardware pin trigger for cash drawer */
  cashDrawerPin?: number;
  /** Whether to broadcast state to customer-facing display */
  enableCustomerDisplay: boolean;
  /** COM port for secondary character display */
  customerDisplayPort?: string;
  /** Multi-lingual text appended to bottom of receipts */
  receiptFooter: { ar: string; en: string; nl: string };
  /** Default tax rate applied to new products */
  taxRate: number;
  /** Whether the system is allowed to operate without network */
  enableOfflineMode: boolean;
  /** Automatically trigger cash drawer open signal when payment method is cash */
  autoOpenDrawerOnCash: boolean;
  /** Scale integration configuration */
  weightScale?: {
    enabled: boolean;
    port?: string;
    protocol: 'serial' | 'usb';
  };
}
