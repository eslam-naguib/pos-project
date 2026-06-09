# Known Issues

1. **Hardware Mocks**: Printer and Cash Drawer services are technically written correctly for raw byte outputs, but without a connected COM/USB port and the Web Serial API enabled in the browser flags, they only output `alert()` and `console.log()` mocks.
2. **Customer Display Synchronization**: The Customer Display relies on `localStorage` events. If the user opens the POS and Customer Display in two completely different browsers (e.g. Chrome and Firefox), the `StorageEvent` will not fire. They must be tabs/windows within the same browser session.
3. **Image Storage Limit**: Product images are stored as Base64 strings directly inside Dexie IndexedDB. If the user uploads thousands of high-resolution images, this may hit browser storage quotas or degrade initial load performance.
4. **Refunds**: The refund flow is an all-or-nothing action. You cannot currently refund a single item out of a multi-item cart.
