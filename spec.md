# Closer to Market

## Current State
App ina mfumo wa subscription ambapo maduka yanahitaji kulipa na admin kuidhinisha ili yaonekane. Admin panel inaonyesha tu pending subscription references. Admin registration imekuwa ikikataa kwa sababu ya muunganiko na mfumo wa malipo.

## Requested Changes (Diff)

### Add
- Backend: `getAllOrdersAdmin()` query - admin anaona orders/transactions zote
- AdminPanel: Sehemu ya "Transactions" inayoonyesha orders zote na jina la mteja, namba, ushahidi wa malipo (picha au maandishi), kiasi, hali
- Shops zinakuwa active=true mara zinapoundwa (bila kuhitaji subscription approval)

### Modify
- Backend `createShop`: isActive default = true badala ya false
- AdminPanel: Ongeza tab ya Transactions pamoja na Settings na Pending Refs
- ProfileSetup: Safisha registration flow ya admin

### Remove
- Kizuizi cha subscription kinachozuia shops kuonekana bila admin approval
- Ugumu wa admin registration unaosababishwa na muunganiko wa malipo

## Implementation Plan
1. Edit main.mo: add getAllOrdersAdmin(), change createShop isActive=true
2. Update backend.did.d.ts: add getAllOrdersAdmin declaration
3. Update useQueries.ts: add useGetAllOrdersAdmin hook
4. Rewrite AdminPanel.tsx: add Transactions tab with full order details
5. Fix ProfileSetup.tsx: clean admin registration flow
