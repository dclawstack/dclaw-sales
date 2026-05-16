# Entity Model

## Lead

```
Lead
├── id: UUID (PK, String(36))
├── name: str (required, String(255))
├── email: str (unique, required, String(255))
├── phone: str | None (String(50))
├── company: str | None (String(255))
├── source: str | None (String(100))
│     Values: "web", "referral", "cold-call", "linkedin", "event", "other"
├── score: int (default: 0)
├── status: str (default: "new")
│     Values: "new", "contacted", "qualified", "lost"
├── assigned_to: str | None (String(255))
├── created_at: datetime (naive UTC)
├── updated_at: datetime (naive UTC, auto-updated)
└── opportunities: list[Opportunity] (lazy="selectin", cascade="all, delete-orphan")
```

### Lead API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/leads/` | List with search, status, score filters, pagination |
| POST | `/api/v1/leads/` | Create lead |
| GET | `/api/v1/leads/{id}` | Get by ID |
| PATCH | `/api/v1/leads/{id}` | Partial update |
| DELETE | `/api/v1/leads/{id}` | Delete |
| POST | `/api/v1/leads/bulk-delete` | Bulk delete |
| POST | `/api/v1/leads/bulk-status` | Bulk status update |
| POST | `/api/v1/leads/{id}/convert` | Convert to Opportunity |

---

## Opportunity

```
Opportunity
├── id: UUID (PK, String(36))
├── lead_id: str | None (FK → leads.id, ondelete="SET NULL")
├── title: str (required, String(255))
├── value: float (default: 0.0)
├── stage: str (default: "prospecting")
│     Values: "prospecting", "qualification", "proposal", "negotiation",
│              "closed_won", "closed_lost"
├── probability: int (default: 0, 0-100)
├── expected_close_date: date | None
├── created_at: datetime (naive UTC)
├── updated_at: datetime (naive UTC, auto-updated)
├── lead: Lead | None (lazy="selectin")
└── quotes: list[Quote] (lazy="selectin", cascade="all, delete-orphan")
```

### Opportunity API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/opportunities/` | List with search, stage, lead, value filters |
| POST | `/api/v1/opportunities/` | Create opportunity |
| GET | `/api/v1/opportunities/{id}` | Get by ID |
| PATCH | `/api/v1/opportunities/{id}` | Partial update |
| DELETE | `/api/v1/opportunities/{id}` | Delete |
| PATCH | `/api/v1/opportunities/{id}/stage` | Update stage (Kanban drag) |

---

## Quote

```
Quote
├── id: UUID (PK, String(36))
├── opportunity_id: str (FK → opportunities.id, ondelete="CASCADE")
├── items: JSON | None (array of {name, price} objects)
├── total: float (default: 0.0)
├── status: str (default: "draft")
│     Values: "draft", "sent", "accepted", "rejected", "expired"
├── valid_until: date | None
├── created_at: datetime (naive UTC)
├── updated_at: datetime (naive UTC, auto-updated)
└── opportunity: Opportunity (lazy="selectin")
```

### Quote API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/quotes/` | List with status, opportunity filters |
| POST | `/api/v1/quotes/` | Create quote |
| GET | `/api/v1/quotes/{id}` | Get by ID |
| PATCH | `/api/v1/quotes/{id}` | Partial update |
| DELETE | `/api/v1/quotes/{id}` | Delete |

---

## ER Diagram

```
┌──────────┐       ┌──────────────┐       ┌──────────┐
│   Lead   │───┐   │ Opportunity  │───┐   │  Quote   │
│          │   │   │              │   │   │          │
│ id (PK)  │◄──┼───│ lead_id (FK) │   │   │ id (PK)  │
│ name     │   │   │ id (PK)      │◄──┼───│ opp_id   │
│ email    │   │   │ title        │   │   │ items    │
│ score    │   │   │ value        │   │   │ total    │
│ status   │   │   │ stage        │   │   │ status   │
└──────────┘   │   │ probability  │   │   └──────────┘
               │   └──────────────┘   │
               │   ondelete: SET NULL │   ondelete: CASCADE
               └──────────────────────┘
```
