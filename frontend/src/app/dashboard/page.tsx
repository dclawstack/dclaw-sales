"use client";

import { useState } from "react";

export default function DashboardPage() {
  const [leadName, setLeadName] = useState("");
  const [dealValue, setDealValue] = useState("");
  const [scored, setScored] = useState(false);

  function handleScore() {
    if (!leadName.trim()) return;
    setScored(true);
  }

  return (
    <div className="min-h-screen p-8">
      <h2 className="text-2xl font-bold mb-6">Sales Workspace</h2>
      <div className="max-w-xl space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-1">Lead Name</label>
          <input
            type="text"
            value={leadName}
            onChange={(e) => setLeadName(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D97706]"
            placeholder="e.g. Acme Corp"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Deal Value</label>
          <input
            type="number"
            value={dealValue}
            onChange={(e) => setDealValue(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D97706]"
            placeholder="e.g. 50000"
          />
        </div>
        <button
          onClick={handleScore}
          className="px-4 py-2 bg-[#D97706] text-white rounded-md hover:bg-[#B45309] transition"
        >
          Score Lead
        </button>
      </div>

      {scored && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Lead Score</p>
            <p className="text-3xl font-bold text-[#D97706]">87</p>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Recommended Sequence</p>
            <p className="text-lg font-semibold">5-Step Nurture</p>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Expected Close Date</p>
            <p className="text-lg font-semibold">2026-06-15</p>
          </div>
        </div>
      )}
    </div>
  );
}
