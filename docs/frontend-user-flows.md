# PropertyFlow AI Frontend User Flows

## Purpose

This document tracks the frontend-only user flows currently completed before
backend development. These flows use mock data, local React state, forms,
drawers, links, loading states, empty states, and success/error feedback. No
real backend, API persistence, or database logic is connected yet.

## Public Website Flows

Completed public navigation:

- Home to properties
- Home to agents
- Home to insights
- Home to login/register
- Navbar public navigation
- Footer public navigation
- Property listing to property detail
- Agent listing to agent detail
- Back to properties from property detail
- Back to agents from agent detail

Completed public mock actions:

- Property detail contact agent drawer
- Property detail schedule viewing drawer
- Property detail save property local toggle
- Agent detail send message drawer
- Agent detail callback request drawer
- Agent detail schedule advisory drawer
- Agent detail email link
- Contact form frontend validation and success state
- Login form frontend validation, demo role selection, and redirect readiness
- Register form frontend validation and redirect readiness

Backend-only later:

- Real public search from database
- Real property save persistence
- Real inquiry creation
- Real viewing scheduling
- Real contact routing
- Real authentication

## User Dashboard Flows

Completed user dashboard navigation:

- User overview to saved properties
- User overview to inquiries
- User overview to appointments
- User overview to recommendations
- User sidebar navigation
- User profile navigation

Completed user dashboard mock actions:

- Saved properties search/filter
- Saved property view navigation
- Saved property schedule navigation
- User inquiries search/filter
- User inquiry open-chat drawer
- User inquiry archive drawer
- User appointment reschedule drawer
- User appointment message-agent drawer
- User appointment property detail navigation
- User recommendation refresh local action
- User recommendation property cards
- User profile save state

Backend-only later:

- Persisted saved properties
- Saved property remove/compare persistence
- Real inquiry messages
- Real appointment calendar
- Real AI recommendation refresh
- Real profile persistence

## Agent Dashboard Flows

Completed agent dashboard navigation:

- Agent overview to listings
- Agent overview to inquiries
- Agent overview to appointments
- Agent overview to analytics
- Agent sidebar navigation
- Agent profile navigation

Completed agent dashboard mock actions:

- Add listing drawer
- Listing search/filter
- Listing edit drawer
- Listing analytics navigation
- Listing public detail navigation
- Lead call drawer
- Lead reply drawer
- Lead schedule drawer
- Appointment add viewing drawer
- Appointment prepare brief drawer
- Appointment message client drawer
- Appointment reschedule drawer
- Agent profile save state
- Analytics chart readiness state

Backend-only later:

- Real listing creation/update
- Real lead messaging
- Real call logging
- Real appointment scheduling
- Real analytics datasets
- Real agent profile persistence

## Admin Dashboard Flows

Completed admin dashboard navigation:

- Admin overview to inquiry review
- Admin overview to properties
- Admin overview to users
- Admin overview to analytics
- Admin sidebar navigation
- Admin settings navigation

Completed admin dashboard mock actions:

- Add property drawer
- Property review drawer
- Property rules drawer
- Agent verification queue drawer
- Agent review drawer
- Agent public profile navigation
- Agent manage listings navigation
- User access rules drawer
- User profile review drawer
- User activity drawer
- User permissions drawer
- Admin inquiries search/filter
- Admin inquiry review drawer
- Admin inquiry assign drawer
- Admin inquiry resolve drawer
- Admin analytics chart readiness state
- Settings save defaults drawer
- Settings notification channels drawer
- Settings governance review drawer

Backend-only later:

- Real moderation workflow
- Real approval persistence
- Real agent verification documents
- Real user permission updates
- Real inquiry escalation workflow
- Real admin analytics
- Real platform settings persistence

## System Flows

Completed:

- Global loading route
- Dashboard loading route
- Global error route
- Dashboard error route
- Not-found page
- Access-denied readiness page

Future backend/auth behavior:

- Redirect unauthenticated users to login
- Redirect wrong-role users to `/dashboard/access-denied`
- Attach dashboard routes to real user sessions
- Enforce role-based permissions on the backend

## QA Notes

Recommended final frontend QA before backend:

- Click every navbar and footer link.
- Click every dashboard sidebar link.
- Open every dashboard drawer action.
- Submit each major form once.
- Test searches with matching and non-matching terms.
- Review 390px, 430px, 768px, and desktop widths.
- Check image loading on public property and agent pages.
- Check that no route produces a 404 except intentionally invalid slugs.
