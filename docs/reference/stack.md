# Stack

> Updated 2026-05-16 — C0 complete

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | Next.js | 14.2.x |
| Frontend | React | 18.3.x |
| Frontend | Tailwind CSS | 3.4.x |
| Frontend | TypeScript | 5.4+ |
| Backend | Python | 3.11 |
| Backend | FastAPI | ≥0.110.0 |
| Backend | Pydantic | v2 |
| Backend | SQLAlchemy | 2.0.x |
| Backend | Alembic | ≥1.13.0 |
| Database | PostgreSQL | 16 (Alpine) |
| ORM Driver | asyncpg | ≥0.29.0 |
| Testing | pytest | ≥7.4.0 |
| Testing | pytest-asyncio | 0.24.0 (pinned) |
| Container | Docker | Compose v3 |
| Orchestration | Kubernetes | Helm chart |

## Ports

| Service | Port | Healthcheck |
|---------|------|-------------|
| Frontend | 3017 | `wget -q --spider localhost:3017` |
| Backend | 8104 | `python urllib.request.urlopen('...:8104/health/')` |
| Database | 5432 | `pg_isready -U postgres` |

## Key Dependencies

### Backend (`requirements.txt`)

```
fastapi, uvicorn, sqlalchemy[asyncio], asyncpg, pydantic,
pydantic-settings, alembic, httpx, pytest, pytest-asyncio==0.24.0
```

### Frontend (`package.json`)

```
next, react, react-dom, tailwindcss, tailwindcss-animate,
class-variance-authority, clsx, tailwind-merge, lucide-react
```
