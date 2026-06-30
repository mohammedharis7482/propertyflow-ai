# PropertyFlow AI Product Flow

## 1. Project Overview

PropertyFlow AI is a GCC-focused AI-powered real estate SaaS platform designed for property seekers, buyers, tenants, agents, agencies, and platform administrators.

The product combines a public real estate marketplace with role-based SaaS dashboards. Public visitors can browse premium properties, view agents, read market insights, and register or log in. Registered users can save properties, submit inquiries, book appointments, and manage their property journey. Agents can manage leads, appointments, and listing performance. Admins can monitor the platform, verify agents, approve properties, manage users, and track operational activity.

The frontend is built with Next.js, TypeScript, Tailwind CSS, reusable UI components, and a premium light SaaS dashboard design. The backend is built with Python, Django, Django REST Framework, JWT authentication, SQLite for local development, and PostgreSQL-ready production settings.

## 2. User Roles

### Public Visitor

Public visitors are unauthenticated users browsing the marketing website and public marketplace.

They can:
- View the home page
- Browse public properties
- View property details
- Browse agents
- View agent profiles
- Read market insights
- Visit about/contact pages
- Register or log in

They cannot:
- Save properties
- Submit authenticated inquiries
- Book appointments
- Access dashboards

### Registered User / Buyer / Tenant

Registered users are property seekers who can interact with properties and agents.

They can:
- Log in using JWT authentication
- Access the user dashboard
- Save and remove properties
- Submit property inquiries
- Book and cancel appointments
- View saved properties
- Track inquiries
- Track appointments
- View recommendations
- Manage profile information

### Agent

Agents are verified property advisors who manage leads and viewing workflows.

They can:
- Log in using an AGENT account
- Access the agent dashboard
- View own inquiries
- Update inquiry status
- View own appointments
- Update appointment status
- View dashboard listing performance
- Access listing workspace
- Manage profile page UI

Current guaranteed test agent:

```txt
email: agent@propertyflow.ai
password: Agent@12345
```

### Admin

Admins manage platform operations and quality control.

They can:
- Access the admin dashboard
- Manage users
- Verify/reject agents
- Feature/unfeature agents
- Approve/reject properties
- Feature/unfeature properties
- Monitor inquiries
- Monitor appointments
- Send notifications through backend API
- Review audit logs through backend API

Current admin test account:

```txt
email: admin@propertyflow.ai
password: Admin@12345
```

## 3. Public Website Navigation

### `/`

Purpose: Main marketing and discovery landing page for PropertyFlow AI.

Main actions:
- Explore properties
- View featured listings
- View top agents
- Navigate to market insights
- Register or log in

Backend APIs used:
- `GET /api/v1/properties/featured/`
- `GET /api/v1/agents/featured/`

Current status: Connected to backend public APIs and visually polished.

### `/properties`

Purpose: Public property listing page.

Main actions:
- Search properties
- Filter by location/type/purpose/price
- Open property details
- Save property if authenticated

Backend APIs used:
- `GET /api/v1/properties/`

Current status: Connected to backend listings API. Layout and filter overflow issues were fixed.

### `/properties/[slug]`

Purpose: Public property details page.

Main actions:
- View full property information
- View gallery/images
- Save/unsave property
- Contact agent
- Book viewing

Backend APIs used:
- `GET /api/v1/properties/{slug}/`
- `POST /api/v1/properties/{slug}/save/`
- `DELETE /api/v1/properties/{slug}/unsave/`
- `POST /api/v1/inquiries/`
- `POST /api/v1/appointments/`

Current status: Connected to backend detail API and action APIs. Detail API error handling was hardened with slug validation, 404 handling, and a premium error state.

### `/agents`

Purpose: Public agent directory.

Main actions:
- Browse verified agents
- Search/filter agents
- Open agent details

Backend APIs used:
- `GET /api/v1/agents/`
- `GET /api/v1/agents/featured/`

Current status: Connected to backend agent APIs. Layout overflow issues were fixed.

### `/agents/[slug]`

Purpose: Public agent profile page.

Main actions:
- View agent profile
- View specialities/languages
- Contact agent
- View featured listings

Backend APIs used:
- `GET /api/v1/agents/{slug}/`
- `GET /api/v1/properties/featured/`
- `POST /api/v1/inquiries/` when representative property is available

Current status: Connected to backend agent detail API. Agent contact can create an inquiry when a representative property slug exists.

### `/insights`

Purpose: Market insight and intelligence page.

Main actions:
- View GCC market insight content
- Navigate to properties

Backend APIs used:
- Currently mostly static/frontend content

Current status: Frontend complete. Future backend market insight APIs can be added later.

### `/about`

Purpose: Explain the platform, mission, features, and product positioning.

Main actions:
- Learn about PropertyFlow AI
- Navigate to properties/contact/register

Backend APIs used:
- None currently

Current status: Frontend complete.

### `/contact`

Purpose: Public contact page for platform inquiries and partnerships.

Main actions:
- Submit contact form frontend state
- View contact information

Backend APIs used:
- None currently

Current status: Frontend complete. Backend contact endpoint can be added later.

### `/login`

Purpose: User authentication entry.

Main actions:
- Submit email/password
- Store JWT tokens
- Redirect by role

Backend APIs used:
- `POST /api/v1/auth/login/`
- `GET /api/v1/auth/me/`

Current status: Connected and working.

### `/register`

Purpose: New user registration.

Main actions:
- Register USER or AGENT account
- Show success/error state
- Redirect to login

Backend APIs used:
- `POST /api/v1/auth/register/`

Current status: Connected and working.

## 4. User Dashboard Navigation

### `/dashboard/user`

Purpose: User overview workspace.

Features:
- Saved property count
- Inquiry count
- Appointment count
- Unread notification count
- Recent saved properties
- Recent inquiries
- Upcoming appointments
- Recommendation preview

Backend APIs used:
- `GET /api/v1/users/me/dashboard/`

Current status: Connected to backend dashboard API.

Pending actions:
- Final QA for all live action refresh behavior
- Improve recommendation logic when AI phase begins

### `/dashboard/user/saved-properties`

Purpose: Manage saved property collection.

Features:
- Search saved properties
- Filter saved properties
- View details
- Remove saved property

Backend APIs used:
- `GET /api/v1/users/me/saved-properties/`
- `DELETE /api/v1/properties/{slug}/unsave/`

Current status: Connected.

Pending actions:
- Verify save/unsave state after page refresh
- Add saved-state preload on public property cards

### `/dashboard/user/inquiries`

Purpose: Track user property inquiries.

Features:
- View submitted inquiries
- Search inquiries
- View inquiry status and priority

Backend APIs used:
- `GET /api/v1/users/me/inquiries/`

Current status: Connected.

Pending actions:
- Add real chat/reply thread later
- Add archive endpoint later if needed

### `/dashboard/user/appointments`

Purpose: Track viewing appointments.

Features:
- View upcoming appointments
- See status and visit type
- Cancel appointment

Backend APIs used:
- `GET /api/v1/users/me/appointments/`
- `PATCH /api/v1/appointments/{id}/cancel/`

Current status: Connected.

Pending actions:
- Add reschedule endpoint/UI later
- Final QA for appointment cancellation

### `/dashboard/user/recommendations`

Purpose: AI recommendation workspace.

Features:
- Recommendation preview
- Market signal cards
- AI match UI

Backend APIs used:
- Currently mostly frontend/mock recommendation UI
- User dashboard API provides `recommendation_preview`

Current status: Frontend complete, AI logic pending.

Pending actions:
- Connect real AI recommendation engine later

### `/dashboard/user/profile`

Purpose: User profile management page.

Features:
- Profile UI
- Editable frontend form state

Backend APIs used:
- `GET /api/v1/auth/me/` indirectly through auth context

Current status: Frontend profile UI exists.

Pending actions:
- Add backend profile update endpoint and connect form

## 5. Agent Dashboard Navigation

### `/dashboard/agent`

Purpose: Agent overview workspace.

Features:
- Total listings
- Published listings
- Total inquiries
- New inquiries
- Appointments
- Pending appointments
- Recent inquiries
- Upcoming appointments
- Top properties

Backend APIs used:
- `GET /api/v1/agents/me/dashboard/`

Current status: Connected. Missing AgentProfile issue was fixed with clean 404 handling and guaranteed seed account.

Pending actions:
- Add dedicated agent listings endpoint later

### `/dashboard/agent/listings`

Purpose: Agent listing management workspace.

Features:
- Shows dashboard top properties
- Add listing drawer UI

Backend APIs used:
- `GET /api/v1/agents/me/dashboard/`

Current status: Uses dashboard `top_properties` because dedicated listing CRUD API is not yet built.

Pending actions:
- Create listing endpoint
- Edit listing endpoint
- Image upload endpoint
- Publish/unpublish listing endpoint

### `/dashboard/agent/inquiries`

Purpose: Agent CRM and lead pipeline.

Features:
- View own inquiries
- Search leads
- Update inquiry status

Backend APIs used:
- `GET /api/v1/agents/me/inquiries/`
- `PATCH /api/v1/inquiries/{id}/status/`

Current status: Connected.

Pending actions:
- Final QA for status updates
- Add message/reply thread later

### `/dashboard/agent/appointments`

Purpose: Agent viewing schedule.

Features:
- View own appointments
- Confirm appointment
- Complete appointment
- Reschedule/no-show status action

Backend APIs used:
- `GET /api/v1/agents/me/appointments/`
- `PATCH /api/v1/appointments/{id}/status/`

Current status: Connected.

Pending actions:
- Add calendar-style view later
- Add reschedule details later

### `/dashboard/agent/analytics`

Purpose: Agent analytics and listing performance workspace.

Features:
- Chart UI
- Lead/performance summaries
- Chart data readiness status

Backend APIs used:
- Currently mostly frontend analytics UI

Current status: Frontend complete.

Pending actions:
- Add real analytics backend endpoints

### `/dashboard/agent/profile`

Purpose: Agent profile settings page.

Features:
- Profile form UI
- Agent details display/editing state

Backend APIs used:
- `GET /api/v1/auth/me/` indirectly

Current status: Frontend UI exists.

Pending actions:
- Add agent profile update API
- Add profile image upload
- Add license/verification document upload

## 6. Admin Dashboard Navigation

### `/dashboard/admin`

Purpose: Admin control center overview.

Features:
- Platform stats
- Pending approvals
- Recent users
- Recent inquiries
- Upcoming appointments
- Top properties

Backend APIs used:
- `GET /api/v1/admin/dashboard/`

Current status: Connected.

Pending actions:
- Add richer operational charts

### `/dashboard/admin/users`

Purpose: Manage platform users.

Features:
- List users
- View role/status
- Activate/deactivate users

Backend APIs used:
- `GET /api/v1/admin/users/`
- `PATCH /api/v1/admin/users/{id}/status/`
- `PATCH /api/v1/admin/users/{id}/role/`

Current status: List and status action connected.

Pending actions:
- Connect role update UI
- Add user detail drawer

### `/dashboard/admin/agents`

Purpose: Manage agent verification and quality.

Features:
- List agents
- Verify/reject agents
- Feature/unfeature agents

Backend APIs used:
- `GET /api/v1/admin/agents/`
- `PATCH /api/v1/admin/agents/{id}/verification/`
- `PATCH /api/v1/admin/agents/{id}/feature/`

Current status: Connected.

Pending actions:
- Add agency management UI
- Add verification document review later

### `/dashboard/admin/properties`

Purpose: Moderate platform properties.

Features:
- List properties
- Approve/reject properties
- Feature/unfeature properties

Backend APIs used:
- `GET /api/v1/admin/properties/`
- `PATCH /api/v1/admin/properties/{id}/approval/`
- `PATCH /api/v1/admin/properties/{id}/feature/`
- `PATCH /api/v1/admin/properties/{id}/status/`

Current status: Approval and feature actions connected.

Pending actions:
- Connect property status action UI
- Add property detail moderation drawer

### `/dashboard/admin/inquiries`

Purpose: Monitor platform-wide lead activity.

Features:
- List all inquiries
- View source/priority/status
- Qualify inquiry
- Mark high priority

Backend APIs used:
- `GET /api/v1/admin/inquiries/`
- `PATCH /api/v1/admin/inquiries/{id}/status/`
- `PATCH /api/v1/admin/inquiries/{id}/priority/`

Current status: Connected.

Pending actions:
- Add escalation workflow later

### `/dashboard/admin/appointments`

Purpose: Monitor platform-wide appointments.

Features:
- List appointments
- Confirm appointments
- Complete appointments

Backend APIs used:
- `GET /api/v1/admin/appointments/`
- `PATCH /api/v1/admin/appointments/{id}/status/`

Current status: Connected.

Pending actions:
- Add filtering controls
- Add agent/user contact actions later

### `/dashboard/admin/analytics`

Purpose: Platform analytics dashboard.

Features:
- Chart UI
- Market and platform summary cards
- Data readiness status

Backend APIs used:
- Currently mostly frontend analytics UI

Current status: Frontend complete.

Pending actions:
- Add backend analytics endpoints

### `/dashboard/admin/settings`

Purpose: Configure platform defaults, governance, notifications, and operational rules.

Features:
- Settings cards
- Mock save drawers
- Notification routing UI

Backend APIs used:
- None currently

Current status: Frontend UI exists.

Pending actions:
- Add settings backend module
- Connect save settings actions

### `/dashboard/admin/audit-logs`

Purpose: Review admin action history.

Features:
- Audit log API exists in backend

Backend APIs used:
- `GET /api/v1/admin/audit-logs/`

Current status: Backend exists. No dedicated frontend route currently.

Pending actions:
- Create `/dashboard/admin/audit-logs`
- Add sidebar link if needed
- Display audit logs table

## 7. Core Workflows

### A. Visitor explores property

Start point: Public website home page or `/properties`.

Steps:
1. Visitor opens home page.
2. Visitor browses featured properties.
3. Visitor opens `/properties`.
4. Visitor filters/searches listings.
5. Visitor clicks a property card.
6. Visitor lands on `/properties/[slug]`.

Backend APIs:
- `GET /api/v1/properties/featured/`
- `GET /api/v1/properties/`
- `GET /api/v1/properties/{slug}/`

Expected result: Visitor can inspect a property without logging in.

Current status: Connected.

Pending fixes: Continue QA for backend data edge cases.

### B. User registers/logs in

Start point: `/register` or `/login`.

Steps:
1. User registers with full name, email, phone, role, and password.
2. User logs in with email/password.
3. JWT access and refresh tokens are stored.
4. Frontend calls `/auth/me/`.
5. User is redirected by role.

Backend APIs:
- `POST /api/v1/auth/register/`
- `POST /api/v1/auth/login/`
- `GET /api/v1/auth/me/`

Expected result: Authenticated user reaches correct dashboard.

Current status: Connected and working.

Pending fixes: Add password reset later.

### C. User saves property

Start point: Property card or property detail page.

Steps:
1. User clicks save/heart button.
2. If not logged in, redirect to login.
3. If logged in, frontend calls save API.
4. UI shows success state.
5. Saved property appears in user dashboard.

Backend APIs:
- `POST /api/v1/properties/{slug}/save/`
- `GET /api/v1/users/me/saved-properties/`

Expected result: Property is stored in user's saved list.

Current status: Connected.

Pending fixes: Preload existing saved state on public cards.

### D. User contacts agent / creates inquiry

Start point: Property detail contact button or agent profile message action.

Steps:
1. User opens contact drawer.
2. User details are prefilled from auth context when available.
3. User submits message.
4. Backend creates inquiry and assigns property agent.
5. Agent receives lead notification.
6. User sees inquiry in dashboard.

Backend APIs:
- `POST /api/v1/inquiries/`
- `GET /api/v1/users/me/inquiries/`
- `GET /api/v1/agents/me/inquiries/`

Expected result: Inquiry is created and visible to user/agent.

Current status: Connected for property details and agent profile when representative property exists.

Pending fixes: Add dedicated agent-contact endpoint not requiring property slug.

### E. User books appointment

Start point: Property detail schedule viewing action.

Steps:
1. User opens schedule viewing drawer.
2. User enters date/time/notes.
3. Backend creates appointment.
4. Appointment appears in user and agent dashboards.

Backend APIs:
- `POST /api/v1/appointments/`
- `GET /api/v1/users/me/appointments/`
- `GET /api/v1/agents/me/appointments/`

Expected result: Appointment request is created.

Current status: Connected.

Pending fixes: Add reschedule workflow later.

### F. Agent manages inquiries

Start point: `/dashboard/agent/inquiries`.

Steps:
1. Agent views own inquiries.
2. Agent updates status.
3. Backend saves status.
4. Dashboard refreshes.

Backend APIs:
- `GET /api/v1/agents/me/inquiries/`
- `PATCH /api/v1/inquiries/{id}/status/`

Expected result: Lead pipeline reflects latest status.

Current status: Connected.

Pending fixes: Add messaging/reply backend later.

### G. Agent manages appointments

Start point: `/dashboard/agent/appointments`.

Steps:
1. Agent views own appointments.
2. Agent confirms/completes/reschedules/no-shows.
3. Backend updates appointment.
4. Dashboard refreshes.

Backend APIs:
- `GET /api/v1/agents/me/appointments/`
- `PATCH /api/v1/appointments/{id}/status/`

Expected result: Appointment state updates.

Current status: Connected.

Pending fixes: Add real reschedule details and calendar view.

### H. Admin verifies agent

Start point: `/dashboard/admin/agents`.

Steps:
1. Admin views agents.
2. Admin clicks verify or reject.
3. Frontend confirms action.
4. Backend updates verification status.
5. Backend creates notification/audit log.
6. Admin list refreshes.

Backend APIs:
- `GET /api/v1/admin/agents/`
- `PATCH /api/v1/admin/agents/{id}/verification/`

Expected result: Agent verification status changes.

Current status: Connected.

Pending fixes: Add verification document review UI.

### I. Admin approves property

Start point: `/dashboard/admin/properties`.

Steps:
1. Admin views property queue.
2. Admin approves or rejects listing.
3. Backend updates approval status.
4. Backend creates audit log/notification.
5. Admin list refreshes.

Backend APIs:
- `GET /api/v1/admin/properties/`
- `PATCH /api/v1/admin/properties/{id}/approval/`

Expected result: Listing approval status changes.

Current status: Connected.

Pending fixes: Connect full property status actions.

### J. Admin manages users

Start point: `/dashboard/admin/users`.

Steps:
1. Admin views users.
2. Admin activates/deactivates a user.
3. Backend updates account status.
4. Admin list refreshes.

Backend APIs:
- `GET /api/v1/admin/users/`
- `PATCH /api/v1/admin/users/{id}/status/`
- `PATCH /api/v1/admin/users/{id}/role/`

Expected result: User account status/role can be managed.

Current status: Status action connected.

Pending fixes: Add role update UI.

### K. Admin sends notification

Start point: Future admin notification UI.

Steps:
1. Admin chooses target audience.
2. Admin writes title/message.
3. Backend creates notifications.
4. Users/agents see unread notifications.

Backend APIs:
- `POST /api/v1/admin/notifications/send/`

Expected result: Notifications are created for target users.

Current status: Backend API and frontend service exist.

Pending fixes: Create dedicated admin send-notification UI.

### L. User receives notification

Start point: Dashboard topbar bell.

Steps:
1. User receives notification from backend workflow.
2. User opens dashboard.
3. User clicks bell.
4. Frontend marks all notifications read.
5. User is navigated to relevant dashboard page.

Backend APIs:
- `GET /api/v1/notifications/`
- `PATCH /api/v1/notifications/{id}/read/`
- `PATCH /api/v1/notifications/mark-all-read/`

Expected result: Notification unread state updates.

Current status: Mark-all-read connected through dashboard bell.

Pending fixes: Add full notification dropdown/page and per-notification read action.

## 8. Backend Modules

### `accounts`

Custom email-based user model, roles, auth serializers, JWT auth endpoints, and user admin integration.

### `agencies`

Agency model and public agency APIs. Agencies can be verified and linked to agent profiles.

### `agents`

AgentProfile model, public agent APIs, featured agents, and agent detail/list serializers.

### `properties`

Property, PropertyImage, and PropertyFeature models. Provides public listing/detail/featured/features APIs with filtering/search.

### `saved_properties`

SavedProperty model and authenticated save/unsave user workflow.

### `inquiries`

Inquiry/lead workflow for property contact, user inquiry history, agent inquiry management, and status updates.

### `appointments`

Appointment booking and viewing workflow for users and agents.

### `notifications`

Notification model, read/unread APIs, mark-all-read API, and workflow notification support.

### `admin_panel`

API-based admin control layer for users, agents, agencies, properties, inquiries, appointments, dashboard stats, and notifications.

### `audit_logs`

AuditLog model and helper for recording important admin actions.

### `core`

BaseModel, health check API, dashboard APIs, and seed commands.

## 9. API-to-Frontend Mapping

| Frontend page/action | Backend API | Status |
| --- | --- | --- |
| Home featured properties | `GET /api/v1/properties/featured/` | Connected |
| Home featured agents | `GET /api/v1/agents/featured/` | Connected |
| Properties listing | `GET /api/v1/properties/` | Connected |
| Property details | `GET /api/v1/properties/{slug}/` | Connected |
| Save property | `POST /api/v1/properties/{slug}/save/` | Connected |
| Unsave property | `DELETE /api/v1/properties/{slug}/unsave/` | Connected |
| Agents listing | `GET /api/v1/agents/` | Connected |
| Agent details | `GET /api/v1/agents/{slug}/` | Connected |
| Login | `POST /api/v1/auth/login/` | Connected |
| Register | `POST /api/v1/auth/register/` | Connected |
| Current user | `GET /api/v1/auth/me/` | Connected |
| User overview | `GET /api/v1/users/me/dashboard/` | Connected |
| User saved properties | `GET /api/v1/users/me/saved-properties/` | Connected |
| User inquiries | `GET /api/v1/users/me/inquiries/` | Connected |
| User appointments | `GET /api/v1/users/me/appointments/` | Connected |
| Create inquiry | `POST /api/v1/inquiries/` | Connected |
| Create appointment | `POST /api/v1/appointments/` | Connected |
| Cancel appointment | `PATCH /api/v1/appointments/{id}/cancel/` | Connected |
| Agent overview | `GET /api/v1/agents/me/dashboard/` | Connected |
| Agent inquiries | `GET /api/v1/agents/me/inquiries/` | Connected |
| Agent appointments | `GET /api/v1/agents/me/appointments/` | Connected |
| Agent update inquiry | `PATCH /api/v1/inquiries/{id}/status/` | Connected |
| Agent update appointment | `PATCH /api/v1/appointments/{id}/status/` | Connected |
| Admin overview | `GET /api/v1/admin/dashboard/` | Connected |
| Admin users | `GET /api/v1/admin/users/` | Connected |
| Admin user status | `PATCH /api/v1/admin/users/{id}/status/` | Connected |
| Admin agents | `GET /api/v1/admin/agents/` | Connected |
| Admin agent verification | `PATCH /api/v1/admin/agents/{id}/verification/` | Connected |
| Admin agent feature | `PATCH /api/v1/admin/agents/{id}/feature/` | Connected |
| Admin properties | `GET /api/v1/admin/properties/` | Connected |
| Admin property approval | `PATCH /api/v1/admin/properties/{id}/approval/` | Connected |
| Admin property feature | `PATCH /api/v1/admin/properties/{id}/feature/` | Connected |
| Admin inquiries | `GET /api/v1/admin/inquiries/` | Connected |
| Admin inquiry status | `PATCH /api/v1/admin/inquiries/{id}/status/` | Connected |
| Admin inquiry priority | `PATCH /api/v1/admin/inquiries/{id}/priority/` | Connected |
| Admin appointments | `GET /api/v1/admin/appointments/` | Connected |
| Admin appointment status | `PATCH /api/v1/admin/appointments/{id}/status/` | Connected |
| Notifications list | `GET /api/v1/notifications/` | Service exists |
| Mark notification read | `PATCH /api/v1/notifications/{id}/read/` | Service exists |
| Mark all notifications read | `PATCH /api/v1/notifications/mark-all-read/` | Connected through bell |
| Admin audit logs | `GET /api/v1/admin/audit-logs/` | Backend/service exists, page pending |
| Admin send notification | `POST /api/v1/admin/notifications/send/` | Service exists, UI pending |

## 10. Important Pending Features

### High Priority

- Property detail API error fix final verification
- Save/unsave action final verification
- Inquiry form final connection QA
- Appointment booking final connection QA
- Agent status update action QA
- Admin action button QA
- Notification read action QA

### Medium Priority

- Profile editing backend connection
- Agent listing creation/editing
- Property image upload
- Agent onboarding flow
- Password reset
- Email notifications
- Notification dropdown/page
- Admin audit-log frontend route
- Admin notification send UI

### Future

- AI recommendations
- AI match score backend logic
- AI lead scoring
- Listing quality score
- Advanced analytics
- Deployment
- Production PostgreSQL setup
- Cloud media storage
- CI/CD pipeline

## 11. Final Completion Roadmap

### Phase 6A: Fix Current Errors

Goal: Stabilize current connected flows.

Tasks:
- Verify property detail API handling
- Verify slug handling
- Verify auth redirect behavior
- Verify dashboard API loading
- Check frontend console for uncaught errors

### Phase 6B: Complete User Actions

Goal: Finish buyer/tenant workflows.

Tasks:
- Fully QA save/unsave
- Fully QA inquiry creation
- Fully QA appointment booking
- Fully QA appointment cancellation
- Add saved state preload
- Improve notification read UI

### Phase 6C: Complete Agent Actions

Goal: Finish agent CRM workflows.

Tasks:
- QA inquiry status updates
- QA appointment status updates
- Add agent listing CRUD APIs
- Add edit listing UI
- Add listing image upload
- Add agent profile backend update

### Phase 6D: Complete Admin Actions

Goal: Finish admin control workflows.

Tasks:
- QA user activation/deactivation
- Add role update UI
- QA agent verification and feature actions
- QA property approval and feature actions
- Add property status UI
- Add audit-log frontend page
- Add admin notification send UI

### Phase 6E: Full Workflow Audit

Goal: Test the entire SaaS journey end to end.

Tasks:
- Visitor browse flow
- User auth flow
- Save property flow
- Inquiry flow
- Appointment flow
- Agent CRM flow
- Admin verification/moderation flow
- Notification flow
- Mobile responsiveness audit
- Error/empty/loading state audit

### Phase 7: AI Features

Goal: Add real intelligence layer.

Tasks:
- Recommendation engine
- Match score logic
- Lead score logic
- Market insight generation
- Listing quality scoring
- AI assistant backend integration

### Phase 8: Production Deployment

Goal: Make the platform client-ready for production.

Tasks:
- PostgreSQL production setup
- Environment configuration
- Static/media storage
- Secure JWT/cookie strategy review
- Deployment pipeline
- Domain/SSL
- Monitoring/logging
- Backup plan
- Production seed/admin setup
