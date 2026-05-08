# PRODUCT-SPEC: Sales

## Overview

**App Name:** Sales
**Domain:** Sales Pipeline & Quoting
**Target User:** Sales teams, account executives

## Core Entities

### Lead
```
Lead
├── id: UUID (PK)
├── name: str (required)
├── email: str (unique, required)
├── phone: str (optional)
├── company: str (optional)
├── source: str (optional) — e.g. "web", "referral", "cold-call"
├── score: int (0-100, default 0)
├── status: enum ["new", "contacted", "qualified", "lost"] (default: "new")
├── assigned_to: str (optional)
├── created_at: datetime
└── updated_at: datetime
```

### Opportunity
```
Opportunity
├── id: UUID (PK)
├── lead_id: UUID (FK → Lead, ondelete=SET NULL, optional)
├── title: str (required)
├── value: float (required, default 0)
├── stage: enum ["prospecting", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"] (default: "prospecting")
├── probability: int (0-100, default 0)
├── expected_close_date: date (optional)
├── created_at: datetime
└── updated_at: datetime
```

### Quote
```
Quote
├── id: UUID (PK)
├── opportunity_id: UUID (FK → Opportunity, ondelete=CASCADE)
├── items: JSON (array of line items)
├── total: float (required, default 0)
├── status: enum ["draft", "sent", "accepted", "rejected", "expired"] (default: "draft")
├── valid_until: date (optional)
├── created_at: datetime
└── updated_at: datetime
```

## User Stories / Screens

### Screen 1: Dashboard
- Summary cards: total leads, open opportunities, pipeline value, win rate
- Recent leads feed
- Opportunities by stage bar chart
- Quick action buttons (add lead, add opportunity, create quote)

### Screen 2: Leads
- Table view with pagination, search by name/email/company
- Status filter (new/contacted/qualified/lost)
- Score column with visual indicator
- "Add Lead" modal/form
- Bulk delete

### Screen 3: Lead Detail
- Lead info card with edit/delete
- Related opportunities list
- Convert to Opportunity button
- Activity timeline placeholder

### Screen 4: Opportunities
- Kanban board view by stage
- Table view toggle
- Search and filter by lead, stage, value
- "Add Opportunity" form with lead dropdown

### Screen 5: Opportunity Detail
- Opportunity info with edit/delete
- Related quotes list
- Stage progression buttons
- Add quote button

### Screen 6: Quotes
- Table view with status filters
- "Add Quote" form with line items
- Send/Accept/Reject actions

## API Endpoints

- `GET /api/v1/leads` — list leads
- `POST /api/v1/leads` — create lead
- `GET /api/v1/leads/{id}` — get lead
- `PATCH /api/v1/leads/{id}` — update lead
- `DELETE /api/v1/leads/{id}` — delete lead

- `GET /api/v1/opportunities` — list opportunities
- `POST /api/v1/opportunities` — create opportunity
- `GET /api/v1/opportunities/{id}` — get opportunity
- `PATCH /api/v1/opportunities/{id}` — update opportunity
- `DELETE /api/v1/opportunities/{id}` — delete opportunity

- `GET /api/v1/quotes` — list quotes
- `POST /api/v1/quotes` — create quote
- `GET /api/v1/quotes/{id}` — get quote
- `PATCH /api/v1/quotes/{id}` — update quote
- `DELETE /api/v1/quotes/{id}` — delete quote
