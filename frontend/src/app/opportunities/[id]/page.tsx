"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getOpportunity, updateOpportunity, deleteOpportunity, getQuotes,
  Opportunity, OpportunityUpdate, Quote,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const stages = ["prospecting", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"];

const stageVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  prospecting: "secondary", qualification: "default", proposal: "default",
  negotiation: "default", closed_won: "default", closed_lost: "destructive",
};

export default function OpportunityDetailPage() {
  const params = useParams(); const router = useRouter(); const id = params.id as string;
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<OpportunityUpdate>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [oppData, quotesData] = await Promise.all([getOpportunity(id), getQuotes({ opportunity_id: id })]);
        setOpportunity(oppData); setQuotes(quotesData.items);
        setForm({ title: oppData.title, value: oppData.value, stage: oppData.stage, probability: oppData.probability, expected_close_date: oppData.expected_close_date || undefined });
      } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to load opportunity"); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try { const updated = await updateOpportunity(id, form); setOpportunity(updated); setEditing(false); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to update"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this opportunity?")) return;
    try { await deleteOpportunity(id); router.push("/opportunities"); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to delete"); }
  };

  const advanceStage = async () => {
    const currentIdx = stages.indexOf(opportunity!.stage);
    if (currentIdx < stages.length - 1) {
      const nextStage = stages[currentIdx + 1];
      try { const updated = await updateOpportunity(id, { stage: nextStage }); setOpportunity(updated); setForm({ ...form, stage: nextStage }); }
      catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to advance stage"); }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-gray-500">Loading opportunity...</p></div>;
  if (error && !opportunity) return <div className="bg-red-50 border border-red-200 rounded-lg p-4"><p className="text-red-700">{error}</p><Button variant="outline" className="mt-2" onClick={() => router.push("/opportunities")}>Back to Opportunities</Button></div>;
  if (!opportunity) return null;

  const formatCurrency = (v: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(v);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" className="mb-1" onClick={() => router.push("/opportunities")}>← Back to Opportunities</Button>
          <h2 className="text-2xl font-bold text-gray-900">{opportunity.title}</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditing(!editing)}>{editing ? "Cancel" : "Edit"}</Button>
          <Button variant="default" onClick={advanceStage} disabled={stages.indexOf(opportunity.stage) >= stages.length - 1 || opportunity.stage === "closed_won" || opportunity.stage === "closed_lost"}>Advance Stage</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </div>
      </div>
      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3"><p className="text-red-700 text-sm">{error}</p></div>}

      <Card>
        <CardHeader><CardTitle>Opportunity Details</CardTitle></CardHeader>
        <CardContent>
          {editing ? (
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Title</Label><Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Value</Label><Input type="number" value={form.value || 0} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} /></div>
              <div>
                <Label>Stage</Label>
                <Select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
                  {stages.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                </Select>
              </div>
              <div><Label>Probability (%)</Label><Input type="number" value={form.probability || 0} onChange={(e) => setForm({ ...form, probability: Number(e.target.value) })} /></div>
              <div><Label>Expected Close Date</Label><Input type="date" value={form.expected_close_date?.toString() || ""} onChange={(e) => setForm({ ...form, expected_close_date: e.target.value || undefined })} /></div>
              <div className="col-span-2"><Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-gray-500">Value</Label><p className="text-2xl font-bold">{formatCurrency(opportunity.value)}</p></div>
              <div><Label className="text-gray-500">Stage</Label><Badge variant={stageVariant[opportunity.stage] || "outline"}>{opportunity.stage.replace("_", " ")}</Badge></div>
              <div><Label className="text-gray-500">Probability</Label><p>{opportunity.probability}%</p></div>
              <div><Label className="text-gray-500">Expected Close</Label><p>{opportunity.expected_close_date ? new Date(opportunity.expected_close_date).toLocaleDateString() : "—"}</p></div>
              <div><Label className="text-gray-500">Created</Label><p className="text-sm">{new Date(opportunity.created_at).toLocaleDateString()}</p></div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Quotes ({quotes.length})</CardTitle>
          <Button size="sm" onClick={() => router.push("/quotes")}>View All Quotes</Button>
        </CardHeader>
        <CardContent>
          {quotes.length === 0 ? <p className="text-gray-400 text-sm py-4">No quotes yet for this opportunity.</p> : (
            <div className="space-y-2">
              {quotes.map((quote) => (
                <div key={quote.id} className="flex items-center justify-between p-3 rounded-md bg-gray-50">
                  <div><p className="font-medium">Quote #{quote.id.slice(0, 8)}</p><p className="text-sm text-gray-500">{formatCurrency(quote.total)}</p></div>
                  <Badge variant={quote.status === "accepted" ? "default" : quote.status === "rejected" ? "destructive" : "secondary"}>{quote.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
