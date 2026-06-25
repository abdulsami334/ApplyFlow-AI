# ApplyFlow AI - Release Roadmap

## Phase Roadmap

| Phase | Name | Scope | Outcome |
| --- | --- | --- | --- |
| Phase 1 | Backend MVP | Authentication, JWT, users/me, application CRUD APIs, dashboard APIs, PostgreSQL, EF Core migrations, Swagger, service tests | Backend can securely support the MVP frontend. |
| Phase 2 | Frontend MVP | Next.js frontend, AuthContext, Axios, login/register, protected routes, dashboard, application CRUD | Users can authenticate and manage applications through the browser. |
| Phase 3 | Premium SaaS UI | Premium visual redesign, responsive fixes, fixed sidebar, dashboard UI, applications UI, Kanban board | MVP becomes product-ready and easier to use across screen sizes. |
| Phase 4 | Advanced Application Management | Search/filter/sort, result management, improved large-list usability | Users can manage larger pipelines efficiently. |
| Phase 5 | Resume Manager | Resume upload and resume management | Resume data foundation exists for future AI features. |
| Phase 6 | AI Features | AI resume analyzer, AI job match scoring, AI career assistant | Approved AI capabilities are available on top of resume/application data. |
| Phase 7 | Deployment | Frontend deployment, backend deployment, production configuration, migrations, smoke tests | ApplyFlow AI is ready for production access. |

## Version Plan

### v0.1 - Backend MVP

**Delivered**

- User registration API.
- User login API.
- JWT authentication and authorization.
- Current user profile endpoint.
- Application CRUD APIs.
- Dashboard summary, status distribution, and monthly stats APIs.
- PostgreSQL persistence with EF Core.
- Swagger development testing.
- Service-layer tests.

**Primary Value**

- Establishes secure backend platform and API contract.

### v0.2 - Frontend MVP

**Delivered**

- Next.js 15 frontend foundation.
- Axios client with JWT interceptor.
- AuthContext and JWT storage flow.
- Login page.
- Register page.
- Protected routes.
- Dashboard page connected to dashboard APIs.
- Applications page and create/edit/delete workflows connected to backend APIs.

**Primary Value**

- Users can operate the core application workflow end to end.

### v0.3 - Premium SaaS UI

**Delivered / Planned**

- Premium SaaS dashboard shell.
- Fixed sidebar and scrollable content layout.
- Responsive mobile navigation.
- Improved login/register UI.
- Improved dashboard metric cards and chart layout.
- Improved applications table and mobile card layout.
- Kanban board at `/applications/board`.
- Drag-and-drop status updates through existing application update API.

**Primary Value**

- Converts functional MVP into a polished, professional product experience.

### v1.0 - Production Candidate

**Delivered / Planned**

- Enhanced search, filter, and sort.
- Result management for larger lists.
- Resume upload and resume management.
- Interview/follow-up reminders.
- AI resume analyzer.
- AI job match scoring.
- AI career assistant.
- Frontend deployment.
- Backend deployment.
- Production smoke testing.

**Primary Value**

- Completes the approved roadmap and prepares ApplyFlow AI for real production usage.

## Release Governance

- A release cannot be marked complete unless linked stories meet Definition of Done.
- Production releases require successful frontend build, backend build/test, migration check, and smoke test.
- AI release work requires approved AI API contracts before implementation starts.
- Deployment release work requires documented environment variables and secret handling.
