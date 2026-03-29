# Closer to Market

## Current State
App is a Tanzanian marketplace with Shop Browser, Shop Owner Dashboard, Customer Dashboard, Admin Panel, and PWA support. Users can browse shops by category, place orders, and manage shops. Backend has full profile, shop, product, order, and notification management.

## Requested Changes (Diff)

### Add
- AI Chat Assistant component (floating button, chat window) visible app-wide
- Smart rule-based chatbot in Swahili/English helping with:
  - Payment questions (how to pay, M-Pesa/Tigo Pesa instructions)
  - Order placement and tracking help
  - Shop registration help
  - General app navigation help
  - Admin recovery help
- Chat available to both customers and shop owners
- Context-aware: detects if user is shop owner or customer and tailors responses

### Modify
- App.tsx: render AiAssistant floating component globally

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/components/AiAssistant.tsx` -- floating chat bubble button + chat window
2. Pre-programmed responses for: malipo (payments), maagizo (orders), duka (shop setup), admin, kutafuta bidhaa (product search), msaada wa jumla (general help)
3. Quick reply buttons for common topics
4. Integrate into App.tsx as a global floating overlay
