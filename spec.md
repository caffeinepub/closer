# Closer to Market

## Current State
- Full marketplace app with shop browsing, product management, orders, admin panel
- Frontend calls several old payment/subscription backend functions that were removed from main.mo: `submitSubscriptionReference`, `getPendingReferences`, `getMyReferences`, `approveSubscriptionReference`, `rejectSubscriptionReference` — these cause runtime errors
- App.tsx calls `_initializeAccessControlWithSecret` which requires CAFFEINE_ADMIN_TOKEN env var and can trap
- ShopModal shows shops in a dialog with a simple avatar + name header, no visual banner
- isCallerAdmin exists via MixinAuthorization mixin (included in actor)

## Requested Changes (Diff)

### Add
- Shop banner/header ("hat kwa duka maalum"): colorful gradient header at top of each ShopModal with shop logo, name, category badge, and active status indicator

### Modify
- Remove all calls to non-existent payment functions from useQueries.ts: delete `useSubmitSubscriptionReference`, `useApproveSubscriptionReference`, `useRejectSubscriptionReference`, `usePendingReferences`, `useMyReferences` hooks since their backend counterparts don't exist
- Clean App.tsx: remove the `_initializeAccessControlWithSecret` call (which requires env var and can fail), rely only on `claimAdminIfNoneYet` for auto-admin
- Fix any references to the removed hooks in AdminPanel and ShopOwnerDashboard

### Remove
- Dead code for payment/subscription functions in useQueries.ts
- `_initializeAccessControlWithSecret` call in App.tsx

## Implementation Plan
1. Update useQueries.ts: delete the 5 dead payment hooks
2. Update App.tsx: remove `_initializeAccessControlWithSecret` effect, keep only `claimAdminIfNoneYet`
3. Update AdminPanel.tsx: remove any usage of `usePendingReferences`, `useApproveSubscriptionReference`, `useRejectSubscriptionReference`
4. Update ShopOwnerDashboard.tsx: remove any usage of `useMyReferences`, `useSubmitSubscriptionReference`
5. Add shop banner header to ShopModal in ShopBrowser.tsx: gradient banner using shop category color, shop logo centered, name + category overlay
