# Database Schema

The application uses **Dexie.js** as a local IndexedDB wrapper. The schema is defined in `src/db/database.ts` and models in `src/db/models.ts`.

## Collections & Indexes

```typescript
db.version(1).stores({
  users: 'id, email, role, isActive',
  products: 'id, barcode, categoryId, isActive, barcodeType',
  categories: 'id, order, isActive',
  sales: 'id, invoiceNumber, cashierId, status, createdAt, syncStatus',
  purchases: 'id, purchaseNumber, supplierId, status, createdAt, syncStatus',
  settings: 'id'
});
```

## Entity Details

### User
- `id` (string): UUID.
- `name` (string): User's full name.
- `email` (string): Unique login identifier.
- `pin` (string): Cashier login PIN.
- `role` (enum): `'admin' | 'cashier' | 'manager'`.
- `isActive` (boolean).

### Product
- `id` (string): UUID.
- `barcode` (string): EAN-13 or standard string.
- `barcodeType` (enum): `'standard' | 'weight-based'`.
- `name` (object): Localized names `{ en, ar, nl }`.
- `categoryId` (string): Foreign key to Category.
- `price` (number): Selling price in EUR.
- `costPrice` (number): Cost price in EUR.
- `stock` (number): Current inventory count.
- `minStock` (number): Threshold for low stock alert.
- `unit` (enum): `'piece' | 'kg' | 'gram' | 'liter'`.
- `isWeightBased` (boolean).
- `taxRate` (number): Percentage (e.g., 21).
- `image` (string?): Base64 encoded string.

### Category
- `id` (string): UUID.
- `name` (object): Localized names `{ en, ar, nl }`.
- `color` (string): Hex color code.
- `icon` (string?): Emoji or string.
- `order` (number): Display ordering logic.

### Sale (Transaction)
- `id` (string): UUID.
- `invoiceNumber` (string): Sequential unique ID.
- `items` (array): Array of `SaleItem` objects capturing snapshot price and quantity.
- `subtotal`, `taxAmount`, `discount`, `total` (number).
- `paymentMethod` (enum): `'cash' | 'card' | 'mixed'`.
- `cashierId` (string).
- `status` (enum): `'completed' | 'refunded' | 'void'`.
- `syncStatus` (enum): `'synced' | 'pending' | 'failed'`.

### Settings (Singleton)
- `id` (string): Hardcoded to '1'.
- `storeName`, `receiptFooter` (localized objects).
- `currency`, `currencySymbol` (hardcoded EUR).
- `defaultInvoiceLanguage` (string).
