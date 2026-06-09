# TODO

## High Priority
- [ ] Implement backend server synchronization in `syncService.ts` (currently mock).
- [ ] Connect Web Serial API natively for real thermal printer integration instead of console mock.
- [ ] Connect Web Serial API natively for cash drawer trigger mechanism.
- [ ] Replace `localStorage` sync mechanism with WebSockets when backend is available for more robust Customer Display.

## Medium Priority
- [ ] Implement Partial Refunds logic in `Sales.tsx` (currently only supports full refund).
- [ ] Add specific permissions matrix for `manager` vs `admin` roles in `AdminRoles.tsx`.
- [ ] Improve PDF Export resolution and styling in `Reports.tsx`.

## Low Priority
- [ ] Add bulk CSV import feature in `Products.tsx`.
- [ ] Add advanced supplier ordering workflow to `Purchases.tsx`.
