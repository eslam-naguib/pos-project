# Project Master Documentation

## 1. Project Overview

**Project Name:** SmartPOS
**Project Purpose:** An enterprise-grade, offline-first Point of Sale (POS) system designed for supermarkets and retail environments. It provides seamless checkout experiences, robust inventory management, and multi-lingual capabilities without requiring a continuous internet connection.
**Business Goals:** Ensure uninterrupted retail operations, speed up checkout times through barcode scanning, support diverse user bases via localization, and unify reporting and inventory tracking.

**Main Modules:**
- Point of Sale (Checkout, Cart, Held Orders, Refunds)
- Inventory Management (Products, Categories, Barcodes)
- Sales & Analytics (Receipt printing, Sales History, Daily Reports)
- Administration (User roles, Store settings, Dark/Light modes)

**Main Capabilities:**
- Progressive Web App (PWA) allowing local installation.
- Hardware-agnostic ESC/POS receipt printing via custom local buffering.
- High-speed barcode scanning integration.
- Full Light-Mode premium UI with glassmorphism and animated popups.

**Current Implementation Status:**
Fully functional. UI was recently modernized to a premium Light Mode theme. Offline persistence via Dexie.js is complete.

---

## 2. Technology Stack

### Frontend
- **React version:** ^19.0.0
  *Purpose:* Main rendering engine.
  *Location:* `src/`
- **TypeScript:** ^5.7.2
  *Purpose:* Strict type-safety across models and components.
  *Location:* Global
- **Vite:** ^6.0.3
  *Purpose:* High-performance local development server and optimized production bundler.
  *Location:* `vite.config.ts`
- **Tailwind CSS:** ^4.0.0
  *Purpose:* Utility-first styling for rapid UI development. Used heavily for the premium aesthetic.
  *Location:* `src/index.css` & component classes.
- **Zustand:** ^5.0.2
  *Purpose:* Lightweight, global, transient state management (Cart, Auth, Popups).
  *Location:* `src/store/`
- **react-i18next:** ^15.1.3
  *Purpose:* Multi-lingual support (English, Arabic, Dutch) including RTL switching.
  *Location:* `src/locales/`
- **Dexie.js:** ^4.0.9
  *Purpose:* Offline-first local database layer wrapping IndexedDB.
  *Location:* `src/db/`
- **lucide-react:** ^0.468.0
  *Purpose:* Clean, modern iconography for the UI.
  *Location:* `src/components/ui/` & pages.

---

## 3. Full Folder Structure

```text
src/
├── components/
│   ├── layout/       (AppLayout and POSLayout with glassmorphism headers)
│   ├── pos/          (CartPanel, ProductGrid for the checkout screen)
│   └── ui/           (Reusable shadcn/ui inspired components, GlobalPopup)
├── pages/            (Main views: Products, Sales, Settings, POS, etc.)
├── store/            (Zustand stores: auth, cart, theme, popup)
├── services/         (Hardware mocks: printer, barcode, sync)
├── db/               (Dexie definitions, models, and mock seeder)
├── utils/            (Helper functions like 'cn' for Tailwind merges)
├── locales/          (i18n configurations and translation JSONs)
└── router/           (React Router configuration)
```

**Purpose:** Segregate domain logic from presentation and global state.
**Contains:** All frontend source code.
**Important files:** `main.tsx`, `index.css`, `db/database.ts`, `components/ui/GlobalPopup.tsx`.

---

## 4. Project Architecture

**Application Flow:**
1. User loads the app (PWA locally or web server).
2. React Router determines if the user is authenticated (checked via `authStore`).
3. If not, redirected to `/login`. If yes, redirected to requested route.

**Rendering Flow:**
- The root layout (`AppLayout` or `POSLayout`) wraps the `Outlet`.
- `GlobalPopup` is mounted at the layout level to intercept global toast/alert requests.
- Language changes dynamically swap `dir="rtl"` or `dir="ltr"` on the HTML document.

**State Flow:**
- Global UI states (is modal open, active cart items, current user) live in **Zustand**.
- Persistent entities (Products, Sales) live in **Dexie (IndexedDB)**.
- Components use `useLiveQuery` to reactively render Dexie data.

**Offline Flow:**
- All writes happen to Dexie.
- A background `syncService` (currently mocked) polls local data and pushes to a remote server when `navigator.onLine` is true.

**Printing & Hardware Flow:**
- Web-based ESC/POS byte buffers are generated in `printerService`.
- Barcodes are tracked via global keyboard listeners (simulated) in `barcodeService`.

---

## 5. Routing System

| Route | Page | Purpose | Dependencies |
|-------|------|---------|--------------|
| `/login` | `Login.tsx` | Authentication gateway | `authStore` |
| `/pos` | `POS.tsx` | Main sales screen | `cartStore`, `ProductGrid`, `CartPanel` |
| `/sales` | `Sales.tsx` | View & refund past sales | `db.sales`, `popupStore` |
| `/products` | `Products.tsx` | Manage inventory items | `db.products`, `barcodeService` |
| `/categories` | `Categories.tsx` | Manage product groups | `db.categories` |
| `/settings` | `Settings.tsx` | Hardware & store config | `settingsStore`, `i18n` |
| `/admin` | `AdminRoles.tsx` | User role management | `db.users` |

---

## 6. State Management

- **authStore**
  - *Purpose:* Tracks logged-in user.
  - *State variables:* `user`, `isAuthenticated`, `token`.
  - *Actions:* `login`, `logout`.
  - *Persistence:* LocalStorage.
- **cartStore**
  - *Purpose:* Active transaction logic.
  - *State variables:* `items`, `subtotal`, `total`, `heldOrders`.
  - *Actions:* `addItem`, `clearCart`, `holdOrder`, `recallOrder`.
- **popupStore**
  - *Purpose:* Modern custom alerts/toasts.
  - *State variables:* `isOpen`, `type`, `title`, `message`.
  - *Actions:* `showPopup`, `closePopup`.
- **themeStore**
  - *Purpose:* (Deprecated) Originally tracked dark mode. Project is now strictly Light Mode.

---

## 7. Database Documentation

**Tables (Dexie.js):**
- `users`: id, name, pin, role
- `categories`: id, name (multi-lang), parentId
- `products`: id, barcode, name, price, stock, categoryId
- `sales`: id, invoiceNumber, total, status, items[]
- `settings`: id, storeName, currency, receiptFooter

**Data Flow:**
Data is read via `useLiveQuery` inside pages and written explicitly inside event handlers (e.g., `handlePay` adds a record to `db.sales`).

**Seed Data:**
`db/seed.ts` injects default users (Cashier PIN 1234), sample categories (Fruits, Dairy), and a variety of mock products on first launch.

---

## 8. Component Registry

- **GlobalPopup**: (`src/components/ui/GlobalPopup.tsx`) Replaces native alerts with animated, centered cards. Relies on `popupStore`.
- **CartPanel**: (`src/components/pos/CartPanel.tsx`) Handles the right-hand checkout sidebar. Triggers `handlePay`, prints receipts, shows success popups.
- **ProductGrid**: (`src/components/pos/ProductGrid.tsx`) Displays tappable product cards. Filters by category and search queries.
- **AppLayout / POSLayout**: Wraps routing. Features custom glassmorphism headers and removes dark mode toggles to enforce the new design.

---

## 9. Services Documentation

- **printerService**:
  - *Purpose:* Interfaces with ESC/POS thermal printers.
  - *Methods:* `printReceipt(lines)`.
  - *Used by:* `CartPanel`.
- **barcodeService**:
  - *Purpose:* Generates standard EAN13 barcodes and parses scale-weighted barcodes.
  - *Methods:* `generateEAN13()`, `isWeightBasedBarcode()`.
  - *Used by:* `Products.tsx`, `CartPanel.tsx`.

---

## 10. Features Registry

- **POS (Checkout)**: Implemented. Includes cart, math totals, holding orders.
- **Inventory**: Implemented. CRUD for products/categories. Barcode generation.
- **Sales/Refunds**: Implemented. Uses custom `popupStore` confirmation to restore stock.
- **Customer Display**: Implemented. Syncs via localStorage events.
- **Printing**: Implemented (mocked payload generation).
- **Authentication**: Implemented. PIN-based login.

---

## 11. Environment Configuration

- **Vite**: Configured in `vite.config.ts`. Includes `vite-plugin-pwa` for offline caching and service worker generation.
- **Tailwind**: Configured in `src/index.css` via v4 `@theme` directives. Enforces a soft Light Mode palette (e.g., `--background: 210 40% 98%`).
- **TypeScript**: Strict mode enabled (`tsconfig.json`).

---

## 12. Development Rules

- **Naming:** CamelCase for functions/files, PascalCase for React Components.
- **Styling:** NEVER use standard `alert()` or `confirm()`. ALWAYS use `usePopupStore`.
- **Aesthetics:** Strict Light Mode. Do not introduce Dark Mode toggles. Use glassmorphism and subtle drop shadows for premium UI.
- **State:** Keep UI state in Zustand, persistent data in Dexie. Do NOT mix database logic inside layout components.

---

## 13. Known Issues

- The ESC/POS printing logic currently only dumps to console (needs WebUSB or local proxy integration for physical hardware).
- `CartPanel.tsx` and `Products.tsx` still contain minor bloat (business logic mixed with UI rendering) that requires further abstraction.

---

## 14. Future Roadmap

- Abstract all direct Dexie queries (`db.products.add`) into a dedicated Data Access Layer (DAL) / Service pattern.
- Implement real backend sync via WebSockets / REST.
- Add granular user permissions beyond simply "admin" vs "cashier".

---

## 15. Change History Summary

- **Phase 1**: Initialized project, setup Vite, Tailwind, Dexie, React Router.
- **Phase 2**: Built core POS features (Cart, Inventory, Sales, Auth, Hardware mocks).
- **Phase 3**: Codebase review and generation of `project-context` directory.
- **Phase 4**: Complete UI Overhaul. Removed Dark Mode, redesigned all components to a premium Light Mode theme with Outfit font, integrated custom `popupStore`, and removed native browser alerts. Pushed to new GitHub repository.
