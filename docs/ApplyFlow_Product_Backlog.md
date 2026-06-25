# ApplyFlow AI - Product Backlog

Source of truth:

- `BACKEND_MASTER_DOCUMENTATION.md`
- `FRONTEND_MASTER_DOCUMENTATION.md`
- Existing Jira Scrum Structure from the approved ApplyFlow AI backlog

This backlog documents only current implementation and the approved roadmap. It does not introduce unapproved features.

## Backlog Ordering

| Rank | Key | Epic | Feature | Story | Priority | Points | Sprint | Labels | Dependencies |
| --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| 1 | AF-ST-001 | Backend Foundation | Authentication API | As a new user, I want to register an account so that I can use ApplyFlow AI securely. | Highest | 5 | Completed / v0.1 | backend,authentication,jwt,security | None |
| 2 | AF-ST-002 | Backend Foundation | Authentication API | As a registered user, I want to log in so that I can access protected features. | Highest | 5 | Completed / v0.1 | backend,authentication,jwt,security | AF-ST-001 |
| 3 | AF-ST-003 | Backend Foundation | User Profile API | As an authenticated user, I want to retrieve my profile so that the frontend can restore my session. | Highest | 3 | Completed / v0.1 | backend,authentication,users | AF-ST-002 |
| 4 | AF-ST-004 | Backend Foundation | Application CRUD APIs | As a user, I want to create, view, update, and delete job applications so that I can track my job search. | Highest | 13 | Completed / v0.1 | backend,crud,applications,postgresql | AF-ST-002 |
| 5 | AF-ST-005 | Backend Foundation | Dashboard APIs | As a user, I want dashboard statistics so that I can understand my application pipeline. | High | 8 | Completed / v0.1 | backend,dashboard,analytics | AF-ST-004 |
| 6 | AF-ST-006 | Backend Foundation | API Testing | As a developer, I want Swagger and service tests so that backend behavior is verifiable. | High | 5 | Completed / v0.1 | backend,swagger,testing | AF-ST-001, AF-ST-004, AF-ST-005 |
| 7 | AF-ST-007 | Frontend MVP Foundation | Frontend Authentication | As a user, I want to register and log in from the frontend so that I can access my account. | Highest | 8 | Completed / v0.2 | frontend,authentication,jwt | AF-ST-001, AF-ST-002 |
| 8 | AF-ST-008 | Frontend MVP Foundation | Protected Routes | As an authenticated user, I want protected frontend routes so that private data is not visible without login. | Highest | 5 | Completed / v0.2 | frontend,authentication,routing | AF-ST-003, AF-ST-007 |
| 9 | AF-ST-009 | Frontend MVP Foundation | Dashboard UI | As a user, I want a frontend dashboard so that I can view my application summary. | High | 8 | Completed / v0.2 | frontend,dashboard,api-integration | AF-ST-005, AF-ST-008 |
| 10 | AF-ST-010 | Frontend MVP Foundation | Application CRUD UI | As a user, I want to manage applications from the frontend so that I can track opportunities in the browser. | Highest | 13 | Completed / v0.2 | frontend,crud,applications | AF-ST-004, AF-ST-008 |
| 11 | AF-ST-011 | Premium SaaS UI | App Shell | As a user, I want a professional SaaS shell with fixed sidebar so that navigation remains stable while content scrolls. | Highest | 8 | Sprint 1 / v0.3 | frontend,ui,ux,responsive,enhancement | AF-ST-008 |
| 12 | AF-ST-012 | Premium SaaS UI | Authentication UI | As a user, I want polished login and register screens so that the product feels trustworthy. | High | 5 | Sprint 1 / v0.3 | frontend,ui,authentication,responsive | AF-ST-007 |
| 13 | AF-ST-013 | Premium SaaS UI | Dashboard Redesign | As a user, I want a premium dashboard layout so that I can understand pipeline health quickly. | Highest | 8 | Sprint 1 / v0.3 | frontend,ui,dashboard,charts | AF-ST-009 |
| 14 | AF-ST-014 | Premium SaaS UI | Applications Page Redesign | As a user, I want a clean responsive applications page so that I can manage applications efficiently. | Highest | 8 | Sprint 1 / v0.3 | frontend,ui,applications,responsive | AF-ST-010 |
| 15 | AF-ST-015 | Premium SaaS UI | Kanban Board | As a user, I want a Kanban board so that I can move applications between statuses visually. | Highest | 13 | Sprint 1 / v0.3 | frontend,kanban,applications,api-integration | AF-ST-004, AF-ST-010, AF-ST-011 |
| 16 | AF-ST-016 | Advanced Application Management | Search Filter Sort | As a user, I want enhanced search, filters, and sorting so that I can find applications faster. | High | 8 | Sprint 2 / v1.0 | frontend,search,filters,sort,applications | AF-ST-014 |
| 17 | AF-ST-017 | Advanced Application Management | Result Management | As a user with many applications, I want result pagination or chunking so that large lists remain usable. | Medium | 5 | Sprint 2 / v1.0 | frontend,applications,performance | AF-ST-016 |
| 18 | AF-ST-018 | Resume Manager | Resume Upload | As a user, I want to upload resumes so that I can organize job-search documents. | Medium | 8 | Sprint 2 / v1.0 | resume,frontend,backend | AF-ST-008 |
| 19 | AF-ST-019 | Resume Manager | Resume Management | As a user, I want to view and remove resumes so that my documents stay organized. | Medium | 5 | Sprint 2 / v1.0 | resume,crud,frontend,backend | AF-ST-018 |
| 20 | AF-ST-020 | Calendar and Reminders | Interview Reminders | As a user, I want follow-up and interview reminders so that I do not miss important dates. | Medium | 8 | Sprint 2 / v1.0 | calendar,reminders,applications | AF-ST-010 |
| 21 | AF-ST-021 | AI Features | Resume Analyzer | As a user, I want AI resume analysis so that I can improve my resume for applications. | Medium | 13 | Sprint 3 / v1.0 | ai,resume,enhancement | AF-ST-018 |
| 22 | AF-ST-022 | AI Features | Job Match Scoring | As a user, I want AI job match scoring so that I can prioritize the best opportunities. | Medium | 13 | Sprint 3 / v1.0 | ai,applications,scoring | AF-ST-018, AF-ST-021 |
| 23 | AF-ST-023 | AI Features | Career Assistant | As a user, I want an AI career assistant so that I can get job-search guidance. | Low | 13 | Sprint 3 / v1.0 | ai,assistant,frontend | AF-ST-021 |
| 24 | AF-ST-024 | Deployment | Frontend Deployment | As a stakeholder, I want the frontend deployed so users can access ApplyFlow AI. | High | 5 | Sprint 3 / v1.0 | deployment,frontend,release | AF-ST-011, AF-ST-014 |
| 25 | AF-ST-025 | Deployment | Backend Deployment | As a stakeholder, I want the backend deployed so frontend users can access APIs. | High | 8 | Sprint 3 / v1.0 | deployment,backend,postgresql,release | AF-ST-001 through AF-ST-006 |

## Backlog Details

### AF-ST-001 - User Registration API

- **Epic:** Backend Foundation
- **Feature:** Authentication API
- **Priority:** Highest
- **Story Points:** 5
- **Sprint:** Completed / v0.1
- **Dependencies:** None
- **Labels:** backend, authentication, jwt, security

**Acceptance Criteria**

- `POST /api/auth/register` creates a user.
- Duplicate email registration is rejected.
- Password is hashed with the implemented password hashing approach.
- JWT token and user response are returned on success.
- Swagger can validate the endpoint.

**Definition of Done**

- Service implementation exists.
- Controller endpoint exists.
- DTOs are used for request/response.
- Unit or Swagger validation is completed.
- No plaintext password is persisted.

### AF-ST-002 - User Login API

- **Epic:** Backend Foundation
- **Feature:** Authentication API
- **Priority:** Highest
- **Story Points:** 5
- **Sprint:** Completed / v0.1
- **Dependencies:** AF-ST-001
- **Labels:** backend, authentication, jwt, security

**Acceptance Criteria**

- `POST /api/auth/login` authenticates valid credentials.
- Invalid credentials return an appropriate error.
- JWT token and user response are returned on success.
- Token can access protected endpoints.

**Definition of Done**

- Login service validates user by email.
- Password verification works.
- JWT generation uses configured issuer, audience, expiry, and signing key.
- Swagger validation is completed.

### AF-ST-003 - Current User Profile API

- **Epic:** Backend Foundation
- **Feature:** User Profile API
- **Priority:** Highest
- **Story Points:** 3
- **Sprint:** Completed / v0.1
- **Dependencies:** AF-ST-002
- **Labels:** backend, authentication, users

**Acceptance Criteria**

- `GET /api/users/me` requires JWT.
- Endpoint returns the authenticated user profile.
- Missing or invalid token is rejected.

**Definition of Done**

- Controller extracts user identity from JWT claims.
- User response DTO is returned.
- Protected route behavior is verified.

### AF-ST-004 - Application CRUD APIs

- **Epic:** Backend Foundation
- **Feature:** Application CRUD APIs
- **Priority:** Highest
- **Story Points:** 13
- **Sprint:** Completed / v0.1
- **Dependencies:** AF-ST-002
- **Labels:** backend, crud, applications, postgresql

**Acceptance Criteria**

- `POST /api/applications` creates an application for the authenticated user.
- `GET /api/applications` returns only the authenticated user's applications.
- `GET /api/applications/{id}` returns one authorized application.
- `PUT /api/applications/{id}` updates authorized application data.
- `DELETE /api/applications/{id}` deletes an authorized application.
- Advanced application fields documented in the backend are supported.

**Definition of Done**

- Controller, service, DTOs, model, DbContext, and migrations are aligned.
- Authorization filtering prevents cross-user access.
- Swagger validation passes.
- Service tests cover application behavior.

### AF-ST-005 - Dashboard APIs

- **Epic:** Backend Foundation
- **Feature:** Dashboard APIs
- **Priority:** High
- **Story Points:** 8
- **Sprint:** Completed / v0.1
- **Dependencies:** AF-ST-004
- **Labels:** backend, dashboard, analytics

**Acceptance Criteria**

- `GET /api/dashboard/summary` returns current user summary counts.
- `GET /api/dashboard/status-distribution` returns status counts.
- `GET /api/dashboard/monthly-stats` returns monthly statistics.
- Dashboard APIs require JWT authentication.

**Definition of Done**

- Dashboard service aggregates from persisted applications.
- Dashboard DTOs are returned.
- Tests validate dashboard calculations.

### AF-ST-006 - Backend Swagger and Service Testing

- **Epic:** Backend Foundation
- **Feature:** API Testing
- **Priority:** High
- **Story Points:** 5
- **Sprint:** Completed / v0.1
- **Dependencies:** AF-ST-001, AF-ST-004, AF-ST-005
- **Labels:** backend, swagger, testing

**Acceptance Criteria**

- Swagger/OpenAPI is available in development.
- JWT bearer security is represented in Swagger.
- Service-layer unit tests exist for current service responsibilities.
- Backend build and test commands pass.

**Definition of Done**

- Tests are part of the backend test project.
- Swagger can execute verified APIs.
- Test structure is documented.

### AF-ST-007 - Frontend Authentication

- **Epic:** Frontend MVP Foundation
- **Feature:** Frontend Authentication
- **Priority:** Highest
- **Story Points:** 8
- **Sprint:** Completed / v0.2
- **Dependencies:** AF-ST-001, AF-ST-002
- **Labels:** frontend, authentication, jwt

**Acceptance Criteria**

- Login page calls existing login API.
- Register page calls existing register API.
- JWT session is stored in `localStorage`.
- AuthContext manages user/session state.
- Errors and loading states are displayed.

**Definition of Done**

- No mock authentication is used.
- Axios client attaches bearer token.
- Auth flow works after refresh.

### AF-ST-008 - Protected Frontend Routes

- **Epic:** Frontend MVP Foundation
- **Feature:** Protected Routes
- **Priority:** Highest
- **Story Points:** 5
- **Sprint:** Completed / v0.2
- **Dependencies:** AF-ST-003, AF-ST-007
- **Labels:** frontend, authentication, routing

**Acceptance Criteria**

- Protected pages are wrapped by the protected layout.
- Unauthenticated users redirect to `/login`.
- Authenticated users can access dashboard and applications.
- Logout clears session and redirects to login.

**Definition of Done**

- Protected route flow matches frontend documentation.
- Browser smoke test validates redirect behavior.

### AF-ST-009 - Frontend Dashboard MVP

- **Epic:** Frontend MVP Foundation
- **Feature:** Dashboard UI
- **Priority:** High
- **Story Points:** 8
- **Sprint:** Completed / v0.2
- **Dependencies:** AF-ST-005, AF-ST-008
- **Labels:** frontend, dashboard, api-integration

**Acceptance Criteria**

- Dashboard calls current dashboard APIs.
- Summary cards render real data.
- Status distribution renders real data.
- Monthly stats render real data.
- Loading and error states exist.

**Definition of Done**

- Dashboard service module is used.
- No mock data is present.
- Frontend build passes.

### AF-ST-010 - Frontend Application CRUD MVP

- **Epic:** Frontend MVP Foundation
- **Feature:** Application CRUD UI
- **Priority:** Highest
- **Story Points:** 13
- **Sprint:** Completed / v0.2
- **Dependencies:** AF-ST-004, AF-ST-008
- **Labels:** frontend, crud, applications

**Acceptance Criteria**

- Applications page lists real backend applications.
- Create application submits to backend.
- Edit application loads and updates one application.
- Delete action removes application through backend API.
- Loading, error, and empty states exist.

**Definition of Done**

- Application service module is used.
- DTO-aligned TypeScript interfaces are used.
- No mock application data is present.

### AF-ST-011 - Premium App Shell and Fixed Sidebar

- **Epic:** Premium SaaS UI
- **Feature:** App Shell
- **Priority:** Highest
- **Story Points:** 8
- **Sprint:** Sprint 1 / v0.3
- **Dependencies:** AF-ST-008
- **Labels:** frontend, ui, ux, responsive, enhancement

**Acceptance Criteria**

- Desktop sidebar remains fixed while content scrolls.
- Main content is the only scrolling area in desktop app layout.
- Mobile navigation exposes primary destinations.
- Sidebar and content work on mobile, tablet, laptop, desktop, and large screens.

**Definition of Done**

- Layout is verified across breakpoints.
- AuthContext and route protection remain unchanged.
- Lint and build pass.

### AF-ST-012 - Premium Login and Register UI

- **Epic:** Premium SaaS UI
- **Feature:** Authentication UI
- **Priority:** High
- **Story Points:** 5
- **Sprint:** Sprint 1 / v0.3
- **Dependencies:** AF-ST-007
- **Labels:** frontend, ui, authentication, responsive

**Acceptance Criteria**

- Login page has polished SaaS visual design.
- Register page has polished SaaS visual design.
- Existing authentication APIs and AuthContext are preserved.
- Mobile layouts are usable.

**Definition of Done**

- Form behavior is unchanged.
- Error and loading states remain visible.
- Browser smoke test verifies rendering.

### AF-ST-013 - Dashboard UI Redesign

- **Epic:** Premium SaaS UI
- **Feature:** Dashboard Redesign
- **Priority:** Highest
- **Story Points:** 8
- **Sprint:** Sprint 1 / v0.3
- **Dependencies:** AF-ST-009
- **Labels:** frontend, ui, dashboard, charts

**Acceptance Criteria**

- Dashboard hero improves visual hierarchy.
- Metric cards are responsive and readable.
- Status and monthly charts use existing dashboard APIs only.
- Empty/loading/error states are improved.

**Definition of Done**

- No API contract changes.
- Dashboard remains backed by real API data.
- Responsive testing is completed.

### AF-ST-014 - Applications Page Redesign

- **Epic:** Premium SaaS UI
- **Feature:** Applications Page Redesign
- **Priority:** Highest
- **Story Points:** 8
- **Sprint:** Sprint 1 / v0.3
- **Dependencies:** AF-ST-010
- **Labels:** frontend, ui, applications, responsive

**Acceptance Criteria**

- Applications page has improved page header and spacing.
- Search/filter area is responsive.
- Desktop table remains usable.
- Mobile card layout avoids table-only horizontal scrolling.
- Status badges use clear visual states.

**Definition of Done**

- Existing CRUD flows still work.
- Delete confirmation behavior remains.
- Lint and build pass.

### AF-ST-015 - Kanban Board

- **Epic:** Premium SaaS UI
- **Feature:** Kanban Board
- **Priority:** Highest
- **Story Points:** 13
- **Sprint:** Sprint 1 / v0.3
- **Dependencies:** AF-ST-004, AF-ST-010, AF-ST-011
- **Labels:** frontend, kanban, applications, api-integration

**Acceptance Criteria**

- `/applications/board` route exists.
- Columns are Applied, Screening, Interview, Offer, Rejected, and Withdrawn.
- Board loads real data from existing application API.
- Drag-and-drop updates status through existing `PUT /api/applications/{id}` API.
- Failed status updates show an error or rollback.
- Existing `/applications` table page continues to work.

**Definition of Done**

- No new backend endpoint is required.
- No mock data is used.
- Drag/drop behavior is manually verified.
- Lint and build pass.

### AF-ST-016 - Enhanced Search, Filter, and Sort

- **Epic:** Advanced Application Management
- **Feature:** Search Filter Sort
- **Priority:** High
- **Story Points:** 8
- **Sprint:** Sprint 2 / v1.0
- **Dependencies:** AF-ST-014
- **Labels:** frontend, search, filters, sort, applications

**Acceptance Criteria**

- Search covers company, role, location, source, contact, and notes.
- Filters support status, job type, work mode, and source.
- Sort supports application date, company, status, and follow-up date.
- No mock data is used.

**Definition of Done**

- Search/filter/sort combinations are tested.
- Empty results state is present.
- Existing CRUD behavior remains unchanged.

### AF-ST-017 - Pagination or Result Chunking

- **Epic:** Advanced Application Management
- **Feature:** Result Management
- **Priority:** Medium
- **Story Points:** 5
- **Sprint:** Sprint 2 / v1.0
- **Dependencies:** AF-ST-016
- **Labels:** frontend, applications, performance

**Acceptance Criteria**

- Application list remains usable with larger data volume.
- Pagination or chunking controls are present if needed.
- Empty and last-page states are handled.

**Definition of Done**

- Approach is documented.
- Mobile and desktop behavior are tested.

### AF-ST-018 - Resume Upload

- **Epic:** Resume Manager
- **Feature:** Resume Upload
- **Priority:** Medium
- **Story Points:** 8
- **Sprint:** Sprint 2 / v1.0
- **Dependencies:** AF-ST-008
- **Labels:** resume, frontend, backend

**Acceptance Criteria**

- User can upload resume files.
- Uploaded resumes are associated with the authenticated user.
- File validation exists.
- Resume list displays uploaded files.
- No AI analysis is included in this story.

**Definition of Done**

- Backend and frontend contracts are documented before build.
- Upload failure states are handled.
- Access is protected by authentication.

### AF-ST-019 - Resume Management

- **Epic:** Resume Manager
- **Feature:** Resume Management
- **Priority:** Medium
- **Story Points:** 5
- **Sprint:** Sprint 2 / v1.0
- **Dependencies:** AF-ST-018
- **Labels:** resume, crud, frontend, backend

**Acceptance Criteria**

- User can view uploaded resumes.
- User can delete uploaded resumes.
- Resume records are scoped to authenticated user.

**Definition of Done**

- Delete confirmation exists.
- Resume list empty state exists.
- Unauthorized access is prevented.

### AF-ST-020 - Interview and Follow-Up Reminders

- **Epic:** Calendar and Reminders
- **Feature:** Interview Reminders
- **Priority:** Medium
- **Story Points:** 8
- **Sprint:** Sprint 2 / v1.0
- **Dependencies:** AF-ST-010
- **Labels:** calendar, reminders, applications

**Acceptance Criteria**

- Upcoming follow-up or interview reminders are visible.
- Reminder view uses application date fields or approved reminder data model.
- Dashboard can surface upcoming reminder information if supported by scope.

**Definition of Done**

- No unapproved notification provider is introduced.
- Existing application fields are not broken.
- Empty state is included.

### AF-ST-021 - AI Resume Analyzer

- **Epic:** AI Features
- **Feature:** Resume Analyzer
- **Priority:** Medium
- **Story Points:** 13
- **Sprint:** Sprint 3 / v1.0
- **Dependencies:** AF-ST-018
- **Labels:** ai, resume, enhancement

**Acceptance Criteria**

- User can select a resume for analysis.
- AI returns structured strengths, weaknesses, and suggestions.
- Result is displayed clearly.
- Existing resume manager remains intact.

**Definition of Done**

- AI API contract is approved before implementation.
- User data handling is documented.
- Loading and error states exist.

### AF-ST-022 - AI Job Match Scoring

- **Epic:** AI Features
- **Feature:** Job Match Scoring
- **Priority:** Medium
- **Story Points:** 13
- **Sprint:** Sprint 3 / v1.0
- **Dependencies:** AF-ST-018, AF-ST-021
- **Labels:** ai, applications, scoring

**Acceptance Criteria**

- User can compare resume data against job/application data.
- AI returns match score and explanation.
- Score is visible in an approved application experience.

**Definition of Done**

- AI scoring contract is approved.
- Score is explainable to user.
- Failures do not block existing CRUD workflows.

### AF-ST-023 - AI Career Assistant

- **Epic:** AI Features
- **Feature:** Career Assistant
- **Priority:** Low
- **Story Points:** 13
- **Sprint:** Sprint 3 / v1.0
- **Dependencies:** AF-ST-021
- **Labels:** ai, assistant, frontend

**Acceptance Criteria**

- User can ask career/job-search questions.
- Assistant response is shown in a chat-style UI.
- Assistant does not alter application data without user action.

**Definition of Done**

- Assistant scope is documented.
- Safety and error states are included.
- Existing workflows remain unaffected.

### AF-ST-024 - Frontend Deployment

- **Epic:** Deployment
- **Feature:** Frontend Deployment
- **Priority:** High
- **Story Points:** 5
- **Sprint:** Sprint 3 / v1.0
- **Dependencies:** AF-ST-011, AF-ST-014
- **Labels:** deployment, frontend, release

**Acceptance Criteria**

- Frontend production build passes.
- Environment variables are configured.
- Frontend connects to deployed backend.
- Protected routes work in production.

**Definition of Done**

- Deployment runbook is documented.
- Smoke test covers login, dashboard, applications, and board.

### AF-ST-025 - Backend Deployment

- **Epic:** Deployment
- **Feature:** Backend Deployment
- **Priority:** High
- **Story Points:** 8
- **Sprint:** Sprint 3 / v1.0
- **Dependencies:** AF-ST-001 through AF-ST-006
- **Labels:** deployment, backend, postgresql, release

**Acceptance Criteria**

- Backend deploys successfully.
- PostgreSQL connection works.
- JWT settings are configured securely.
- Migrations are applied.
- Core APIs pass smoke testing.

**Definition of Done**

- Production configuration is documented.
- Secrets are not committed.
- API smoke test results are recorded.

## Enterprise Backlog Improvements

### Missing Epics Added

- **Calendar and Reminders:** The approved roadmap included calendar/interview reminders, but it needed its own epic for governance and release planning.
- **Deployment:** Deployment existed as a future item but needed a dedicated epic with frontend and backend release stories.

### Missing Stories Added or Clarified

- **Current User Profile API:** Added as a distinct story because frontend session restoration depends on `GET /api/users/me`.
- **Backend Swagger and Service Testing:** Added to represent the completed Swagger and service test structure documented in the backend.
- **Pagination or Result Chunking:** Added under Advanced Application Management because search/filter/sort alone does not address larger user datasets.

### Missing Tasks Added

- Each story now has implementation tasks in the Jira CSV.
- Subtasks were added for validation, testing, documentation, and integration checks.

### Missing Acceptance Criteria Added

- Every story now includes testable acceptance criteria.
- Criteria explicitly protect existing API contracts, JWT flow, protected routing, real-data usage, and responsive behavior.

### Missing Dependencies Added

- Frontend authentication depends on backend auth APIs.
- Protected frontend routes depend on auth context and current user API.
- Dashboard frontend depends on dashboard backend APIs.
- Kanban board depends on application CRUD APIs and app shell navigation.
- AI stories depend on Resume Manager stories.
- Deployment depends on completed backend/frontend MVP capabilities.
