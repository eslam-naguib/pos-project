import Dexie, { Table } from 'dexie';
import type { Product, Category, Sale, Purchase, User, Settings } from './models';

/**
 * POSDatabase acts as the primary local data store using IndexedDB via Dexie.js.
 * It is structured to support offline-first operations for a Point of Sale environment.
 */
export class POSDatabase extends Dexie {
  /** Table containing all sellable products and their current stock levels */
  products!: Table<Product, string>;
  /** Table containing product categories for UI filtering */
  categories!: Table<Category, string>;
  /** Table containing historical sales and active transactions */
  sales!: Table<Sale, string>;
  /** Table containing incoming inventory purchase orders */
  purchases!: Table<Purchase, string>;
  /** Table containing system users (Admins, Cashiers) and their PINs */
  users!: Table<User, string>;
  /** Table containing a single row of global store settings */
  settings!: Table<Settings, number>;

  constructor() {
    super('POSDatabase');
    
    // Define schema version 1. 
    // The keys listed here are the indexed fields, not the full object schema.
    // The first string before the comma is the Primary Key.
    this.version(1).stores({
      products: 'id, barcode, categoryId, isActive, isWeightBased',
      categories: 'id, order, isActive',
      sales: 'id, invoiceNumber, cashierId, status, syncStatus, createdAt',
      purchases: 'id, purchaseNumber, supplierId, status, syncStatus, createdAt',
      users: 'id, email, pin, role, isActive',
      settings: '++id' // ++id indicates an auto-incrementing primary key for the single row
    });
  }
}

/** Global singleton instance of the local database */
export const db = new POSDatabase();
