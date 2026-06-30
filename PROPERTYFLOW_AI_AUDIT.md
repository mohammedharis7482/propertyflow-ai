# PropertyFlow AI Audit

## 1. AI Feature Overview

PropertyFlow AI currently uses a backend-driven, rule-based intelligence layer for real estate recommendations, match scoring, lead prioritization, listing quality checks, and market signals.

This is not OpenAI-powered or generative AI yet. No API keys, paid AI services, or external model calls are used in the current implementation.

Current AI features:

- User property recommendations
- Property match score
- Agent lead priority signal
- Listing quality score
- Admin market signal summary
- Frontend AI assistant foundation

## 2. Current AI Architecture

Backend:

- Django app: `apps/ai_insights`
- Model: `AIInsight`
- Service layer: `apps/ai_insights/services.py`
- API layer: `apps/ai_insights/views.py`
- Seed command: `python manage.py seed_phase7_ai`

Frontend:

- AI service: `src/services/ai.service.ts`
- AI types: `src/types/ai.ts`
- Reusable AI UI components:
  - `AIBadge`
  - `AIScoreCard`
  - `AIRecommendationCard`
  - `AIMarketSignalCard`
  - `AIAssistantPanel`

## 3. Rule-Based AI Logic

Property match scoring considers:

- Saved and inquiry location history
- Property type interest
- Purpose interest
- Similar price ranges
- Featured property status
- Verified agent signal
- Image and feature completeness

Lead priority scoring considers:

- Message strength
- Phone/contact completeness
- Property value
- Inquiry source
- Email/contact quality

Listing quality scoring considers:

- Title and description completeness
- Uploaded or remote images
- Primary image
- Features
- Price
- Location
- Bedroom/bathroom/size data
- Publishing and approval readiness

Market signals consider:

- Top cities by listing count
- Popular property types
- Inquiry demand by city
- Listing, inquiry, and appointment counts

## 4. User AI Features

Page audited:

- `/dashboard/user/recommendations`

Status:

- Pass

Connected API:

- `GET /api/v1/ai/recommendations/`

Current behavior:

- Shows a premium AI recommendations hero card.
- Shows recommendation count, average match, and high-demand location count.
- Shows recommendation cards with image, title, location, price, match score, AI reason, save action, and view details CTA.
- Shows helpful empty state: “Save or inquire about properties to improve your recommendations.”
- Uses clean loading and error states.

Fixes completed:

- Replaced generic recommendation cards with AI-specific cards.
- Added direct AI reason display.
- Added safe slug handling for detail links.
- Added save action feedback.

Remaining notes:

- Save state is local to the card after click. A future enhancement can pre-check already-saved properties from backend.

## 5. Agent AI Features

Pages audited:

- `/dashboard/agent`
- `/dashboard/agent/inquiries`
- `/dashboard/agent/listings`

Status:

- Pass

Connected APIs:

- `GET /api/v1/ai/inquiries/{id}/lead-priority/`
- `GET /api/v1/ai/properties/{slug}/listing-quality/`

Current behavior:

- Lead priority appears on agent inquiry cards.
- Priority badges use readable HIGH / MEDIUM / LOW presentation.
- Lead score and summary are compact and do not crowd the inquiry card.
- Listing quality score appears on listing cards.
- Listing quality suggestions are clamped so cards do not become too tall.

Fixes completed:

- Standardized lead priority UI with `AIBadge`.
- Standardized listing quality UI with `AIScoreCard`.
- Added safe summary fallback for unavailable AI data.

Remaining notes:

- Listing quality suggestions are compact in list view. A future drawer can show all suggestions in detail.

## 6. Admin AI Features

Pages audited:

- `/dashboard/admin/analytics`

Status:

- Pass

Connected API:

- `GET /api/v1/ai/market-signals/`

Current behavior:

- Shows AI Market Signals with demand summary.
- Shows listing, inquiry, and appointment counts.
- Shows top cities and popular property type chips.
- Uses PropertyFlow signal wording, not OpenAI or predictive claims.

Fixes completed:

- Replaced one-off market card UI with `AIMarketSignalCard`.
- Added clean fallback copy when market data is unavailable.

Remaining notes:

- Charts on the analytics page still use mock-ready adapters. Market signal card is live.

## 7. AI Assistant Foundation

Component audited:

- `src/components/ai/AIAssistantPanel.tsx`

Status:

- Pass

Current behavior:

- Dashboard topbar opens a premium AI assistant panel.
- Assistant is clearly labeled: “PropertyFlow signal-based assistant.”
- Suggested prompts are visible:
  - Show my best property matches
  - Which locations are trending?
  - How can I improve this listing?
  - Which leads are high priority?
- Recommendation and market prompts call live AI APIs.
- Listing and lead prompts guide users to the relevant connected AI surfaces.
- No fake typing, no fake model output, and no generative AI claims.

Fixes completed:

- Clarified signal-based assistant labeling.
- Added mobile-safe prompt truncation.
- Kept panel height controlled with internal scrolling.
- Added clean error state for failed prompt actions.

Remaining notes:

- Free-form chat is intentionally not implemented yet.

## 8. APIs Used

AI APIs:

- `GET /api/v1/ai/recommendations/`
- `GET /api/v1/ai/properties/{slug}/match-score/`
- `GET /api/v1/ai/inquiries/{id}/lead-priority/`
- `GET /api/v1/ai/properties/{slug}/listing-quality/`
- `GET /api/v1/ai/market-signals/`

Supporting workflow APIs:

- `POST /api/v1/properties/{slug}/save/`
- Dashboard auth-protected APIs for user, agent, and admin pages

## 9. Pages Connected

Connected AI surfaces:

- `/dashboard/user/recommendations`
- `/properties/[slug]`
- `/dashboard/agent/inquiries`
- `/dashboard/agent/listings`
- `/dashboard/admin/analytics`
- Dashboard topbar AI Assistant panel

## 10. Issues Found

Issues found during Phase 7C:

- Recommendation card could route to a fallback slug if AI data ever missed `slug`.
- AI assistant label could be clearer that it is signal-based, not generative.
- Score card summary needed a safe fallback for unavailable summary text.
- Long prompt labels needed mobile-safe truncation.

## 11. Fixes Completed

Completed fixes:

- Disabled View Details when a recommendation slug is missing instead of routing to a fake slug.
- Updated assistant badge to “PropertyFlow signal-based assistant.”
- Added prompt text truncation in assistant panel.
- Added safe summary fallback in `AIScoreCard`.
- Re-ran lint/build checks successfully.

## 12. Limitations

Current limitations:

- AI is rule-based, not OpenAI/generative.
- No natural-language free-form assistant responses yet.
- No embedding search or semantic property matching yet.
- Recommendation save state is local after action.
- Analytics charts are still backend-ready/mock-adapter based, while market signal card is live.

These limitations are intentional for the current phase.

## 13. Future OpenAI Upgrade Plan

Recommended future upgrade path:

1. Keep the existing AI API endpoints stable.
2. Add OpenAI integration inside `apps/ai_insights/services.py`, behind the current service functions.
3. Use rule-based scores as grounding data.
4. Ask OpenAI to generate concise explanations, not raw decisions.
5. Store generated insights in `AIInsight` for auditability and caching.
6. Add admin controls for AI prompt templates and safety settings.
7. Add rate limiting and cost tracking before production AI release.
8. Expand assistant from guided prompts into controlled conversational mode.

This approach preserves the current frontend and backend contracts while upgrading the intelligence layer safely.

