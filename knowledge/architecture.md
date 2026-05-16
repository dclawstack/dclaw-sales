# Architecture

## Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend | FastAPI | ≥0.110.0 |
| ORM | SQLAlchemy | 2.0.x |
| Database | PostgreSQL | 16 (Alpine) |
| Async Driver | asyncpg | ≥0.29.0 |
| Schemas | Pydantic | v2 |
| Migrations | Alembic | ≥1.13.0 |
| Frontend | Next.js | 14.2.x |
| Styling | Tailwind CSS | 3.4.x |
| Components | Custom (pre-built) | — |
| Container | Docker | Compose v3 |
| Orchestration | Kubernetes | Helm chart |

## Port Architecture

```
┌────────────────────────────────────────────────────────────┐
│                      Docker Network                        │
│                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Frontend    │  │  Backend     │  │  Postgres     │    │
│  │  :3017       │──▶  :8104      │──▶  :5432       │    │
│  │  Next.js     │  │  FastAPI     │  │  dclaw_sales  │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                            │
│  Healthchecks:                                             │
│  Frontend → wget --spider http://localhost:3017/           │
│  Backend  → python urllib.request.urlopen('.../health/')  │
│  Postgres → pg_isready -U postgres -d dclaw_sales          │
└────────────────────────────────────────────────────────────┘
```

## Data Flow

```
Browser → Next.js (SSR/CSR) → fetch() → FastAPI → SQLAlchemy → PostgreSQL
                                            ↑
                                     Depends(get_db)
                                            ↑
                                    AsyncSession
```

## Key Architecture Decisions

1. **Repository Pattern**: All DB access through `BaseRepository[T]` subclasses. Controllers never touch `AsyncSession` directly.
2. **String UUID PKs**: All entities use `String(36)` with `default=uuid.uuid4`. Easier to migrate and serialize.
3. **Naive Datetimes**: `TIMESTAMP WITHOUT TIME ZONE` — use `utc_now()` which returns `datetime.now(utc).replace(tzinfo=None)`.
4. **`ondelete` Cascade Rules**: `SET NULL` for optional FK refs (Lead→Opportunity), `CASCADE` for composition (Opportunity→Quote).
5. **No Dataclass Mapped**: `Base` uses plain `DeclarativeBase`, not `MappedAsDataclass`. This avoids flush sync conflicts with relationships.
