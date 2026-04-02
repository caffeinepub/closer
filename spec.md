# Closer to Market

## Current State
App ina backend (Motoko) na frontend (React/TypeScript). Tatizo kuu ni:
1. `getUserRole` kwenye `access-control.mo` ilifanya `Runtime.trap` kwa watumiaji wasiojulikana -- hii ilisababisha hitilafu zote za kusave
2. `isCallerAdmin` ilikuwepo kwenye IDL lakini haikuwepo kwenye `main.mo` -- hii ilisababisha hitilafu ya muunganisho

## Requested Changes (Diff)

### Add
- `isCallerAdmin` function kwenye `main.mo`

### Modify
- `getUserRole` kwenye `access-control.mo`: badala ya `Runtime.trap`, sasa inarudisha `#guest` kwa watumiaji wasiojulikana

### Remove
- Hakuna

## Implementation Plan
1. Fix `access-control.mo` -- `getUserRole` irudi `#guest` badala ya trap
2. Ongeza `isCallerAdmin` kwenye `main.mo`
