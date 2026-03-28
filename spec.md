# Closer to Market

## Current State
Marketplace app with shops, products, orders, and admin panel. No feedback or rating system exists.

## Requested Changes (Diff)

### Add
- `AppFeedback` type in backend: id, userId, userName, rating (1-5), comment, timestamp
- `submitAppFeedback(rating, comment)` backend function (registered users only)
- `getAppFeedbacks()` backend query (public)
- `getAverageRating()` backend query returning average rating and count
- Frontend: Feedback section in LandingPage footer area -- star rating input + comment textarea + submit button
- Frontend: Display average rating with star icons and total count on landing page
- Frontend: List of recent feedback visible on landing page below the rating form

### Modify
- `backend.d.ts` -- add `AppFeedback` interface and new function signatures
- `LandingPage.tsx` -- add feedback/rating section

### Remove
- Nothing removed

## Implementation Plan
1. Add `AppFeedback` type and `nextFeedbackId`, `feedbacks` map to backend
2. Add `submitAppFeedback`, `getAppFeedbacks`, `getAverageRating` functions
3. Update `backend.d.ts` with new types and functions
4. Add FeedbackSection component to LandingPage with star rating, comment input, submit, and feedback list
