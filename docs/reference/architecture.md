# Architecture

> Updated 2026-05-16 — C0 complete

## Overview

DClaw Sales follows the standard DClaw app architecture with 3 core entities (Lead, Opportunity, Quote) and a layered backend:

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Next.js 14     │────▶│   FastAPI         │────▶│  PostgreSQL 16   │
│   Tailwind CSS   │     │   SQLAlchemy 2.0  │     │  dclaw_sales     │
│   Port 3017      │     │   Port 8104       │     │  Port 5432       │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

## Backend Layers

```
Router (app/api/v1/)
    ↓ Depends(get_db)
Repository (app/repositories/)
    ↓ AsyncSession
SQLAlchemy Model (app/models/)
    ↓
PostgreSQL
```

## Components

### Frontend
- **Framework:** Next.js 14.2.x
- **Styling:** Tailwind CSS 3.4
- **UI Components:** Custom design system (10 pre-built)
- **State:** React hooks
- **API Client:** Typed fetch wrapper in `src/lib/api.ts`

### Backend
- **Framework:** FastAPI ≥0.110.0
- **ORM:** SQLAlchemy 2.0 (DeclarativeBase)
- **Database:** PostgreSQL 16 + asyncpg
- **Schemas:** Pydantic v2 with `from_attributes=True`
- **Pattern:** Repository pattern + dependency injection

### Infrastructure
- **Container:** Docker (3 services)
- **Orchestration:** Kubernetes via DClaw Operator
- **Database:** CloudNativePG (hub) / bundled postgres (local)
- **Ingress:** nginx-ingress + cert-manager

## Entity Model

```
Lead (leads)
├── id: UUID PK
├── name, email, phone, company, source
├── score (0-100), status (new/contacted/qualified/lost)
└── opportunities (1:N, cascade delete-orphan)

Opportunity (opportunities)
├── id: UUID PK
├── lead_id: FK → leads (SET NULL)
├── title, value, stage, probability
└── quotes (1:N, cascade)

Quote (quotes)
├── id: UUID PK
├── opportunity_id: FK → opportunities (CASCADE)
├── items (JSON), total, status (draft/sent/accepted/rejected/expired)
```

## Port Architecture

| Component | Port | Healthcheck |
|-----------|------|-------------|
| Postgres | 5432 | `pg_isready` |
| Backend | 8104 | `python urllib.request.urlopen(...)` |
| Frontend | 3017 | `wget -q --spider` |
