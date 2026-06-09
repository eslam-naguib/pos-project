# Architectural Decisions

## 1. Local-First IndexedDB (Dexie) over Backend API
**Context:** POS systems in retail environments frequently lose internet connectivity.
**Decision:** We chose to build the entire schema directly in IndexedDB via Dexie.js. The app is 100% functional offline from the moment the PWA loads. A background `syncService` will theoretically push the delta to the cloud once network connectivity is verified.

## 2. Zustand over Redux/Context
**Context:** Needed state management that avoids unnecessary re-renders in the highly reactive POS Cart.
**Decision:** Zustand was selected for its minimal boilerplate and transient selector abilities. We split stores by domain (`cartStore`, `authStore`) instead of one monolithic store.

## 3. Custom ESC/POS Buffer Construction
**Context:** Node.js printer packages (`escpos-encoder`) failed to resolve via typical Vite/Browser environments without intense polyfilling.
**Decision:** We built our own `printerService.ts` that manually pushes Hex bytes (e.g., `0x1B, 0x40` for Init) into a Uint8Array, making it universally compatible with Web Serial API without heavy dependencies.

## 4. `localStorage` for Customer Display
**Context:** Needed a way for the cashier screen to update the secondary customer monitor instantly.
**Decision:** Rather than setting up complex WebRTC or local WebSocket servers, we used the browser's native `StorageEvent`. Emitting JSON to `localStorage.setItem('cart-sync', ...)` instantly fires an event in the Customer Display tab with zero latency.
