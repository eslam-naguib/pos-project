# Component Map

## Layouts
- **`AppLayout.tsx`**
  - **Purpose**: Top-level layout for the dashboard. Renders Sidebar, Header, Dark Mode Toggle. Handles route protection for non-cashier roles.
  - **Dependencies**: `react-router`, `authStore`, `themeStore`, `react-i18next`.

- **`POSLayout.tsx`**
  - **Purpose**: Fullscreen layout specifically for the POS screen to maximize usable real estate.
  - **Dependencies**: `react-router`, `authStore`, `themeStore`.

## Pages
- **`POS.tsx`**
  - **Purpose**: The main sales terminal. Captures barcode scanner inputs (keyboard hook), parses weight-barcodes, adds items to `CartPanel`.
  - **Children**: `ProductGrid`, `CartPanel`.

- **`CustomerDisplay.tsx`**
  - **Purpose**: Secondary monitor view. Listens to `StorageEvent` for `cart-sync` and `cart-status` to display the active cart or "Bedankt!" upon payment.

- **`Sales.tsx`**
  - **Purpose**: History of transactions.
  - **Features**: Includes a Refund flow that updates Dexie and restores product stock.

- **`Products.tsx`**
  - **Purpose**: Catalog management.
  - **Features**: Modal for Base64 Image Upload, Barcode Generation, Barcode Printing mock.

- **`Categories.tsx`**
  - **Purpose**: Category grouping logic.
  - **Features**: Modal for Name, Emoji Icon, and Color picking.

- **`Reports.tsx`**
  - **Purpose**: Analytics dashboard.
  - **Dependencies**: `recharts` for charting, `html2canvas` & `jspdf` for PDF Export.

## POS UI Components
- **`CartPanel.tsx`**
  - **Purpose**: Displays the active `cartStore` items. Contains totals, "Hold/Recall Order", "Customer Name", and the final "Pay" action which writes to DB and triggers the printer.
- **`ProductGrid.tsx`**
  - **Purpose**: Visual grid of products. Fetches directly from Dexie.

## Generic UI Components (`src/components/ui/`)
- **`button.tsx`**: Standardized button styles.
- **`input.tsx`**: Standardized text input styles.
- **`card.tsx`**: Dashboard widgets structural wrapper.
- **`table.tsx`**: Data table structural wrapper.
