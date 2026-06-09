# Project Overview

## Description
This is a production-ready, offline-first Point of Sale (POS) system designed for supermarkets and retail environments. Built to run independently of persistent internet connections, it relies heavily on client-side storage (IndexedDB via Dexie) and progressive web app (PWA) capabilities.

## Technology Stack
- **Framework**: React 19 (Strict Mode)
- **Language**: TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4, custom shadcn/ui components
- **State Management**: Zustand
- **Database**: Dexie.js (IndexedDB wrapper)
- **Localization**: react-i18next
- **Routing**: React Router v7
- **PWA**: vite-plugin-pwa

## Core Value Proposition
1. **Offline-First Resilience**: All sales, product additions, and stock modifications are written to local storage instantly. A background sync service pushes data when network connectivity is restored.
2. **Multi-lingual Support**: Native UI toggling between English, Dutch, and Arabic, including full RTL support.
3. **Hardware Agnostic Integration**: Connects with standard ESC/POS thermal printers and standard barcode scanners (via keyboard hook simulation).
4. **Standalone Capability**: Operates as a progressive web app natively installable on Windows, iOS, and Android.
