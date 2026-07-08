# ApplyFlow AI LinkedIn Carousel Assets

Generated from the repository implementation and documentation.

## Accuracy notes

- Resume/job matching is implemented as deterministic keyword extraction and match scoring in `ApplicationMatchService.cs`; this asset set does not claim TF-IDF is implemented.
- The QA slide uses the documented QA report value: 21/21 tests passing. The current backend suite also contains xUnit tests for auth, applications, dashboard, resumes, and match analysis.
- Migration slides are based on `scripts/migrate-legacy-applications.ps1`, which imports pipe-delimited legacy rows, normalizes fields, creates users through the API, and inserts applications into PostgreSQL.
- Roadmap features are marked as future roadmap, not current implementation.

## Files

- `svg/01-cover-image.svg` and `png/01-cover-image.png` - slide 1
- `svg/02-problem-statement.svg` and `png/02-problem-statement.png` - slide 2
- `svg/03-modern-architecture.svg` and `png/03-modern-architecture.png` - slide 3
- `svg/04-legacy-modernization-flow.svg` and `png/04-legacy-modernization-flow.png` - slide 4
- `svg/05-resume-match-workflow.svg` and `png/05-resume-match-workflow.png` - slide 5
- `svg/06-application-workflow.svg` and `png/06-application-workflow.png` - slide 6
- `svg/07-dashboard-showcase.svg` and `png/07-dashboard-showcase.png` - slide 7
- `svg/08-kanban-board.svg` and `png/08-kanban-board.png` - slide 8
- `svg/09-resume-analysis-screen.svg` and `png/09-resume-analysis-screen.png` - slide 9
- `svg/10-testing-engineering.svg` and `png/10-testing-engineering.png` - slide 10
- `svg/11-biggest-engineering-challenge.svg` and `png/11-biggest-engineering-challenge.png` - slide 11
- `svg/12-future-roadmap.svg` and `png/12-future-roadmap.png` - slide 12
- `svg/13-repository-banner.svg` and `png/13-repository-banner.png` - slide 13
- `svg/14-linkedin-thumbnail.svg` and `png/14-linkedin-thumbnail.png` - slide 14

## Theme

Dark enterprise style, blue/purple accents, 16:9 ratio, 1920x1080.
