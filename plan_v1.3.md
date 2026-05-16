# DClaw Sales — plan_v1.3.md

> **Strategic roadmap with YC gap analysis, complexity-ranked features, and autonomous implementation plan.**
>
> **Supersedes:** `PLAN-v1.2.md`, `PATCH-2026-05-15-shared-hub-postgres.md` (now incorporated)
>
> **Date:** 2026-05-16
> **Status:** C0 Complete ✅ → C1 In Progress 🔜

---

## 1. Y Combinator Gap Analysis

### 1.1 The "Hair-on-Fire" Problem

Sales teams (SDRs, AEs, founders doing BD) waste **60%+ of their time** on non-selling activities:
- Manually researching prospects (LinkedIn stalking, company Googling)
- Writing repetitive cold emails from scratch
- Tracking deals across spreadsheets and sticky notes
- No unified view of pipeline health or conversion bottlenecks
- No way to know which leads are actually warm

**Market validation:** Apollo.io ($1.6B valuation), Clay ($500M+), Lavender (YC W22) all prove this space is white-hot. But they're either too expensive ($100+/seat), too complex, or missing the vertical-specific workflow that DClaw can own.

### 1.2 Where We Stand vs. YC Standard

| YC Criterion | Before (Scaffold) | After C0 | Target State |
|-------------|-------------------|----------|--------------|
| **Working MVP** | ❌ Scaffold with mock data, no real CRUD | ✅ Full CRUD on 3 entities, 17 endpoints | ✅ Full CRUD on all 3 entities |
| **Technical Moat** | ❌ No AI whatsoever | ⬜ Foundation ready for AI layer | ✅ AI research, email gen, lead scoring |
| **User Delight** | ❌ Placeholder page | ✅ Dashboard, Kanban, 6 interactive pages | ✅ Dashboard, Kanban, visual builder |
| **Scalability** | ⚠️ Docker setup has port bugs | ✅ Production-hardened, 3 healthy services | ✅ Production-hardened, multi-tenant ready |
| **Clear ICP** | ✅ Defined: Sales teams, AEs | ✅ Sharpened with ICP-specific workflows | ✅ Sharpened with ICP-specific workflows |
| **Launch Readiness** | ❌ No tests, broken Docker | ✅ 28 tests, green Docker | ✅ 70%+ coverage, green CI |
| **Differentiation** | ❌ Generic CRUD scaffold | ⬜ CRUD + pipeline live, AI pending | ✅ AI-first, vertical-specific sales OS |

**YC Readiness Score: 15/100 → 40/100 → Target: 85/100**

### 1.3 What Makes This YC-Worthy

1. **AI-First, Not AI-Wrapper**: Prospect research agent with real web scraping + LLM synthesis (not just a ChatGPT wrapper). Lead scoring with configurable ML model. Email generation with A/B testing built in.
2. **Vertical Depth**: Instead of generic CRM, this is purpose-built for outbound sales teams. Sequences, call tasks, LinkedIn steps — the workflow IS the product.
3. **Speed to Value**: A new user can research a prospect, generate a personalized email, and start a sequence in under 60 seconds. Competitors take 30+ minutes of setup.
4. **Technical Sophistication**: Async Python backend, real-time pipeline analytics, browser automation proxy, STT transcription — this is not a simple CRUD app.

---

## 2. Complexity Framework

| Tier | Label | Description |
|------|-------|-------------|
| **C0** | Foundation / Quick Wins | Core infra fixes, basic CRUD, deployment stability. Must be done first. |
| **C1** | Core Differentiators | Pipeline analytics, lead scoring engine, Kanban board, real-time dashboard. |
| **C2** | Advanced / AI Features | Prospect research agent, AI email writer, call transcription, LinkedIn automation. |

**Rule:** C0 must be 100% complete before C1 begins. C1 gates C2. No skipping tiers.

---

## 3. Feature Roadmap (Complexity-Ranked)

### C0 — Foundation & Core CRUD ✅ COMPLETE (2026-05-16)

| # | Feature | Status | Backend | Frontend | Tests |
|---|---------|--------|---------|----------|-------|
| C0.1 | **Fix Port Mismatches** | ✅ | Dockerfile PORTs: 8095→8104, 3006→3017 | — | `docker compose config` verified |
| C0.2 | **Lead Model + CRUD** | ✅ | `app/models/lead.py`, `app/schemas/lead.py`, `app/repositories/lead_repo.py`, `app/api/v1/leads.py` | `src/app/leads/page.tsx`, `src/app/leads/[id]/page.tsx` | 10 tests (CRUD + search + bulk + convert) |
| C0.3 | **Opportunity Model + CRUD** | ✅ | `app/models/opportunity.py`, `app/schemas/opportunity.py`, `app/repositories/opportunity_repo.py`, `app/api/v1/opportunities.py` | `src/app/opportunities/page.tsx` (Kanban), `src/app/opportunities/[id]/page.tsx` | 8 tests (CRUD + stage filter + stage update) |
| C0.4 | **Quote Model + CRUD** | ✅ | `app/models/quote.py`, `app/schemas/quote.py`, `app/repositories/quote_repo.py`, `app/api/v1/quotes.py` | `src/app/quotes/page.tsx`, `src/app/quotes/[id]/page.tsx` | 7 tests (CRUD + status filter) |
| C0.5 | **Wire V1 Routers + Replace Mock Data** | ✅ | 5 routers wired in `main.py`; mock `sales.py` cleared | — | Router wiring verified |
| C0.6 | **Alembic Migration** | ✅ | `e263dba2c9bd_initial_models.py` — 3 tables + FKs + cascade rules | — | `alembic upgrade head` succeeds |
| C0.7 | **Dashboard Page** | ✅ | `GET /api/v1/dashboard` — aggregate stats + recent leads | Dashboard: summary cards, pipeline breakdown, recent leads | 2 tests (empty + populated) |
| C0.8 | **Fix Test Database** | ✅ | `conftest.py` → `dclaw_sales_test`; `TEST_DATABASE_URL` env override | — | 28 tests passing |
| C0.9 | **Docker Compose Validation** | ✅ | All 3 services healthy; healthchecks correct | `npm run build` passes in Docker | `docker compose up -d` → all green |

**Exit Gate for C0:** `docker compose up -d` → 3 healthy services → full CRUD on Leads, Opportunities, Quotes via curl → all tests pass → `alembic upgrade head` works.

### C1 — Core Differentiators 🔜 (partial complete)

| # | Feature | Status | Backend | Frontend | Tests |
|---|---------|--------|---------|----------|-------|
| C1.1 | **Pipeline Kanban Board** | ✅ | `GET /api/v1/opportunities?stage=` filter; `PATCH /api/v1/opportunities/{id}/stage` | Drag-and-drop Kanban by stage; column counts | Stage transition tests (included) |
| C1.2 | **Lead Scoring Engine (Rules-Based)** | 🔜 | `app/services/lead_scorer.py` — score based on source, engagement signals, firmographics | Score badges on lead list; sort/filter by score | Scoring logic tests |
| C1.3 | **Dashboard Analytics (Real)** | ⬜ | Aggregation queries: conversion rates, pipeline value by stage, win/loss ratio | Bar chart (opportunities by stage), line chart (leads over time) | Aggregation accuracy tests |
| C1.4 | **Lead → Opportunity Conversion** | ✅ | `POST /api/v1/leads/{id}/convert` — creates Opportunity from Lead, updates Lead status | "Convert to Opportunity" button on Lead detail | Conversion flow test (included) |
| C1.5 | **Bulk Actions** | ✅ | `POST /api/v1/leads/bulk-delete`, `POST /api/v1/leads/bulk-status` | Checkbox selection; bulk action toolbar; confirmation | Bulk operation tests (included) |
| C1.6 | **Search & Advanced Filters** | ✅ | Query params: `search`, `status`, `stage`, `score_min`, `score_max` | Search bar + filter panel; URL-synced filters | Filter accuracy tests (included) |
| C1.7 | **Activity Timeline** | 🔜 | `app/models/activity.py` — log all state changes; `GET /api/v1/activities?entity_type=&entity_id=` | Timeline component on Lead/Opportunity detail pages | Activity logging tests |

**Exit Gate for C1:** Kanban board works with drag-and-drop → lead scoring visible and filterable → dashboard shows real data → search/filter functional → activity timeline populated.

### C2 — Advanced / AI Features (Week 2: Day 1–5)

| # | Feature | Status | Backend | Frontend | Tests |
|---|---------|--------|---------|----------|-------|
| C2.1 | **AI Prospect Research Agent** | 🔴 | `app/services/prospect_researcher.py` — web scraping + LLM synthesis; `POST /api/v1/ai/research` endpoint with async job + caching | Research panel on Lead detail; "Generate Icebreaker" button; loading states | Research pipeline tests |
| C2.2 | **AI Email Writer & Subject Line Optimizer** | 🔴 | `app/services/email_ai.py` — LLM email generation with tone/persona; `POST /api/v1/ai/generate-email`; subject line A/B scoring | Email composer modal; AI assist toolbar; tone selector; subject line variants | Email generation tests |
| C2.3 | **Multi-Channel Outreach Sequences** | 🔴 | `app/models/sequence.py` + `app/models/sequence_step.py`; sequence engine with scheduler; template variable substitution | Visual sequence builder; step type selector (email/LinkedIn/call); drag reorder | Sequence engine tests |
| C2.4 | **Lead Scoring Engine (ML-Enhanced)** | 🔴 | Upgrade C1.2 with ML model: train on historical win/loss; predict conversion probability | Score confidence indicator; "Why this score?" explainability panel | ML model accuracy tests |
| C2.5 | **Pipeline Analytics & Forecasting** | 🔴 | Weighted pipeline value; forecast by rep and quarter; cohort conversion analysis | Dashboard v2 with forecast chart, funnel visualization, rep performance table | Forecasting accuracy tests |
| C2.6 | **LinkedIn Automation (Safe & Compliant)** | 🔴 | Browser automation proxy (Playwright); rate limiting; human-like delays; safety caps | LinkedIn step type in sequence builder; connection status tracker | Rate limit enforcement tests |
| C2.7 | **Call Dialer & AI Transcription** | 🔴 | Twilio/VoIP integration; Whisper STT → LLM summarization; auto-log call with sentiment | Call panel: dial button, notes, outcome picker, recording playback, transcription | Call flow integration tests |

**Exit Gate for C2:** AI research generates real prospect insights → AI emails are personalized and context-aware → sequences execute end-to-end with template substitution → ML scoring outperforms rules-based → forecasting within 15% accuracy.

---

## 4. Architecture Decisions (Locked)

### 4.1 Database

- **Primary:** PostgreSQL 16 (via `docker-compose.yml` bundled postgres for local dev; shared `dclaw/postgres` for hub deployments per PATCH-2026-05-15)
- **Migration:** Alembic with async support — every model change gets a migration
- **Naming:** `dclaw_sales` for local; `dclaw_sales` on hub (auto-created by shared postgres init script)

### 4.2 AI Service Layer

- **LLM Provider:** OpenAI-compatible API (configurable via `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL` env vars). This allows swapping between OpenAI, Anthropic, or local models.
- **Caching:** Redis for AI result caching (optional for C0/C1; required for C2 to avoid redundant API calls)
- **Async Jobs:** Background tasks via FastAPI `BackgroundTasks` for C0/C1; Celery/ARQ only if C2 sequence scheduling demands it.

### 4.3 Frontend Routing

```
/                        → Dashboard
/leads                   → Lead list (table + search)
/leads/[id]              → Lead detail (info + opportunities + timeline + AI research)
/opportunities           → Kanban board + table toggle
/opportunities/[id]      → Opportunity detail (info + quotes + timeline)
/quotes                  → Quote list (table)
/quotes/[id]             → Quote detail (items + status)
/sequences               → Sequence builder (C2.3)
/settings                → App settings, integrations (C1+)
```

### 4.4 API Structure

```
/api/v1/leads/                          → Lead CRUD + bulk ops + search/filter
/api/v1/leads/{id}/convert              → Convert lead to opportunity
/api/v1/opportunities/                  → Opportunity CRUD + stage filter
/api/v1/opportunities/{id}/stage        → Update stage (for Kanban drag)
/api/v1/quotes/                         → Quote CRUD
/api/v1/dashboard/                      → Aggregated dashboard stats
/api/v1/activities/                     → Activity timeline (C1.7)
/api/v1/ai/research                     → Prospect research (C2.1)
/api/v1/ai/generate-email               → AI email generation (C2.2)
/api/v1/sequences/                      → Sequence CRUD (C2.3)
```

---

## 5. Implementation Order (Autonomous Development)

### Phase 3: Day 1 — Foundation Fixes (C0.1–C0.5)

```
1. Fix port mismatches in both Dockerfiles
2. Create Lead model, schema, repository, router (full CRUD)
3. Create Opportunity model, schema, repository, router (full CRUD)
4. Create Quote model, schema, repository, router (full CRUD)
5. Wire all routers in main.py, DELETE mock sales.py code
6. Generate alembic migration
7. Write tests for all endpoints
```

### Phase 3: Day 2 — Frontend CRUD (C0.6–C0.9 + C1 start)

```
8. Build Lead list page + detail page
9. Build Opportunity Kanban + detail page
10. Build Quote list page + detail page
11. Build Dashboard page with real stats
12. Wire API client functions
13. Docker compose validation
```

### Phase 3: Day 3–4 — Core Differentiators (C1)

```
14. Lead scoring engine
15. Lead → Opportunity conversion
16. Search & advanced filters
17. Bulk actions
18. Activity timeline model + logging
19. Enhanced dashboard with charts
```

### Phase 3: Day 5–7 — AI Features (C2)

```
20. AI prospect research agent
21. AI email writer
22. Outreach sequence engine
23. ML-enhanced lead scoring
24. Pipeline forecasting
```

---

## 6. Anti-Patterns (Reinforced)

| # | Anti-Pattern | Detection | Fix |
|---|-------------|-----------|-----|
| 1 | Mock data in routers | `random.randint()`, hardcoded lists, in-memory dicts | All data through PostgreSQL via repositories |
| 2 | Port mismatch | Dockerfile PORT ≠ compose port | Must match Port Registry exactly |
| 3 | Unwired routers | `# TODO: Wire v1 routers` in main.py | Include all routers with correct prefixes |
| 4 | No alembic migration | No files in `alembic/versions/` | Run `alembic revision --autogenerate` after model changes |
| 5 | Missing `ARG NEXT_PUBLIC_API_URL` | Dockerfile lacks ARG before build | Always declare ARG before RUN npm run build |

---

## 7. Success Metrics

| Metric | C0 Start | C0 Complete | C1 Target | C2 Target |
|--------|----------|-------------|-----------|-----------|
| API Endpoints | 2 (mock) | **17 (real CRUD)** ✅ | 25+ | 35+ |
| Test Coverage | <5% | **28 tests, 100% passing** ✅ | 75%+ | 80%+ |
| Docker Health | ❌ Port bugs | **3 green** ✅ | ✅ | ✅ |
| AI Features | 0 | 0 | 0 | 5 |
| YC Readiness Score | 15/100 | **40/100** ✅ | 65/100 | 85/100 |
| Frontend Pages | 1 (placeholder) | **6 interactive** ✅ | 8+ | 10+ |

---

## 8. Patch Retirement

The following patches are now incorporated into this plan and can be archived:

- `PATCH-2026-05-15-shared-hub-postgres.md` → ✅ Incorporated into Section 4.1 (Database)
- `PATCHES.md` → ✅ Updated with retired status

---

**Next Action:** Begin C1.2 (Lead Scoring Engine) + C1.7 (Activity Timeline) → then C2 AI features.
