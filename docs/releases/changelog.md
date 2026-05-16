# Changelog

## v1.0.0-beta — C0 Foundation Complete (2026-05-16)

### Added
- **Lead model + full CRUD** (10 API endpoints): create, read, update, delete, search, bulk delete, bulk status, convert to opportunity
- **Opportunity model + full CRUD** (6 API endpoints): create, read, update, delete, stage update, stage filter
- **Quote model + full CRUD** (5 API endpoints): create, read, update, delete, status filter
- **Dashboard endpoint** with aggregate stats: lead counts, pipeline value, win rate, by-stage breakdown, recent leads
- **Alembic migration** `e263dba2c9bd_initial_models` — 3 tables with FKs and cascade rules
- **28 backend tests** — 100% passing across leads, opportunities, quotes, dashboard
- **Dashboard page** — summary cards, pipeline by stage, recent leads
- **Lead list page** — searchable table with status filter, pagination, bulk actions
- **Lead detail page** — view/edit, convert to opportunity, related opportunities
- **Opportunities Kanban** — drag-and-drop stage columns with search
- **Opportunity detail page** — view/edit, advance stage, related quotes
- **Quotes list page** — status filter pills, Send/Accept/Reject actions
- **Sidebar navigation** — Dashboard, Leads, Opportunities, Quotes
- **Typed API client** (`src/lib/api.ts`) — full TypeScript types for all entities
- **Knowledge graph** (`knowledge/`) — Obsidian-compatible vault for multi-agent tracking
- **plan_v1.3.md** — YC gap analysis + complexity-ranked roadmap

### Fixed
- Port mismatches: backend Dockerfile (8095→8104), frontend Dockerfile (3006→3017)
- Mock data removed from `sales.py` — all endpoints now hit real PostgreSQL
- Router wiring in `main.py` — 5 routers connected
- Test database config — `dclaw_sales_test` with `TEST_DATABASE_URL` env override
- Alembic model discovery — models imported in `app/models/__init__.py` and `env.py`

### Changed
- README.md — transformed from scaffold template to project-specific README
- Docker healthchecks all passing (3 services green)
- `backend/.gitignore` — alembic versions no longer ignored (migrations must be committed)

---

## v0.1.0 — Initial Scaffold

### Added
- Initial scaffold with Next.js frontend and FastAPI backend
- Dashboard with mock data endpoints
- Helm chart for Kubernetes deployment
- Basic documentation structure ence
