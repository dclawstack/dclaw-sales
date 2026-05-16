# Quickstart

> Updated 2026-05-16 — C0 complete

## Local Development

### Prerequisites

- Docker
- Node.js 20+ (for frontend dev)
- Python 3.11+ (for backend dev without Docker)

### Option 1: Docker Compose (Recommended)

```bash
# Clone and start
git clone https://github.com/dclawstack/dclaw-sales.git
cd dclaw-sales
docker compose up -d

# Verify
curl http://localhost:8104/health/     # → {"status":"ok"}
curl http://localhost:3017/            # → 200
```

Services:
- **Postgres:** `localhost:5432` (db: `dclaw_sales`)
- **Backend:** `http://localhost:8104`
- **Frontend:** `http://localhost:3017`

### Option 2: Frontend Dev Server

```bash
cd frontend
npm install
NEXT_PUBLIC_API_URL=http://localhost:8104 npm run dev
# → http://localhost:3017
```

### Option 3: Backend Dev Server

```bash
cd backend
pip install -r requirements.txt
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/dclaw_sales uvicorn app.api.main:app --port 8104 --reload
```

## Running Tests

```bash
# Start postgres (required for tests)
docker compose up -d postgres

# Create test database
docker compose exec postgres psql -U postgres -c "CREATE DATABASE dclaw_sales_test;"

# Run all tests (inside backend container)
docker compose exec -e TEST_DATABASE_URL="postgresql+asyncpg://postgres:postgres@postgres:5432/dclaw_sales_test" backend pytest -v

# 28 tests, 100% passing
```

## First Use

1. Open `http://localhost:3017` → Dashboard
2. Click **Add Lead** to create your first lead
3. Go to **Opportunities** → **Add Opportunity** to create deals
4. Drag cards between Kanban columns to advance stages
5. Go to **Quotes** to create and manage quotes

## Next Steps

- Read the [Guides](../guides) for detailed use cases
- Check the [Reference](../reference) for API docs and architecture
- See [plan_v1.3.md](../../plan_v1.3.md) for the full roadmap
