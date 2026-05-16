"use client";

import { useEffect, useState } from "react";
import { getDashboard, DashboardStats } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboard()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error loading dashboard: {error}</p>
      </div>
    );
  }

  if (!stats) return null;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);

  const stageColors: Record<string, string> = {
    prospecting: "bg-blue-100 text-blue-800",
    qualification: "bg-purple-100 text-purple-800",
    proposal: "bg-yellow-100 text-yellow-800",
    negotiation: "bg-orange-100 text-orange-800",
    closed_won: "bg-green-100 text-green-800",
    closed_lost: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.leads.total}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">{stats.leads.new} new</Badge>
              <Badge variant="default">{stats.leads.qualified} qualified</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Pipeline Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {formatCurrency(stats.opportunities.pipeline_value)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {stats.opportunities.total} open opportunities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Closed Won
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(stats.opportunities.closed_won_value)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Win rate: {stats.opportunities.win_rate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Quotes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.quotes.total}</p>
            <p className="text-sm text-gray-500 mt-1">
              {stats.quotes.accepted} accepted
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline by Stage */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline by Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(stats.opportunities.by_stage).map(
              ([stage, data]) => (
                <div
                  key={stage}
                  className="flex items-center gap-4 p-2 rounded-md bg-gray-50"
                >
                  <Badge
                    className={
                      stageColors[stage] || "bg-gray-100 text-gray-800"
                    }
                  >
                    {stage.replace("_", " ")}
                  </Badge>
                  <span className="text-sm text-gray-600 flex-1">
                    {data.count} deals
                  </span>
                  <span className="text-sm font-medium">
                    {formatCurrency(data.total_value)}
                  </span>
                </div>
              )
            )}
            {Object.keys(stats.opportunities.by_stage).length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">
                No opportunities yet. Create one to see pipeline breakdown.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Leads */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recent_leads.length > 0 ? (
            <div className="space-y-2">
              {stats.recent_leads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-3 rounded-md bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">{lead.name}</p>
                    <p className="text-sm text-gray-500">
                      {lead.company || "—"} · {lead.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{lead.status}</Badge>
                    <span className="text-sm text-gray-400">
                      Score: {lead.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-4">
              No leads yet. Add your first lead to get started.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
