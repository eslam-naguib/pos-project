import { db } from './database';
import { v4 as uuidv4 } from 'uuid';

export const seedDatabase = async () => {
  const productsCount = await db.products.count();
  if (productsCount > 0) return; // Already seeded

  console.log('Seeding database...');

  const catId1 = uuidv4();
  const catId2 = uuidv4();

  await db.categories.bulkAdd([
    {
      id: catId1,
      name: { ar: 'فواكه', en: 'Fruits', nl: 'Fruit' },
      color: '#ef4444',
      order: 1,
      isActive: true,
    },
    {
      id: catId2,
      name: { ar: 'مخبوزات', en: 'Bakery', nl: 'Bakkerij' },
      color: '#f59e0b',
      order: 2,
      isActive: true,
    }
  ]);

  await db.products.bulkAdd([
    {
      id: uuidv4(),
      barcode: '1234567890123',
      barcodeType: 'standard',
      name: { ar: 'خبز فرنسي', en: 'Baguette', nl: 'Stokbrood' },
      categoryId: catId2,
      price: 1.50,
      costPrice: 0.50,
      stock: 50,
      minStock: 10,
      unit: 'piece',
      isWeightBased: false,
      taxRate: 9,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      barcode: '0200001000000', // Mock PLU for Apple
      barcodeType: 'weight-based',
      name: { ar: 'تفاح', en: 'Apple', nl: 'Appel' },
      categoryId: catId1,
      price: 2.99, // price per kg
      costPrice: 1.00,
      stock: 100, // in kg
      minStock: 20,
      unit: 'kg',
      isWeightBased: true,
      taxRate: 9,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]);

  await db.users.add({
    id: uuidv4(),
    name: 'Admin User',
    email: 'admin@store.com',
    pin: '1234',
    role: 'super-admin',
    permissions: [],
    isActive: true,
    createdAt: new Date(),
  });

  console.log('Database seeded!');
};
