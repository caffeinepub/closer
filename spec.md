# Closer to Market

## Current State
App ina backend ya Motoko na frontend ya React. Tatizo kuu: `getUserRole` katika `access-control.mo` ilifanya `Runtime.trap` kwa watumiaji wasiojulikana badala ya kurudisha `#guest`. Hii ilisababisha "Hitilafu" kila mtumiaji asiyeandikishwa alipojaribu kufanya kitu chochote.

## Requested Changes (Diff)

### Add
- (hakuna)

### Modify
- `access-control.mo`: `getUserRole` sasa inarudisha `#guest` badala ya `Runtime.trap` kwa watumiaji wasiojulikana
- `hasPermission` imeboreshwa kutumia switch badala ya equality checks

### Remove
- `Runtime.trap("User is not registered")` -- hii ndiyo ilikuwa chanzo cha hitilafu zote

## Implementation Plan
1. Fix `access-control.mo` - imekamilika
2. Deploy
