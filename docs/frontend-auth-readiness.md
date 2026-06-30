# Frontend Auth Readiness

The dashboard routes are still public because backend authentication has not started.
The frontend now includes a route-protection contract so Django/DRF auth can plug in later without redesigning the dashboard.

## Route Role Map

Role route definitions live in:

`src/lib/auth/routes.ts`

Current protected groups:

- User: `/dashboard/user/*`
- Agent: `/dashboard/agent/*`
- Admin: `/dashboard/admin/*`

`DashboardLayout` attaches `data-required-role` to the dashboard shell. Later middleware or a client/session provider can use the same route map to enforce permissions.

## Future Backend Auth Flow

1. Django/DRF returns authenticated user and role.
2. Frontend stores session through the chosen auth strategy.
3. Middleware or route guards check `getRequiredDashboardRole(pathname)`.
4. If unauthenticated, redirect to `/login`.
5. If authenticated with the wrong role, redirect to the correct dashboard or show an access-denied state.

## Current Frontend Behavior

- Login/register use `authApi` and redirect to the role dashboard with mock session data.
- Dashboard routes are not blocked yet.
- The route map is ready for backend enforcement.
