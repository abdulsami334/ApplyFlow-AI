# ApplyFlow AI - Sprint Planning

Planning basis:

- Current completed backend and frontend MVP are treated as completed release work.
- Sprint 1 focuses on approved Premium SaaS UI work and Kanban board.
- Sprint 2 focuses on advanced application management plus resume/reminder foundations.
- Sprint 3 focuses on approved AI roadmap and deployment.

## Capacity Assumption

The point totals below are realistic for a small cross-functional delivery team when some completed work is already available and stories are sliced by feature value. If the team velocity is lower than the sprint total, stories should be split further during refinement.

## Sprint 1 - Premium MVP Experience

**Sprint Goal:** Turn the current MVP into a polished, responsive SaaS dashboard and add a real Kanban board without changing backend API contracts.

| Story | Summary | Points | Priority | Why This Sprint |
| --- | --- | ---: | --- | --- |
| AF-ST-011 | Premium App Shell and Fixed Sidebar | 8 | Highest | Fixes a core UX defect where sidebar scrolls with content and establishes the layout foundation for all protected pages. |
| AF-ST-012 | Premium Login and Register UI | 5 | High | Improves first impression and trust while preserving completed auth integration. |
| AF-ST-013 | Dashboard UI Redesign | 8 | Highest | Dashboard is the primary landing area after login and must communicate product value clearly. |
| AF-ST-014 | Applications Page Redesign | 8 | Highest | Application tracking is the core workflow; responsive table/card behavior is required before expanding features. |
| AF-ST-015 | Kanban Board | 13 | Highest | Adds the approved board workflow using current GET and PUT application APIs, increasing product usefulness without backend redesign. |

**Total Story Points:** 42

**Dependencies Managed**

- Uses completed backend auth, application CRUD, and dashboard APIs.
- Uses completed frontend auth, dashboard, and application CRUD.
- No new backend API is required.

**Sprint 1 Review Outcomes**

- Fixed desktop sidebar.
- Responsive mobile navigation.
- Premium login/register.
- Premium dashboard.
- Responsive applications workspace.
- `/applications/board` with drag-and-drop status update.

## Sprint 2 - Productivity and Organization

**Sprint Goal:** Improve application discovery and begin document/reminder workflows from the approved roadmap.

| Story | Summary | Points | Priority | Why This Sprint |
| --- | --- | ---: | --- | --- |
| AF-ST-016 | Enhanced Search, Filter, and Sort | 8 | High | Builds directly on the redesigned applications page and improves daily user efficiency. |
| AF-ST-017 | Pagination or Result Chunking | 5 | Medium | Supports larger application lists after search/filter/sort improvements. |
| AF-ST-018 | Resume Upload | 8 | Medium | Starts the Resume Manager roadmap before AI features that depend on resume data. |
| AF-ST-019 | Resume Management | 5 | Medium | Completes the basic resume manager lifecycle after upload. |
| AF-ST-020 | Interview and Follow-Up Reminders | 8 | Medium | Expands current application tracking into time-based workflow support. |

**Total Story Points:** 34

**Dependencies Managed**

- Resume AI features are intentionally deferred until resume upload/management exists.
- Reminder work must align with existing application fields or an approved data model.
- Search/filter/sort remains scoped to existing application data unless a backend query contract is explicitly approved later.

**Sprint 2 Review Outcomes**

- Improved application discoverability.
- Large-list handling.
- Resume manager foundation.
- Reminder/follow-up visibility.

## Sprint 3 - AI and Production Release

**Sprint Goal:** Add approved AI capabilities and prepare ApplyFlow AI for production deployment.

| Story | Summary | Points | Priority | Why This Sprint |
| --- | --- | ---: | --- | --- |
| AF-ST-021 | AI Resume Analyzer | 13 | Medium | Depends on Resume Manager and starts AI roadmap with the most direct resume use case. |
| AF-ST-022 | AI Job Match Scoring | 13 | Medium | Uses resume and application data after resume analyzer foundation exists. |
| AF-ST-023 | AI Career Assistant | 13 | Low | Adds guidance experience after core AI and scoring foundations. |
| AF-ST-024 | Frontend Deployment | 5 | High | Required for production release of the completed frontend. |
| AF-ST-025 | Backend Deployment | 8 | High | Required for production release of backend APIs, database, migrations, and JWT configuration. |

**Total Story Points:** 52

**Dependencies Managed**

- AI stories require approved AI API contracts and data handling rules before implementation.
- Deployment stories depend on completed MVP and Sprint 1 UX improvements.
- Backend deployment must complete before final production frontend verification.

**Sprint 3 Review Outcomes**

- AI resume analysis.
- AI job match scoring.
- AI career assistant.
- Production-ready frontend and backend deployment plan.

## Completed Work Outside Active Sprints

| Story | Summary | Release |
| --- | --- | --- |
| AF-ST-001 | User Registration API | v0.1 |
| AF-ST-002 | User Login API | v0.1 |
| AF-ST-003 | Current User Profile API | v0.1 |
| AF-ST-004 | Application CRUD APIs | v0.1 |
| AF-ST-005 | Dashboard APIs | v0.1 |
| AF-ST-006 | Backend Swagger and Service Testing | v0.1 |
| AF-ST-007 | Frontend Authentication | v0.2 |
| AF-ST-008 | Protected Frontend Routes | v0.2 |
| AF-ST-009 | Frontend Dashboard MVP | v0.2 |
| AF-ST-010 | Frontend Application CRUD MVP | v0.2 |
