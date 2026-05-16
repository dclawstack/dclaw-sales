# DClaw Sales

> **AI-powered sales pipeline management.** Lead tracking, opportunity Kanban, quotes, and pipeline analytics — built on the DClaw Stack.
>
> **Status:** 🟢 v1.0 Beta — Core CRUD live, 28 tests passing, Docker healthy

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/dclawstack/dclaw-sales.git
cd dclaw-sales

# 2. Start all services
docker compose up -d

# 3. Verify
curl http://localhost:8104/health/          # Backend → {"status":"ok"}
curl http://localhost:3017/                 # Frontend → 200
curl http://localhost:8104/api/v1/leads/    # Leads API
```

**Ports:** Backend `8104` · Frontend `3017` · Postgres `5432` (db: `dclaw_sales`)

---

## What's Inside

### Backend (`backend/`)

| Layer | Files | Description |
|-------|-------|-------------|
| **Models** | `app/models/lead.py`, `opportunity.py`, `quote.py` | SQLAlchemy 2.0 with `DeclarativeBase`, relationships, UUID PKs |
| **Schemas** | `app/schemas/lead.py`, `opportunity.py`, `quote.py` | Pydantic v2 with `from_attributes=True` |
| **Repositories** | `app/repositories/lead_repo.py`, `opportunity_repo.py`, `quote_repo.py` | Search, filter, bulk ops, aggregation queries |
| **Routers** | `app/api/v1/leads.py`, `opportunities.py`, `quotes.py`, `dashboard.py`, `lead_conversion.py` | 17 endpoints, full CRUD + dashboard aggregates |
| **Alembic** | `alembic/versions/e263dba2c9bd_initial_models.py` | All 3 tables with FKs + cascade rules |

### Frontend (`frontend/`)

| Route | Page | Features |
|-------|------|----------|
| `/` | Dashboard | Summary cards, pipeline by stage, recent leads, win rate |
| `/leads` | Lead List | Table with search, status filter, pagination, bulk delete, Add Lead dialog |
| `/leads/[id]` | Lead Detail | View/edit, convert to opportunity, related opportunities |
| `/opportunities` | Kanban Board | Drag-and-drop stage columns, search, Add Opportunity dialog |
| `/opportunities/[id]` | Opp Detail | View/edit, advance stage, related quotes |
| `/quotes` | Quote List | Table with status filters, Send/Accept/Reject actions, Add Quote dialog |

### Infrastructure

| Component | Status |
|-----------|--------|
| **Docker Compose** | ✅ 3 services (postgres, backend, frontend) — all healthy |
| **Healthchecks** | ✅ `pg_isready` · `urllib.request.urlopen()` · `wget --spider` |
| **CI** | ✅ `.github/workflows/ci.yml` |
| **Helm** | ✅ Chart in `helm/` |

---

## Architecture

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Next.js 14     │────▶│   FastAPI         │────▶│  PostgreSQL 16   │
│   Tailwind CSS   │     │   SQLAlchemy 2.0  │     │  dclaw_sales     │
│   Port 3017      │     │   Port 8104       │     │  Port 5432       │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

### API Endpoints (17 live)

```
GET    /api/v1/leads/                    → List leads (search, status, score filters)
POST   /api/v1/leads/                    → Create lead
GET    /api/v1/leads/{id}                → Get lead
PATCH  /api/v1/leads/{id}                → Update lead
DELETE /api/v1/leads/{id}                → Delete lead
POST   /api/v1/leads/bulk-delete         → Bulk delete leads
POST   /api/v1/leads/bulk-status         → Bulk update lead status
POST   /api/v1/leads/{id}/convert         → Convert lead to opportunity

GET    /api/v1/opportunities/            → List opportunities (search, stage, lead filters)
POST   /api/v1/opportunities/            → Create opportunity
GET    /api/v1/opportunities/{id}        → Get opportunity
PATCH  /api/v1/opportunities/{id}        → Update opportunity
DELETE /api/v1/opportunities/{id}        → Delete opportunity
PATCH  /api/v1/opportunities/{id}/stage  → Update stage (Kanban drag)

GET    /api/v1/quotes/                   → List quotes (status, opportunity filters)
POST   /api/v1/quotes/                   → Create quote
GET    /api/v1/quotes/{id}               → Get quote
PATCH  /api/v1/quotes/{id}               → Update quote
DELETE /api/v1/quotes/{id}               → Delete quote

GET    /api/v1/dashboard/                → Aggregate stats (leads, opps, quotes, pipeline, win rate)
```

---

## Entity Model

```
Lead
├── id: UUID (PK)
├── name: str (required)
├── email: str (unique, required)
├── phone: str (optional)
├── company: str (optional)
├── source: str — "web", "referral", "cold-call", "linkedin", "event", "other"
├── score: int (0-100, default 0)
├── status: enum — "new", "contacted", "qualified", "lost"
├── assigned_to: str (optional)
├── created_at / updated_at: datetime
└── opportunities: list[Opportunity] (CASCADE delete-orphan)

Opportunity
├── id: UUID (PK)
├── lead_id: UUID (FK → Lead, SET NULL)
├── title: str (required)
├── value: float (default 0)
├── stage: enum — "prospecting", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"
├── probability: int (0-100)
├── expected_close_date: date (optional)
├── created_at / updated_at: datetime
└── quotes: list[Quote] (CASCADE)

Quote
├── id: UUID (PK)
├── opportunity_id: UUID (FK → Opportunity, CASCADE)
├── items: JSON (array of line items)
├── total: float
├── status: enum — "draft", "sent", "accepted", "rejected", "expired"
├── valid_until: date (optional)
└── created_at / updated_at: datetime
```

---

## Development

### Run tests

```bash
# Start postgres first
docker compose up -d postgres

# Run all backend tests (inside container)
docker compose exec -e TEST_DATABASE_URL="postgresql+asyncpg://postgres:postgres@postgres:5432/dclaw_sales_test" backend pytest -v

# 28 tests, 100% passing
```

### Generate migrations

```bash
docker compose exec backend alembic revision --autogenerate -m "description"
docker compose exec backend alembic upgrade head
```

### Frontend dev

```bash
cd frontend
npm install
npm run dev    # → http://localhost:3017 with NEXT_PUBLIC_API_URL=http://localhost:8104
```

---

## Port Registry

This app is part of the DClaw ecosystem:

| App | Backend | Frontend | DB |
|-----|---------|----------|-----|
| dclaw-sales | **8104** | **3017** | dclaw_sales |

Full registry in `AGENTS.md`.

---

## Roadmap

See [`plan_v1.3.md`](plan_v1.3.md) for the full complexity-ranked roadmap:

| Tier | Status | Features |
|------|--------|----------|
| **C0** Foundation | ✅ Complete | CRUD, dashboard, Kanban, 28 tests, Docker healthy |
| **C1** Differentiators | 🔜 Next | Lead scoring engine, activity timeline, advanced analytics |
| **C2** AI Features | 📋 Planned | Prospect research agent, AI email writer, sequences, call transcription |

---

## Rules for Agents

See `AGENTS.md` for the full architecture lock and anti-patterns list. Key points:

- ❌ Never use `declarative_base()` — always `from app.models.base import Base`
- ❌ Never use mock data — all endpoints hit PostgreSQL
- ❌ Never install shadcn CLI — use pre-built components in `frontend/src/components/ui/`
- ✅ Keep `pytest-asyncio==0.24.0` pinned
- ✅ Always use `Depends(get_db)` for DB sessions

## Contributors

- [Deepro Mallick](https://github.com/deepro713)
