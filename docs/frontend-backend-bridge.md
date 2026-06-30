# Frontend Backend Bridge

PropertyFlow AI is still frontend-only. Backend calls should connect through the typed API bridge in `src/lib/api`.

## Current Bridge Modules

- `src/lib/api/contracts.ts`: shared payload/result types for auth, contact, and profiles.
- `src/lib/api/actions.ts`: frontend action functions for login, registration, contact, and profile updates.
- `src/lib/api/data.ts`: mock data access functions for properties, agents, and dashboard overviews.
- `src/lib/api/index.ts`: public export surface used by pages and components.

## Future Django/DRF Mapping

- `propertiesApi.list()` -> `GET /api/properties/`
- `propertiesApi.featured()` -> `GET /api/properties/?featured=true`
- `propertiesApi.getBySlug(slug)` -> `GET /api/properties/{slug}/`
- `agentsApi.list()` -> `GET /api/agents/`
- `agentsApi.top()` -> `GET /api/agents/?featured=true`
- `agentsApi.getBySlug(slug)` -> `GET /api/agents/{slug}/`
- `dashboardApi.userOverview()` -> `GET /api/dashboard/user/overview/`
- `dashboardApi.agentOverview()` -> `GET /api/dashboard/agent/overview/`
- `dashboardApi.adminOverview()` -> `GET /api/dashboard/admin/overview/`
- `authApi.login(payload)` -> `POST /api/auth/login/`
- `authApi.register(payload)` -> `POST /api/auth/register/`
- `contactApi.submit(payload)` -> `POST /api/contact/`
- `profileApi.updateUser(payload)` -> `PATCH /api/users/me/profile/`
- `profileApi.updateAgent(payload)` -> `PATCH /api/agents/me/profile/`
- `dashboardActionApi.submit(payload)` -> workflow-specific endpoints such as `POST /api/listings/`, `POST /api/appointments/`, `POST /api/inquiries/{id}/reply/`, and `POST /api/admin/reviews/`

## Backend-Ready Frontend Surfaces

- Public property list and detail pages now read through `propertiesApi`.
- Public agent list and detail pages now read through `agentsApi`.
- Home featured property and top agent sections read through bridge APIs.
- User, agent, and admin dashboard overview pages read through `dashboardApi`.
- Contact, login, register, user profile, and agent profile forms submit through bridge actions.
- Dashboard drawers for adding listings, scheduling viewings, replying to inquiries, and reviewing approvals submit through bridge actions.
- Public property detail contact and viewing actions reuse the mock drawer workflow and can later map to inquiry and appointment endpoints.
- Public agent detail message, callback, and advisory actions reuse the mock drawer workflow and can later map to lead/CRM endpoints.
- User inquiry chat/archive, agent listing edit, admin inquiry assign/resolve, and admin agent review actions are frontend-only drawer workflows ready for endpoint mapping.

## Still Static By Design

- Marketing copy, about-page feature cards, market insight copy, and some dashboard inner-page demo rows remain local frontend content until backend models are finalized.
- Search/filter interactions are currently client-side and can later pass query params to DRF endpoints.
- Dashboard charts currently use local mock chart arrays and can later read analytics endpoint payloads.

## Current Frontend Mock Actions

- Save property: local UI state, later saved-property API.
- Contact agent: mock inquiry drawer, later inquiry API.
- Schedule viewing: mock appointment drawer, later appointment API.
- Request agent callback: mock CRM drawer, later lead activity API.
- Refresh AI recommendations: local loading/success state, later AI recommendation endpoint.
- Open chat/reply inquiry: mock message drawer, later messaging API.
- Archive inquiry: mock status drawer, later inquiry status update API.
- Add/edit listing: mock listing drawer, later listing create/update API.
- Review property/agent/user/inquiry: mock admin drawer, later moderation API.
- Assign/resolve admin inquiry: mock admin drawer, later escalation workflow API.
- Save settings: mock settings drawer, later settings API.
