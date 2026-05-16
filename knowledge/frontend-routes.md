# Frontend Routes

## Route Map

| Route | Page | Status | Description |
|-------|------|--------|-------------|
| `/` | Dashboard | ✅ | Summary cards, pipeline by stage, recent leads, win rate |
| `/leads` | Lead List | ✅ | Table + search + status filter + pagination + bulk delete |
| `/leads/[id]` | Lead Detail | ✅ | View/edit, convert to opportunity, related opportunities |
| `/opportunities` | Kanban Board | ✅ | Drag-drop stage columns, search, Add Opportunity dialog |
| `/opportunities/[id]` | Opp Detail | ✅ | View/edit, advance stage, related quotes |
| `/quotes` | Quote List | ✅ | Table + status filter, Send/Accept/Reject actions |
| `/quotes/[id]` | Quote Detail | 📋 | Itemized view (placeholder) |
| `/sequences` | Sequence Builder | 📋 | Planned C2.3 |
| `/settings` | App Settings | 📋 | Planned C1+ |

## Component Tree

```
RootLayout
└── Sidebar (nav: Dashboard, Leads, Opportunities, Quotes)
    └── <main>
        ├── DashboardPage
        │   ├── SummaryCards (4 cards: leads, pipeline, won, quotes)
        │   ├── PipelineByStage (per-stage breakdown)
        │   └── RecentLeads (top 5)
        ├── LeadsPage
        │   ├── LeadTable (paginated, sortable)
        │   ├── LeadFormDialog (create modal)
        │   └── BulkActionBar
        ├── LeadDetailPage
        │   ├── LeadInfoCard (view/edit toggle)
        │   └── RelatedOpportunities
        ├── OpportunitiesPage
        │   ├── KanbanBoard (6 stage columns)
        │   │   └── KanbanCard (draggable)
        │   └── OpportunityFormDialog
        ├── OpportunityDetailPage
        │   ├── OppInfoCard (view/edit + advance stage)
        │   └── RelatedQuotes
        └── QuotesPage
            ├── QuoteTable (status filter pills)
            └── QuoteFormDialog
```

## Data Flow

```
Page Component
    ├── useState: local state (data, loading, error, form)
    ├── useEffect: fetch on mount
    └── api.ts functions
        └── fetchJson<T>(path, options)
            └── fetch(`${NEXT_PUBLIC_API_URL}${path}`)
                └── FastAPI Backend
```

## Pre-built UI Components Used

- `Button` — variants: default, destructive, outline, secondary, ghost
- `Input` — text, number, email, date
- `Badge` — variants: default, secondary, destructive, outline
- `Card` — Card, CardHeader, CardTitle, CardContent
- `Dialog` — open/onOpenChange modal
- `Select` — native `<select>` element
- `Label` — form label
