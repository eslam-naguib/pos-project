import Dexie, { Table } from 'dexie';
import type { Product, Category, Sale, Purchase, User, Settings } from './models';

export class POSDatabase extends Dexie {
  products!: Table<Product, string>;
  categories!: Table<Category, string>;
  sales!: Table<Sale, string>;
  purchases!: Table<Purchase, string>;
  users!: Table<User, string>;
  settings!: Table<Settings, number>; // Single row settings

  constructor() {
    super('POSDatabase');
    this.version(1).stores({
      products: 'id, barcode, categoryId, isActive, isWeightBased',
      categories: 'id, order, isActive',
      sales: 'id, invoiceNumber, cashierId, status, syncStatus, createdAt',
      purchases: 'id, purchaseNumber, supplierId, status, syncStatus, createdAt',
      users: 'id, email, pin, role, isActive',
      settings: '++id' // Dummy auto-increment ID for the single row
    });
  }
}

export const db = new POSDatabase();
