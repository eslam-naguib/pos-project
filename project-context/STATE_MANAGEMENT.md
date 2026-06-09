# State Management

The application uses **Zustand** for lightweight, global, transient state management.

## 1. `authStore.ts`
- **Purpose**: Tracks the currently logged-in user.
- **State**:
  - `user`: User object or null.
  - `isAuthenticated`: Boolean derivative.
  - `token`: Session token string.
- **Actions**: `login(user, token)`, `logout()`.

## 2. `cartStore.ts`
- **Purpose**: The active transaction cart logic.
- **State**:
  - `items`: Array of `SaleItem`.
  - `subtotal`, `taxAmount`, `total`: Derived mathematical totals.
  - `customerName`: Optional string.
  - `heldOrders`: Array of saved `HeldOrder` objects.
- **Actions**:
  - `addItem(item)`, `removeItem(id)`, `updateQuantity(id, qty)`
  - `clearCart()`
  - `holdOrder()`: Moves active cart to `heldOrders` array and clears.
  - `recallOrder(id)`: Moves specific held order back to active state.
- **Persistence**: Emits `localStorage` event `cart-sync` on every mutation to broadcast to `CustomerDisplay`.

## 3. `settingsStore.ts`
- **Purpose**: Global configurations.
- **State**: `settings` (Type `Settings` representing DB model).
- **Actions**: `setSettings(settings)`.

## 4. `themeStore.ts`
- **Purpose**: Dark Mode manager.
- **State**: `theme` ('light' | 'dark').
- **Actions**: `toggleTheme()`, `setTheme(theme)`.
- **Persistence**: Writes directly to `localStorage.getItem('theme')` and updates `document.documentElement.classList.add('dark')`.

## 5. `offlineStore.ts` (Skeleton)
- **Purpose**: Manages network sync queues.
- **State**: `isOnline`, `pendingSyncCount`, `lastSyncTime`.
- **Actions**: `setOnlineStatus`, `incrementPending`, `clearPending`.
