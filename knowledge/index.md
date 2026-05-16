# DClaw Sales — Knowledge Graph Index

> **Central hub for multi-agent development tracking.**
> This vault tracks architecture decisions, feature status, and agent coordination.

---

## Current State

- **Version:** 1.0.0-beta
- **YC Readiness:** 40/100 (C0 complete)
- **Tests:** 28 passing
- **Endpoints:** 17 live
- **Docker:** 3 services healthy

---

## Core Documents

| Document | Purpose | Last Updated |
|----------|---------|-------------|
| [[plan-v1.3]] | Strategic roadmap + YC gap analysis | 2026-05-16 |
| [[architecture]] | System architecture + tech stack | 2026-05-16 |
| [[entities]] | Data model: Lead, Opportunity, Quote | 2026-05-16 |
| [[api-reference]] | API endpoint catalog | 2026-05-16 |
| [[frontend-routes]] | Frontend page map | 2026-05-16 |
| [[testing]] | Test harness + coverage | 2026-05-16 |
| [[docker-infra]] | Docker/Helm deployment | 2026-05-16 |
| [[agent-rules]] | Anti-patterns + architecture locks | 2026-05-16 |
| [[progress-log]] | Development timeline + commits | 2026-05-16 |

---

## Feature Tracker

### C0 — Foundation ✅ Complete

| # | Feature | Status |
|---|---------|--------|
| C0.1 | Fix port mismatches | ✅ |
| C0.2 | Lead model + CRUD | ✅ |
| C0.3 | Opportunity model + CRUD | ✅ |
| C0.4 | Quote model + CRUD | ✅ |
| C0.5 | Wire V1 routers + remove mock data | ✅ |
| C0.6 | Alembic migration | ✅ |
| C0.7 | Dashboard page | ✅ |
| C0.8 | Fix test database | ✅ |
| C0.9 | Docker compose validation | ✅ |

### C1 — Core Differentiators 🔜

| # | Feature | Status |
|---|---------|--------|
| C1.1 | Pipeline Kanban board | ✅ Done (drag-drop live) |
| C1.2 | Lead scoring engine (rules-based) | 🔜 Next |
| C1.3 | Dashboard analytics (real) | ✅ Partially done |
| C1.4 | Lead → Opportunity conversion | ✅ Done |
| C1.5 | Bulk actions | ✅ Done |
| C1.6 | Search & advanced filters | ✅ Done |
| C1.7 | Activity timeline | 🔜 Next |

### C2 — AI Features 📋

| # | Feature | Status |
|---|---------|--------|
| C2.1 | AI prospect research agent | 📋 |
| C2.2 | AI email writer | 📋 |
| C2.3 | Outreach sequences | 📋 |
| C2.4 | ML-enhanced lead scoring | 📋 |
| C2.5 | Pipeline forecasting | 📋 |
| C2.6 | LinkedIn automation | 📋 |
| C2.7 | Call dialer + transcription | 📋 |

---

## Agent Coordination

### Active Branches
- `main` — Production branch (C0 shipped)

### Commit Convention
- `feat: description` — New features
- `docs: description` — Documentation
- `fix: description` — Bug fixes

### Agent Responsibility Matrix

| Layer | Primary Agent | Files Owned |
|-------|--------------|-------------|
| Backend models | Backend Architect | `app/models/` |
| Backend schemas | Backend Architect | `app/schemas/` |
| Backend repos | Backend Architect | `app/repositories/` |
| Backend routers | Backend Architect | `app/api/v1/` |
| Frontend pages | Frontend Builder | `src/app/` |
| Frontend components | Frontend Builder | `src/components/` |
| Frontend API client | Frontend Builder | `src/lib/api.ts` |
| Docker/Helm/CI | DevOps Engineer | `Dockerfile`, `docker-compose.yml`, `helm/`, `.github/` |
| Tests | QA Agent | `tests/` |

---

## Quick Links

- [[plan-v1.3|Full Roadmap]]
- [[architecture|System Architecture]]
- [[entities|Entity Model]]
- [[api-reference|API Reference]]
- [[agent-rules|Agent Rules (Anti-Patterns)]]
