# Changelog

All notable changes to this project will be documented in this file.

## Initial System Build

List of all initially implemented features from the baseline build:

- Set up React 19 + TypeScript + Vite + Tailwind CSS v4.
- Initialized Dexie IndexedDB models for Products, Categories, Sales, Purchases, Users.
- Created robust Zustand stores (Auth, Cart, Theme, Settings).
- Built POS interface with Product Grid, Cart Panel, Tax/Discount math.
- Added multi-tab Customer Display using `localStorage` syncing.
- Integrated Barcode decoding logic (Standard and Weight-embedded EAN-13).
- Built custom `printerService.ts` for raw ESC/POS byte manipulation.
- Implemented Dark Mode with global toggles.
- Added Category Icon (emoji) and Color selection in `Categories.tsx`.
- Enabled Base64 image upload for products in `Products.tsx`.
- Implemented Hold / Recall order workflow in `CartPanel.tsx`.
- Added dynamic Receipt footer loading based on `i18next` language.
- Implemented Refund workflow in `Sales.tsx` that natively restores stock.
- Created dynamic Recharts dashboards and PDF Export via `jsPDF`.
- Registered application as a Progressive Web App (PWA).
