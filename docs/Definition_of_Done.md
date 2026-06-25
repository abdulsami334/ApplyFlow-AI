# ApplyFlow AI - Agile Working Agreements

## Definition of Ready

A backlog item is ready for sprint planning when:

- Business value is clearly stated.
- User story follows a user/value format or has an equivalent technical outcome.
- Acceptance criteria are testable.
- Dependencies are identified.
- Required backend/frontend API contracts are known.
- Story has a priority and story point estimate.
- Design expectations are clear for UI work.
- No unresolved blocker prevents implementation.
- Security implications are understood for auth, JWT, user data, and AI features.

## Definition of Done

A backlog item is done when:

- All acceptance criteria are met.
- No backend API contract is changed unless explicitly approved.
- Frontend uses real backend APIs only.
- No mock data is used in production paths.
- TypeScript build passes for frontend work.
- Lint passes for frontend work.
- Backend build and tests pass for backend work.
- Protected routes and JWT flows still work.
- Loading, error, and empty states are handled where applicable.
- Responsive behavior is verified for mobile, tablet, laptop, desktop, and large screens when UI is affected.
- Swagger/API validation is completed for backend endpoints.
- Manual smoke testing is completed for affected user journeys.
- Documentation or Jira notes are updated.
- Product Owner acceptance is recorded.

## Sprint Goal Template

```text
Sprint [Number] Goal:
Deliver [business outcome] by completing [major capabilities] while preserving [critical constraints].

Success Measure:
- [Measurable outcome 1]
- [Measurable outcome 2]
- [Quality outcome]
```

## Sprint Review Checklist

- Confirm sprint goal outcome.
- Demonstrate completed stories using working software.
- Show completed acceptance criteria.
- Review open defects or known limitations.
- Confirm no backend contract regressions.
- Confirm real API integration where required.
- Review responsive UI behavior for UI stories.
- Review test evidence.
- Confirm release/version impact.
- Capture stakeholder feedback.
- Update backlog priorities if needed.

## Sprint Retrospective Template

### What went well?

- Team collaboration:
- Technical execution:
- Quality/testing:
- Product clarity:

### What did not go well?

- Blockers:
- Rework:
- Missing information:
- Process gaps:

### What should we improve next sprint?

- Action item 1:
- Action item 2:
- Action item 3:

### Owners and Follow-up

| Action | Owner | Due Date | Status |
| --- | --- | --- | --- |
| TBD | TBD | TBD | Open |

## Daily Scrum Template

Each team member answers:

1. What did I complete since the last Daily Scrum?
2. What will I work on next?
3. What blockers or risks need attention?
4. Is any Jira issue status, estimate, or dependency incorrect?

Scrum Master checks:

- Blockers requiring escalation.
- Dependencies between backend/frontend/design/testing.
- Work in progress limits.
- Stories at risk of missing sprint goal.

## Product Increment Definition

The product increment is releasable when:

- All included stories are Done.
- Integrated frontend/backend flows work together.
- Authentication and authorization are not regressed.
- Application CRUD remains functional.
- Dashboard APIs and UI remain functional.
- New UI is responsive and accessible enough for MVP usage.
- Deployment configuration is documented if the increment is release-bound.
- Product Owner accepts the increment.

## Testing Checklist

### Backend

- Register API works.
- Login API works.
- JWT token is generated and validated.
- `GET /api/users/me` works with valid token.
- Protected APIs reject missing/invalid token.
- Application create works.
- Application list returns user-owned records.
- Application details works.
- Application update works.
- Application delete works.
- Dashboard summary works.
- Status distribution works.
- Monthly stats works.
- Swagger validation passes.
- Backend tests pass.

### Frontend

- Login page renders.
- Register page renders.
- Login submits to backend.
- Register submits to backend.
- JWT session persists.
- Logout clears session.
- Protected routes redirect unauthenticated users.
- Dashboard loads real API data.
- Applications list loads real API data.
- Create application works.
- Edit application works.
- Delete application works.
- Loading states display.
- Error states display.
- Empty states display.

### UI/UX

- Sidebar remains fixed on desktop.
- Main content scrolls independently.
- Mobile navigation works.
- Dashboard is responsive.
- Applications table works on desktop.
- Applications card layout works on mobile.
- Forms are usable on mobile.
- Buttons and actions are clear.
- Status badges are readable.
- No layout overlap or clipping is observed.

### Kanban

- `/applications/board` route loads.
- Board shows all six status columns.
- Applications are grouped correctly.
- Dragging card to new column updates UI.
- Drop action calls backend update API.
- Failed update rolls back or shows error.
- Existing `/applications` table page still works.

### Deployment

- Frontend production build passes.
- Backend production build passes.
- Environment variables are configured.
- Database migrations are applied.
- Authentication works in deployed environment.
- CRUD works in deployed environment.
- Dashboard APIs work in deployed environment.
