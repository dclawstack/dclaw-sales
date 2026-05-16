const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });
  if (!response.ok) {
    const error = await response.text();
    throw new ApiError(`API error ${response.status}: ${error}`, response.status);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

// Health
export async function getHealth() {
  return fetchJson<{ status: string }>("/health/");
}

// --- Types ---

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  source: string | null;
  score: number;
  status: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadListResponse {
  items: Lead[];
  total: number;
}

export interface LeadCreate {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source?: string;
  score?: number;
  status?: string;
  assigned_to?: string;
}

export interface LeadUpdate {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
  score?: number;
  status?: string;
  assigned_to?: string;
}

export interface Opportunity {
  id: string;
  lead_id: string | null;
  title: string;
  value: number;
  stage: string;
  probability: number;
  expected_close_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface OpportunityListResponse {
  items: Opportunity[];
  total: number;
}

export interface OpportunityCreate {
  title: string;
  value?: number;
  stage?: string;
  probability?: number;
  expected_close_date?: string;
  lead_id?: string;
}

export interface OpportunityUpdate {
  title?: string;
  value?: number;
  stage?: string;
  probability?: number;
  expected_close_date?: string;
  lead_id?: string;
}

export interface Quote {
  id: string;
  opportunity_id: string;
  items: Record<string, unknown>[] | null;
  total: number;
  status: string;
  valid_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuoteListResponse {
  items: Quote[];
  total: number;
}

export interface QuoteCreate {
  opportunity_id: string;
  items?: Record<string, unknown>[];
  total?: number;
  status?: string;
  valid_until?: string;
}

export interface QuoteUpdate {
  items?: Record<string, unknown>[];
  total?: number;
  status?: string;
  valid_until?: string;
}

export interface DashboardStats {
  leads: {
    total: number;
    new: number;
    contacted: number;
    qualified: number;
    lost: number;
  };
  opportunities: {
    total: number;
    pipeline_value: number;
    closed_won_value: number;
    win_rate: number;
    by_stage: Record<string, { count: number; total_value: number }>;
  };
  quotes: {
    total: number;
    accepted: number;
  };
  recent_leads: {
    id: string;
    name: string;
    email: string;
    company: string | null;
    status: string;
    score: number;
    created_at: string | null;
  }[];
}

// --- Leads API ---

export async function getLeads(params?: {
  search?: string;
  status?: string;
  score_min?: number;
  score_max?: number;
  limit?: number;
  offset?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set("search", params.search);
  if (params?.status) searchParams.set("status", params.status);
  if (params?.score_min != null) searchParams.set("score_min", String(params.score_min));
  if (params?.score_max != null) searchParams.set("score_max", String(params.score_max));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.offset) searchParams.set("offset", String(params.offset));
  const qs = searchParams.toString();
  return fetchJson<LeadListResponse>(`/api/v1/leads/${qs ? `?${qs}` : ""}`);
}

export async function getLead(id: string) {
  return fetchJson<Lead>(`/api/v1/leads/${id}`);
}

export async function createLead(data: LeadCreate) {
  return fetchJson<Lead>("/api/v1/leads/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateLead(id: string, data: LeadUpdate) {
  return fetchJson<Lead>(`/api/v1/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteLead(id: string) {
  return fetchJson<void>(`/api/v1/leads/${id}`, { method: "DELETE" });
}

export async function bulkDeleteLeads(ids: string[]) {
  return fetchJson<void>("/api/v1/leads/bulk-delete", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}

export async function bulkUpdateLeadStatus(ids: string[], status: string) {
  return fetchJson<{ updated: number }>("/api/v1/leads/bulk-status", {
    method: "POST",
    body: JSON.stringify({ ids, status }),
  });
}

export async function convertLeadToOpportunity(leadId: string) {
  return fetchJson<Opportunity>(`/api/v1/leads/${leadId}/convert`, {
    method: "POST",
  });
}

// --- Opportunities API ---

export async function getOpportunities(params?: {
  search?: string;
  stage?: string;
  lead_id?: string;
  value_min?: number;
  value_max?: number;
  limit?: number;
  offset?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set("search", params.search);
  if (params?.stage) searchParams.set("stage", params.stage);
  if (params?.lead_id) searchParams.set("lead_id", params.lead_id);
  if (params?.value_min != null) searchParams.set("value_min", String(params.value_min));
  if (params?.value_max != null) searchParams.set("value_max", String(params.value_max));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.offset) searchParams.set("offset", String(params.offset));
  const qs = searchParams.toString();
  return fetchJson<OpportunityListResponse>(`/api/v1/opportunities/${qs ? `?${qs}` : ""}`);
}

export async function getOpportunity(id: string) {
  return fetchJson<Opportunity>(`/api/v1/opportunities/${id}`);
}

export async function createOpportunity(data: OpportunityCreate) {
  return fetchJson<Opportunity>("/api/v1/opportunities/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateOpportunity(id: string, data: OpportunityUpdate) {
  return fetchJson<Opportunity>(`/api/v1/opportunities/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteOpportunity(id: string) {
  return fetchJson<void>(`/api/v1/opportunities/${id}`, { method: "DELETE" });
}

export async function updateOpportunityStage(id: string, stage: string) {
  return fetchJson<Opportunity>(`/api/v1/opportunities/${id}/stage`, {
    method: "PATCH",
    body: JSON.stringify({ stage }),
  });
}

// --- Quotes API ---

export async function getQuotes(params?: {
  status?: string;
  opportunity_id?: string;
  limit?: number;
  offset?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  if (params?.opportunity_id) searchParams.set("opportunity_id", params.opportunity_id);
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.offset) searchParams.set("offset", String(params.offset));
  const qs = searchParams.toString();
  return fetchJson<QuoteListResponse>(`/api/v1/quotes/${qs ? `?${qs}` : ""}`);
}

export async function getQuote(id: string) {
  return fetchJson<Quote>(`/api/v1/quotes/${id}`);
}

export async function createQuote(data: QuoteCreate) {
  return fetchJson<Quote>("/api/v1/quotes/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateQuote(id: string, data: QuoteUpdate) {
  return fetchJson<Quote>(`/api/v1/quotes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteQuote(id: string) {
  return fetchJson<void>(`/api/v1/quotes/${id}`, { method: "DELETE" });
}

// --- Dashboard ---

export async function getDashboard() {
  return fetchJson<DashboardStats>("/api/v1/dashboard/");
}

export { ApiError };
