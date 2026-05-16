# Agent Rules — Anti-Patterns & Architecture Locks

> **Must-read before any code change.** From `AGENTS.md`.

## Architecture Locks (NON-NEGOTIABLE)

1. **FastAPI** with `lifespan` handler
2. **SQLAlchemy 2.0** — `DeclarativeBase` from `app.models.base`, NOT `declarative_base()`
3. **No `MappedAsDataclass`** — causes relationship flush conflicts
4. **Pydantic v2** schemas with `ConfigDict(from_attributes=True)`
5. **Async SQLAlchemy** — `create_async_engine` + `AsyncSession`
6. **Repository pattern** — all DB access through `app/repositories/`
7. **Dependency injection** — `Depends(get_db)`, never manual `AsyncSession`
8. **NO MOCK DATA** — never use in-memory `dict`s
9. **pytest-asyncio==0.24.0** — pinned version, do not upgrade

## Anti-Patterns

| Anti-Pattern | Why It Breaks | Correct Alternative |
|-------------|---------------|---------------------|
| `declarative_base()` | Separate metadata → zero tables | `from app.models.base import Base` |
| `curl` in healthcheck on `python:*-slim` | No `curl` installed | `python -c "import urllib.request; ..."` |
| In-memory `MOCK_*` dicts | Data lost on restart | Create repository + real DB |
| Missing `ARG NEXT_PUBLIC_API_URL` | Wrong API URL baked in | Add `ARG NEXT_PUBLIC_API_URL` before build |
| Manual `get_db()` with `__anext__()` | Session leaks | `Depends(get_db)` |
| Hardcoded `localhost:PORT` | Breaks Docker/K8s | Use `process.env.NEXT_PUBLIC_API_URL` |
| No alembic migration for new models | Schema drift | `alembic revision --autogenerate` |
| Installing `shadcn` CLI v4 | Breaks Tailwind v3 build | Use pre-built components in scaffold |
| Using `@base-ui/react` | Incompatible with Tailwind v3 | Use pre-built components |
| Non-standard Postgres port in tests | CI maps 5432 only | Always use `localhost:5432` in conftest.py |
| Upgrading `pytest-asyncio` | v1.3.0 breaks fixture scoping | Keep `pytest-asyncio==0.24.0` |
| Using `MappedAsDataclass` | Sync conflicts on flush | Use plain `DeclarativeBase` |
| `default_factory` in `mapped_column()` | SQLAlchemy `ArgumentError` | Use `default=` with callable |
| Timezone-aware `datetime` | `DataError` with `TIMESTAMP WITHOUT TIME ZONE` | Use `utc_now()` |

## Port Registry (Relevant)

| App | Backend | Frontend | DB |
|-----|---------|----------|-----|
| **dclaw-sales** | **8104** | **3017** | dclaw_sales |

## UI Components Available

Use pre-built components directly — DO NOT install shadcn CLI:

- `Button` — variants: default, destructive, outline, secondary, ghost, link
- `Card` — Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- `Input` — standard text input
- `Label` — form label
- `Badge` — variants: default, secondary, destructive, outline
- `Select` — native select element (NOT shadcn compound)
- `Dialog` — open/onOpenChange API (NOT DialogTrigger)
- `Table` — standard HTML table
- `Tabs` — Tabs, TabsList, TabsTrigger, TabsContent
- `Avatar` — Avatar, AvatarImage, AvatarFallback
