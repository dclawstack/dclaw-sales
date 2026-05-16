# DClaw Sales — v1.2 Feature Roadmap

> 📘 **REVISED PRD v2.3 available:** See `REVISED-PRD.md` for complete gap analysis, current state, and full feature roadmap.


> Based on: Y Combinator vertical SaaS principles, trending GitHub repos (gmail-mail-merge, outreach-tools), AI product research (Apollo.io, Clay, Lavender, Salesloft)

## Pre-Flight Checklist

- [ ] `frontend/package-lock.json` committed after any `npm install` / dependency change
- [ ] `frontend/next-env.d.ts` exists and is committed
- [ ] `docker-compose.yml` healthchecks correct
- [ ] `frontend/Dockerfile` declares `ARG NEXT_PUBLIC_API_URL` before `RUN npm run build`

## v1.0 Feature Inventory (Current)

- [ ] Lead database CRUD with enrichment
- [ ] Outreach sequences (email + LinkedIn + call tasks)
- [ ] Pipeline view with stage progression
- [ ] Dashboard with conversion metrics
- [ ] Real backend CRUD (no mocks)
- [ ] Docker + Helm deployment
- [ ] Alembic migrations
- [ ] Backend tests

---

## v1.2 Roadmap

### P0 — Must Have (Ship in v1.0, demo-ready)

#### 1. AI Sales Copilot (Prospect Research Agent)
**Description:** AI agent that researches any prospect in seconds. Given an email/domain, it generates a personalized icebreaker, company summary, and talking points.
- **AI Angle:** Web scraping + LLM synthesis. RAG over scraped data.
- **Backend:** `/api/v1/ai/research` endpoint. Async job with result caching.
- **Frontend:** Research panel in lead detail view. One-click "Generate Icebreaker" button.
- **Files:** `backend/app/services/prospect_researcher.py`, `frontend/src/app/leads/[id]/research.tsx`

#### 2. Multi-Channel Outreach Sequences
**Description:** Build automated sequences: Day 1 email → Day 3 LinkedIn connect → Day 5 call task → Day 7 breakup email.
- **Backend:** Sequence engine with scheduler. Task queue (Celery/ARQ). Email send via SMTP/API.
- **Frontend:** Visual sequence builder with drag-and-drop steps.
- **Files:** `backend/app/services/sequences.py`, `frontend/src/app/sequences/builder.tsx`

#### 3. AI Email Writer & Subject Line Optimizer
**Description:** Generate personalized cold emails and A/B test subject lines with predicted open rates.
- **AI Angle:** LLM email generation with tone/persona controls. Subject line scoring model.
- **Backend:** `/api/v1/ai/generate-email` endpoint.
- **Frontend:** Email composer with AI assist toolbar.
- **Files:** `backend/app/services/email_ai.py`

#### 4. Lead Scoring & Intent Signals
**Description:** Score leads based on firmographics, engagement (email opens, site visits), and intent data.
- **Backend:** Scoring engine with configurable weights. Integration with website tracking pixel.
- **Frontend:** Lead list sorted by score. Hot lead alerts.
- **Files:** `backend/app/services/lead_scorer.py`

### P1 — Should Have (v1.1–1.2)

#### 5. LinkedIn Automation (Safe & Compliant)
**Description:** Automated connection requests, follow-ups, and message sequences with human-like delays.
- **Backend:** Browser automation proxy (Playwright/Selenium). Rate limiting. Safety caps.
- **Frontend:** LinkedIn sequence step type in builder.

#### 6. Call Dialer & AI Transcription
**Description:** One-click dial from lead profile. Auto-log call with AI transcription and sentiment.
- **AI Angle:** Whisper STT + LLM summarization.
- **Backend:** Twilio/voip integration. Async transcription pipeline.
- **Frontend:** Call panel with notes, outcome picker, recording playback.

#### 7. Pipeline Analytics & Forecasting
**Description:** Conversion rates by sequence, rep performance, revenue forecast.
- **Backend:** Analytics aggregation SQL + forecasting model.
- **Frontend:** Dashboard with funnel charts, cohort analysis.

#### 8. CRM Sync (Two-Way)
**Description:** Bi-directional sync with HubSpot, Salesforce, Pipedrive.
- **Backend:** Webhook + polling adapters. Conflict resolution.
- **Frontend:** Integration settings with field mapping UI.

### P2 — Could Have (v1.3+)

#### 9. AI Objection Handler
**Description:** Real-time AI that suggests responses to prospect objections during calls/emails.

#### 10. Buyer Intent Data Integration
**Description:** Integrate Bombora/6sense intent data to surface accounts researching your category.

#### 11. AI Sales Role-Play Coach
**Description:** Practice pitch with AI prospect that simulates different personas and objections.

#### 12. Commission Calculator & Gamification
**Description:** Auto-calculate commissions. Leaderboards, streaks, achievement badges.

---

## Implementation Priority

1. **Week 1–2:** AI Prospect Research (P0.1) + Outreach Sequences (P0.2)
2. **Week 3–4:** AI Email Writer (P0.3) + Lead Scoring (P0.4)
3. **Week 5–6:** Call Dialer + Transcription (P1.6) + Pipeline Analytics (P1.7)
4. **Week 7–8:** LinkedIn Automation (P1.5) + CRM Sync (P1.8)
