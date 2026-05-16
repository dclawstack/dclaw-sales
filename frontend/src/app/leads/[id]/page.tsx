"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getLead, updateLead, deleteLead, convertLeadToOpportunity,
  getOpportunities, Lead, LeadUpdate, Opportunity,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const statusOptions = ["new", "contacted", "qualified", "lost"];
const sourceOptions = ["web", "referral", "cold-call", "linkedin", "event", "other"];

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  new: "secondary", contacted: "default", qualified: "default", lost: "destructive",
};

const stageVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  prospecting: "secondary", qualification: "default", proposal: "default",
  negotiation: "default", closed_won: "default", closed_lost: "destructive",
};

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<LeadUpdate>({});
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [leadData, oppsData] = await Promise.all([
          getLead(id), getOpportunities({ lead_id: id }),
        ]);
        setLead(leadData);
        setOpportunities(oppsData.items);
        setForm({
          name: leadData.name, email: leadData.email, phone: leadData.phone || "",
          company: leadData.company || "", source: leadData.source || "",
          status: leadData.status, score: leadData.score, assigned_to: leadData.assigned_to || "",
        });
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load lead");
      } finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateLead(id, form);
      setLead(updated);
      setEditing(false);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to update lead"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this lead?")) return;
    try { await deleteLead(id); router.push("/leads"); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to delete lead"); }
  };

  const handleConvert = async () => {
    setConverting(true);
    try {
      await convertLeadToOpportunity(id);
      const [leadData, oppsData] = await Promise.all([getLead(id), getOpportunities({ lead_id: id })]);
      setLead(leadData);
      setOpportunities(oppsData.items);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to convert lead"); }
    finally { setConverting(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-gray-500">Loading lead...</p></div>;

  if (error && !lead) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <p className="text-red-700">{error}</p>
      <Button variant="outline" className="mt-2" onClick={() => router.push("/leads")}>Back to Leads</Button>
    </div>
  );

  if (!lead) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" className="mb-1" onClick={() => router.push("/leads")}>← Back to Leads</Button>
          <h2 className="text-2xl font-bold text-gray-900">{lead.name}</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditing(!editing)}>{editing ? "Cancel" : "Edit"}</Button>
          <Button variant="outline" onClick={handleConvert} disabled={converting || lead.status === "lost"}>
            {converting ? "Converting..." : "Convert to Opportunity"}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3"><p className="text-red-700 text-sm">{error}</p></div>}

      <Card>
        <CardHeader><CardTitle>Lead Information</CardTitle></CardHeader>
        <CardContent>
          {editing ? (
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Name</Label><Input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Email</Label><Input value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>Phone</Label><Input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div><Label>Company</Label><Input value={form.company || ""} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
              <div>
                <Label>Source</Label>
                <Select value={form.source || "web"} onChange={(e) => setForm({ ...form, source: e.target.value })}>
                  {sourceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status || "new"} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
              <div><Label>Score</Label><Input type="number" value={form.score || 0} onChange={(e) => setForm({ ...form, score: Number(e.target.value) })} /></div>
              <div><Label>Assigned To</Label><Input value={form.assigned_to || ""} onChange={(e) => setForm({ ...form, assigned_to: e.target.value })} /></div>
              <div className="col-span-2"><Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-gray-500">Email</Label><p>{lead.email}</p></div>
              <div><Label className="text-gray-500">Phone</Label><p>{lead.phone || "—"}</p></div>
              <div><Label className="text-gray-500">Company</Label><p>{lead.company || "—"}</p></div>
              <div><Label className="text-gray-500">Source</Label><p>{lead.source || "—"}</p></div>
              <div><Label className="text-gray-500">Status</Label><Badge variant={statusVariant[lead.status] || "outline"}>{lead.status}</Badge></div>
              <div><Label className="text-gray-500">Score</Label><p className={`font-bold ${lead.score >= 70 ? "text-green-600" : lead.score >= 40 ? "text-yellow-600" : "text-red-600"}`}>{lead.score}/100</p></div>
              <div><Label className="text-gray-500">Assigned To</Label><p>{lead.assigned_to || "—"}</p></div>
              <div><Label className="text-gray-500">Created</Label><p className="text-sm">{new Date(lead.created_at).toLocaleDateString()}</p></div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Related Opportunities ({opportunities.length})</CardTitle></CardHeader>
        <CardContent>
          {opportunities.length === 0 ? (
            <p className="text-gray-400 text-sm py-4">No opportunities yet. Convert this lead to create one.</p>
          ) : (
            <div className="space-y-2">
              {opportunities.map((opp) => (
                <div key={opp.id} className="flex items-center justify-between p-3 rounded-md bg-gray-50">
                  <div><p className="font-medium">{opp.title}</p><p className="text-sm text-gray-500">Value: ${opp.value.toLocaleString()}</p></div>
                  <div className="flex items-center gap-2">
                    <Badge variant={stageVariant[opp.stage] || "outline"}>{opp.stage.replace("_", " ")}</Badge>
                    <span className="text-sm text-gray-400">{opp.probability}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
