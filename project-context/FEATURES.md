# Features

## POS Module
- [x] Product grid display
- [x] Category filtering
- [x] Cart panel management
- [x] Dynamic subtotal/tax/total calculations
- [x] Discount calculation
- [x] Payment methods (Cash, Card, Mixed)
- [x] Hold order / Recall order workflow
- [x] Customer name capture

## Hardware & Peripheral Integration
- [x] Barcode decoding via keyboard simulation (USB scanners)
- [x] Weight-embedded barcode parsing (02XXXXXYYYYYZ format)
- [x] Custom ESC/POS receipt generation
- [x] Printer thermal integration (mock via console/alert)
- [x] Cash drawer trigger logic (mock)
- [x] Customer Display (Multi-monitor via localStorage sync)

## Inventory & Catalog Module
- [x] Product CRUD interface
- [x] Base64 Product Image Upload
- [x] Auto Barcode Generation (Standard & Weight-Based EAN-13)
- [x] Stock tracking and min-stock alerts
- [x] Category CRUD interface
- [x] Category Emoji icon picker
- [x] Category Color picker

## Sales & Reporting
- [x] Transaction history table
- [x] Refund workflow (Marks 'refunded', auto-restores stock to Dexie)
- [x] Reports dashboard with Recharts trends
- [x] PDF Export functionality for reports (`html2canvas` + `jsPDF`)

## System Settings & Platform
- [x] Role-based access control (Cashier vs Admin)
- [x] PIN-based mock login ('1234')
- [x] Dark mode toggle
- [x] Multi-lingual UI switching (English, Arabic, Dutch)
- [x] RTL layout support for Arabic
- [x] Dynamic receipt footer localization
- [x] Initial demo database seeder
- [x] PWA manifest and service worker registration
- [x] Default currency hardcoding (EUR / €)

## Pending/Future
- [ ] Backend API synchronization actual implementation
- [ ] Advanced user/employee shifts management
- [ ] Advanced partial-refund logic
