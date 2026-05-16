"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  getOpportunities, createOpportunity, updateOpportunityStage, deleteOpportunity,
  Opportunity, OpportunityCreate, getLeads, Lead,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const stages = ["prospecting", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"];

const stageColors: Record<string, string> = {
  prospecting: "bg-blue-50 border-blue-200", qualification: "bg-purple-50 border-purple-200",
  proposal: "bg-yellow-50 border-yellow-200", negotiation: "bg-orange-50 border-orange-200",
  closed_won: "bg-green-50 border-green-200", closed_lost: "bg-red-50 border-red-200",
};

const stageVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  prospecting: "secondary", qualification: "default", proposal: "default",
  negotiation: "default", closed_won: "default", closed_lost: "destructive",
};

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [form, setForm] = useState<OpportunityCreate>({ title: "", value: 0, stage: "prospecting", probability: 0, lead_id: undefined });
  const [submitting, setSubmitting] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOpportunities({ search: search || undefined, limit: 100 });
      setOpportunities(data.items);
      setError(null);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to load opportunities"); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => {
    fetchOpportunities();
    getLeads({ limit: 100 }).then((data) => setLeads(data.items)).catch(() => {});
  }, [fetchOpportunities]);

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      await createOpportunity(form);
      setDialogOpen(false);
      setForm({ title: "", value: 0, stage: "prospecting", probability: 0 });
      fetchOpportunities();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to create opportunity"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this opportunity?")) return;
    try { await deleteOpportunity(id); fetchOpportunities(); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to delete opportunity"); }
  };

  const handleDragStart = (id: string) => setDraggedId(id);

  const handleDrop = async (stage: string) => {
    if (!draggedId) return;
    try {
      await updateOpportunityStage(draggedId, stage);
      setOpportunities((prev) => prev.map((opp) => opp.id === draggedId ? { ...opp, stage } : opp));
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to update stage"); }
    setDraggedId(null);
  };

  const getStageOpportunities = (stage: string) => opportunities.filter((opp) => opp.stage === stage);

  const formatCurrency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(value);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Opportunities</h2>
        <Button onClick={() => setDialogOpen(true)}>Add Opportunity</Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Opportunity</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Deal title" /></div>
            <div><Label>Value</Label><Input type="number" value={form.value || 0} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} /></div>
            <div>
              <Label>Stage</Label>
              <Select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
                {stages.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
              </Select>
            </div>
            <div><Label>Probability (%)</Label><Input type="number" value={form.probability || 0} onChange={(e) => setForm({ ...form, probability: Number(e.target.value) })} min={0} max={100} /></div>
            <div>
              <Label>Lead (optional)</Label>
              <Select value={form.lead_id || ""} onChange={(e) => setForm({ ...form, lead_id: e.target.value || undefined })}>
                <option value="">None</option>
                {leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.name}</option>)}
              </Select>
            </div>
            <Button className="w-full" onClick={handleCreate} disabled={submitting || !form.title}>
              {submitting ? "Creating..." : "Create Opportunity"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search opportunities..." className="max-w-md" />

      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3"><p className="text-red-700 text-sm">{error}</p></div>}

      {loading ? (
        <p className="text-gray-500 text-center py-8">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stages.map((stage) => {
            const stageOpps = getStageOpportunities(stage);
            const stageTotal = stageOpps.reduce((sum, o) => sum + o.value, 0);
            return (
              <div key={stage} className={`rounded-lg border p-3 min-h-[200px] ${stageColors[stage]}`}
                onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(stage)}>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={stageVariant[stage]}>{stage.replace("_", " ")}</Badge>
                  <span className="text-xs text-gray-500">{stageOpps.length} · {formatCurrency(stageTotal)}</span>
                </div>
                <div className="space-y-2">
                  {stageOpps.map((opp) => (
                    <Card key={opp.id} className={`cursor-grab active:cursor-grabbing ${draggedId === opp.id ? "opacity-50" : ""}`}
                      draggable onDragStart={() => handleDragStart(opp.id)}>
                      <CardContent className="p-3">
                        <Link href={`/opportunities/${opp.id}`} className="font-medium text-sm text-blue-600 hover:underline">{opp.title}</Link>
                        <p className="text-sm font-bold mt-1">{formatCurrency(opp.value)}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">{opp.probability}%</span>
                          <Button variant="ghost" size="sm" className="text-xs h-6 text-red-500 hover:text-red-700"
                            onClick={(e) => { e.preventDefault(); handleDelete(opp.id); }}>×</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
