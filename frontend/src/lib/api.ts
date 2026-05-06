const API_BASE = "/api/v1";

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || res.statusText);
  }
  return res.json() as Promise<T>;
}

export type Lead = {
  id: string;
  name: string;
  email: string;
  deal_value: number;
  score: number;
  status: string;
  created_at: string;
};

export type EmailSequence = {
  step_number: number;
  subject: string;
  body_template: string;
  delay_days: number;
};
