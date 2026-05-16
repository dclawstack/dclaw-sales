"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  getLeads,
  createLead,
  deleteLead,
  bulkDeleteLeads,
  Lead,
  LeadCreate,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const statusOptions = ["new", "contacted", "qualified", "lost"];
const sourceOptions = ["web", "referral", "cold-call", "linkedin", "event", "other"];

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  new: "secondary",
  contacted: "default",
  qualified: "default",
  lost: "destructive",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<LeadCreate>({
    name: "",
    email: "",
    company: "",
    source: "web",
    status: "new",
    score: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const limit = 20;

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLeads({
        search: search || undefined,
        status: statusFilter || undefined,
        limit,
        offset: page * limit,
      });
      setLeads(data.items);
      setTotal(data.total);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === leads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(leads.map((l) => l.id)));
    }
  };

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      await createLead(form);
      setDialogOpen(false);
      setForm({ name: "", email: "", company: "", source: "web", status: "new", score: 0 });
      fetchLeads();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create lead");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    try {
      await deleteLead(id);
      fetchLeads();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete lead");
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.size} leads?`)) return;
    try {
      await bulkDeleteLeads(Array.from(selectedIds));
      setSelectedIds(new Set());
      fetchLeads();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete leads");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Leads</h2>
        <Button onClick={() => setDialogOpen(true)}>Add Lead</Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@company.com" />
            </div>
            <div>
              <Label>Company</Label>
              <Input value={form.company || ""} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name" />
            </div>
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
            <div>
              <Label>Score</Label>
              <Input type="number" value={form.score || 0} onChange={(e) => setForm({ ...form, score: Number(e.target.value) })} min={0} max={100} />
            </div>
            <Button className="w-full" onClick={handleCreate} disabled={submitting || !form.name || !form.email}>
              {submitting ? "Creating..." : "Create Lead"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="pt-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>Search</Label>
              <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder="Search by name, email, or company..." />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value === "all" ? "" : e.target.value); setPage(0); }}>
                <option value="all">All</option>
                {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg">
          <span className="text-sm text-blue-700">{selectedIds.size} selected</span>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>Delete Selected</Button>
        </div>
      )}

      <Card>
        <CardContent className="pt-4">
          {loading ? (
            <p className="text-gray-500 text-center py-8">Loading leads...</p>
          ) : leads.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No leads found. Add your first lead.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-1 w-8"><input type="checkbox" checked={selectedIds.size === leads.length && leads.length > 0} onChange={toggleAll} /></th>
                      <th className="text-left py-2 px-3 font-medium text-gray-500">Name</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-500">Company</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-500">Email</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-500">Status</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-500">Score</th>
                      <th className="text-right py-2 px-3 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-1"><input type="checkbox" checked={selectedIds.has(lead.id)} onChange={() => toggleSelect(lead.id)} /></td>
                        <td className="py-2 px-3">
                          <Link href={`/leads/${lead.id}`} className="text-blue-600 hover:underline font-medium">{lead.name}</Link>
                        </td>
                        <td className="py-2 px-3 text-gray-600">{lead.company || "—"}</td>
                        <td className="py-2 px-3 text-gray-600">{lead.email}</td>
                        <td className="py-2 px-3"><Badge variant={statusVariant[lead.status] || "outline"}>{lead.status}</Badge></td>
                        <td className="py-2 px-3">
                          <span className={`font-medium ${lead.score >= 70 ? "text-green-600" : lead.score >= 40 ? "text-yellow-600" : "text-red-600"}`}>{lead.score}</span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(lead.id)}>Delete</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-500">Showing {page * limit + 1}–{Math.min((page + 1) * limit, total)} of {total}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
                    <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
