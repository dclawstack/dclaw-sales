"use client";

import { useEffect, useState, useCallback } from "react";
import { getQuotes, createQuote, deleteQuote, updateQuote, getOpportunities, Quote, QuoteCreate, Opportunity } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const quoteStatuses = ["draft", "sent", "accepted", "rejected", "expired"];

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "secondary", sent: "default", accepted: "default", rejected: "destructive", expired: "outline",
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [form, setForm] = useState<QuoteCreate>({ opportunity_id: "", total: 0, status: "draft" });
  const [submitting, setSubmitting] = useState(false);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try { const data = await getQuotes({ status: statusFilter || undefined, limit: 50 }); setQuotes(data.items); setError(null); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to load quotes"); }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => {
    fetchQuotes();
    getOpportunities({ limit: 100 }).then((d) => setOpportunities(d.items)).catch(() => {});
  }, [fetchQuotes]);

  const handleCreate = async () => {
    setSubmitting(true);
    try { await createQuote(form); setDialogOpen(false); setForm({ opportunity_id: "", total: 0, status: "draft" }); fetchQuotes(); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to create quote"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this quote?")) return;
    try { await deleteQuote(id); fetchQuotes(); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to delete quote"); }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try { await updateQuote(id, { status: newStatus }); fetchQuotes(); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to update quote"); }
  };

  const formatCurrency = (v: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(v);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Quotes</h2>
        <Button onClick={() => setDialogOpen(true)}>Add Quote</Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Quote</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Opportunity *</Label>
              <Select value={form.opportunity_id} onChange={(e) => setForm({ ...form, opportunity_id: e.target.value })}>
                <option value="">Select opportunity</option>
                {opportunities.map((opp) => <option key={opp.id} value={opp.id}>{opp.title} ({formatCurrency(opp.value)})</option>)}
              </Select>
            </div>
            <div><Label>Total</Label><Input type="number" value={form.total || 0} onChange={(e) => setForm({ ...form, total: Number(e.target.value) })} /></div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {quoteStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>
            <Button className="w-full" onClick={handleCreate} disabled={submitting || !form.opportunity_id}>{submitting ? "Creating..." : "Create Quote"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex gap-2">
        <Button variant={statusFilter === "" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("")}>All</Button>
        {quoteStatuses.map((s) => (
          <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(s)}>{s}</Button>
        ))}
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3"><p className="text-red-700 text-sm">{error}</p></div>}

      {loading ? <p className="text-gray-500 text-center py-8">Loading...</p> : quotes.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No quotes found. Create one to get started.</p>
      ) : (
        <Card>
          <CardContent className="pt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium text-gray-500">Quote ID</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500">Total</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500">Status</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500">Created</th>
                  <th className="text-right py-2 px-3 font-medium text-gray-500">Actions</th>
                </tr></thead>
                <tbody>
                  {quotes.map((quote) => (
                    <tr key={quote.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-3 font-mono text-xs">{quote.id.slice(0, 8)}...</td>
                      <td className="py-2 px-3 font-medium">{formatCurrency(quote.total)}</td>
                      <td className="py-2 px-3"><Badge variant={statusVariant[quote.status] || "outline"}>{quote.status}</Badge></td>
                      <td className="py-2 px-3 text-gray-500">{new Date(quote.created_at).toLocaleDateString()}</td>
                      <td className="py-2 px-3 text-right">
                        <div className="flex gap-1 justify-end">
                          {quote.status === "draft" && <Button variant="outline" size="sm" onClick={() => handleStatusChange(quote.id, "sent")}>Send</Button>}
                          {quote.status === "sent" && (<>
                            <Button variant="default" size="sm" onClick={() => handleStatusChange(quote.id, "accepted")}>Accept</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleStatusChange(quote.id, "rejected")}>Reject</Button>
                          </>)}
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(quote.id)}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
