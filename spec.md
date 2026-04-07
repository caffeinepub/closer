# Closer to Market

## Current State
- AdminPanel inaonyesha maagizo na Bidhaa # (productId number) badala ya jina la bidhaa, na Duka # (shopId number) badala ya jina la duka
- Maagizo kwenye AdminPanel hayapangwi vizuri (mapya juu)
- ShopBrowser haina rating & review section ndani ya ShopModal
- ShopCard hazionyeshi wastani wa rating wa duka
- Backend ina functions: addShopReview, getShopReviews, getShopAverageRating
- backend.d.ts haina ShopReview type wala hooks za ShopReview

## Requested Changes (Diff)

### Add
- ShopReview type kwenye backend.d.ts
- addShopReview, getShopReviews, getShopAverageRating kwenye backendInterface
- useShopReviews(shopId) na useAddShopReview() hooks kwenye useQueries.ts
- useShopAverageRating(shopId) hook kwenye useQueries.ts
- Rating & Review section ndani ya ShopModal (nyota 1-5 + maandishi + orodha ya reviews)
- Onyesha wastani wa rating (nyota) kwenye ShopCard

### Modify
- AdminPanel > AdminOrderCard: badala ya "Bidhaa #" onyesha jina la bidhaa (lookup products list), badala ya shopId onyesha jina la duka (lookup shops list)
- AdminPanel: panga maagizo descending (mapya juu) -- reverse allOrders kabla ya kuonyesha

### Remove
- Hakuna kitu kinachoondolewa

## Implementation Plan
1. Ongeza ShopReview type na methods kwenye backend.d.ts
2. Ongeza useShopReviews, useShopAverageRating, useAddShopReview hooks kwenye useQueries.ts
3. Sasisha AdminPanel AdminOrderCard kupokea products[] na shops[] props, tumia lookup kuonyesha majina badala ya namba, panga maagizo kwa descending
4. Sasisha ShopBrowser ShopModal kuongeza rating & review section chini ya bidhaa
5. Sasisha ShopCard kuonyesha average rating ikipo
