# Closer to Market

## Current State
- Shop owner dashboard has a Switch toggle for shop availability (`toggleShopAvailability`)
- Backend `toggleShopAvailability` updates `shopAvailability` map but does NOT update `shop.isActive` field
- `getActiveShops` and `getActiveShopsByCategory` filter by `shop.isActive` (always true) — not `isAvailable`
- ShopBrowser filters by `isAvailable` on client side, so toggle does work for browsing
- Backend has `uploadPaymentProof` and Order type has `paymentProof`, `paymentStatus`, `paymentNote` fields
- AdminPanel orders tab shows order details but NOT payment proof, payment status, or payment note
- CustomerDashboard has only a tiny hint for `paymentStatus === "confirmed"` — no upload UI
- ShopBrowser shop detail modal does NOT show shop payment numbers (`paymentNumbers` field)
- Backend has `updateOrderStatus` but no dedicated confirm/reject payment function

## Requested Changes (Diff)

### Add
- Backend: `confirmPayment(orderId)` function — admin only, sets `paymentStatus = "confirmed"`
- Backend: `rejectPayment(orderId)` function — admin only, sets `paymentStatus = "rejected"`
- Frontend ShopBrowser: show shop `paymentNumbers` prominently in shop detail modal (green 💳 box)
- Frontend CustomerDashboard: after placing order, show payment number of shop + button to upload payment proof (image + note)
- Frontend AdminPanel orders tab: show `paymentStatus`, `paymentNote`, `paymentProof` image; add Confirm/Reject payment buttons

### Modify
- Backend: `toggleShopAvailability` — also update `shop.isActive` to keep both fields in sync
- Backend: add `confirmPayment` and `rejectPayment` to IDL declarations
- Frontend ShopOwnerDashboard: ensure toggle visually shows active/inactive state clearly

### Remove
- Nothing

## Implementation Plan
1. Update `toggleShopAvailability` in `main.mo` to also flip `shop.isActive`
2. Add `confirmPayment` and `rejectPayment` functions in `main.mo` (admin-only, update `paymentStatus`)
3. Add `confirmPayment` and `rejectPayment` to `backend.d.ts` interface
4. Update `useQueries.ts` with `useConfirmPayment` and `useRejectPayment` hooks
5. Update `ShopBrowser.tsx`: in shop detail modal, display `paymentNumbers` as green 💳 box
6. Update `CustomerDashboard.tsx`: show shop payment number + upload proof button per order
7. Update `AdminPanel.tsx`: in orders tab, show payment status badge, payment note, proof image thumbnail, and Confirm/Reject buttons
