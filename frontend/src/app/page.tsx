"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BarChart3,
  Users,
  KanbanSquare,
  FileText,
  ArrowRight,
  Zap,
  Search,
  Layers,
  Shield,
  ChevronRight,
  Sparkles,
  Target,
  TrendingUp,
  Workflow,
  Menu,
  X,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Lead Management",
    description:
      "Capture, score, and organize leads from any source. Smart search, bulk operations, and status tracking keep your pipeline clean.",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    icon: KanbanSquare,
    title: "Visual Pipeline",
    description:
      "Drag-and-drop Kanban board across 6 opportunity stages. See deal value, probability, and stage breakdowns at a glance.",
    color: "from-purple-500 to-pink-500",
    bg: "bg-purple-50",
    text: "text-purple-600",
  },
  {
    icon: FileText,
    title: "Quote Management",
    description:
      "Create, send, and track quotes tied to opportunities. Accept, reject, or expire — with full status workflow automation.",
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description:
      "Live dashboard with pipeline value, win rates, stage breakdowns, and recent activity. Know your numbers instantly.",
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  {
    icon: Search,
    title: "Smart Search & Filters",
    description:
      "Find any lead, opportunity, or quote in seconds. Filter by status, score, stage, and more with URL-synced params.",
    color: "from-rose-500 to-red-500",
    bg: "bg-rose-50",
    text: "text-rose-600",
  },
  {
    icon: Workflow,
    title: "Lead Conversion",
    description:
      "One-click convert leads to opportunities. Pre-filled fields, automatic status updates, and full relationship tracking.",
    color: "from-indigo-500 to-violet-500",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
  },
];

const stats = [
  { value: "17", label: "API Endpoints", suffix: "" },
  { value: "3", label: "Core Entities", suffix: "" },
  { value: "28", label: "Automated Tests", suffix: "" },
  { value: "100", label: "Test Pass Rate", suffix: "%" },
];

const pipelineStages = [
  { name: "Prospecting", color: "bg-blue-500", deals: "New leads & research" },
  { name: "Qualification", color: "bg-purple-500", deals: "BANT & scoring" },
  { name: "Proposal", color: "bg-yellow-500", deals: "Quotes & pricing" },
  { name: "Negotiation", color: "bg-orange-500", deals: "Terms & closing" },
  { name: "Closed Won", color: "bg-green-500", deals: "Revenue booked" },
  { name: "Closed Lost", color: "bg-red-500", deals: "Churn analysis" },
];

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen">
      {/* ───── Navbar ───── */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900">DClaw Sales</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pipeline" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Pipeline</a>
              <a href="#stats" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Stats</a>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Open App <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
            <a href="#features" className="block py-2 text-sm text-gray-600" onClick={() => setMobileMenu(false)}>Features</a>
            <a href="#pipeline" className="block py-2 text-sm text-gray-600" onClick={() => setMobileMenu(false)}>Pipeline</a>
            <Link href="/dashboard" className="block py-2 text-sm font-medium text-blue-600" onClick={() => setMobileMenu(false)}>
              Open App →
            </Link>
          </div>
        )}
      </nav>

      {/* ───── Hero Section ───── */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            v1.0.0-beta — Now Available
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 max-w-4xl mx-auto leading-[1.1]">
            Your Sales Pipeline,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Supercharged
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Track leads, manage opportunities on a visual Kanban board, generate quotes,
            and monitor pipeline health — all in one AI-ready sales operating system.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 text-white rounded-xl text-base font-semibold hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20"
            >
              Launch Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-700 rounded-xl text-base font-semibold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              Explore Features <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Hero illustration */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="relative rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-900/5 overflow-hidden">
              {/* Mock window bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-gray-400">DClaw Sales — Dashboard</span>
              </div>
              {/* Mock dashboard */}
              <div className="p-6 grid grid-cols-4 gap-4">
                {[
                  { label: "Total Leads", value: "1,247", sub: "342 new · 518 qualified", color: "bg-blue-50 border-blue-100" },
                  { label: "Pipeline Value", value: "$2.8M", sub: "43 open opportunities", color: "bg-purple-50 border-purple-100" },
                  { label: "Closed Won", value: "$892K", sub: "Win rate: 68%", color: "bg-green-50 border-green-100" },
                  { label: "Quotes", value: "156", sub: "89 accepted", color: "bg-amber-50 border-amber-100" },
                ].map((card, i) => (
                  <div key={i} className={`rounded-xl border p-4 ${card.color}`}>
                    <p className="text-xs font-medium text-gray-500">{card.label}</p>
                    <p className="text-2xl font-bold mt-1 text-gray-900">{card.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{card.sub}</p>
                  </div>
                ))}
              </div>
              {/* Mock pipeline bar */}
              <div className="px-6 pb-6">
                <p className="text-xs font-medium text-gray-400 mb-3">Pipeline by Stage</p>
                <div className="flex gap-1.5">
                  {pipelineStages.map((stage) => (
                    <div
                      key={stage.name}
                      className="flex-1 h-2 rounded-full opacity-70"
                      style={{
                        background: stage.color.replace("bg-", "").includes("blue")
                          ? "#3b82f6"
                          : stage.color.replace("bg-", "").includes("purple")
                          ? "#8b5cf6"
                          : stage.color.replace("bg-", "").includes("yellow")
                          ? "#eab308"
                          : stage.color.replace("bg-", "").includes("orange")
                          ? "#f97316"
                          : stage.color.replace("bg-", "").includes("green")
                          ? "#22c55e"
                          : "#ef4444",
                        width: `${[18, 22, 25, 15, 12, 8][pipelineStages.indexOf(stage)]}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Features Section ───── */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything You Need to Close More Deals
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Purpose-built for sales teams. No bloated CRM — just the tools that move deals forward.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="group relative bg-white rounded-2xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${feature.text}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───── Pipeline Section ───── */}
      <section id="pipeline" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-100 text-green-700 text-sm font-medium mb-6">
              <Layers className="w-3.5 h-3.5" />
              Visual Pipeline
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              See Your Entire Pipeline at a Glance
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Drag deals across 6 stages. Watch pipeline value update in real time. Never lose track of a deal again.
            </p>
          </div>

          {/* Pipeline visualization */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {pipelineStages.map((stage, i) => (
              <div
                key={i}
                className="relative rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow"
              >
                <div className={`w-3 h-3 rounded-full ${stage.color} mb-3`} />
                <h4 className="font-semibold text-sm text-gray-900">{stage.name}</h4>
                <p className="text-xs text-gray-400 mt-1">{stage.deals}</p>
                {/* Arrow */}
                {i < pipelineStages.length - 1 && (
                  <ChevronRight className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 hidden lg:block" />
                )}
              </div>
            ))}
          </div>

          {/* Kanban preview */}
          <div className="mt-12 p-6 rounded-2xl border border-gray-200 bg-gray-50">
            <div className="grid grid-cols-3 gap-4">
              {[
                { title: "Acme Corp Deal", value: "$50K", prob: "75%", stage: "Proposal" },
                { title: "Globex Partnership", value: "$120K", prob: "50%", stage: "Negotiation" },
                { title: "Initech Renewal", value: "$35K", prob: "90%", stage: "Qualification" },
              ].map((deal, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="font-medium text-sm text-gray-900">{deal.title}</p>
                  <p className="text-lg font-bold mt-1">{deal.value}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-400">{deal.stage}</span>
                    <span className="text-xs font-medium text-green-600">{deal.prob}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── How It Works ───── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              From Lead to Revenue in 3 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Users,
                title: "Capture Leads",
                desc: "Add leads from any source — web forms, referrals, cold outreach. Auto-score and assign to your team.",
              },
              {
                step: "02",
                icon: KanbanSquare,
                title: "Move Through Pipeline",
                desc: "Convert leads to opportunities. Drag deals across stages from prospecting to closed won.",
              },
              {
                step: "03",
                icon: TrendingUp,
                title: "Close & Analyze",
                desc: "Generate quotes, track acceptances, and analyze win rates. Optimize your sales process with data.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="relative text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-600 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-xs font-bold text-blue-600 tracking-wider">{item.step}</span>
                  <h3 className="text-xl font-semibold text-gray-900 mt-2 mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───── Stats Section ───── */}
      <section id="stats" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-900 rounded-3xl p-12 sm:p-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, i) => (
                <div key={i}>
                  <p className="text-4xl sm:text-5xl font-bold text-white">
                    {stat.value}
                    <span className="text-blue-400">{stat.suffix}</span>
                  </p>
                  <p className="mt-2 text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t border-gray-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: Shield, text: "TypeScript + FastAPI" },
                { icon: Zap, text: "PostgreSQL 16" },
                { icon: Target, text: "Docker Ready" },
                { icon: Layers, text: "Helm + K8s" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center justify-center gap-2 text-gray-400">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ───── CTA Section ───── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Close More Deals?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Launch your sales pipeline dashboard now. Track leads, manage opportunities,
            and generate quotes — all in one place.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 rounded-xl text-base font-semibold hover:bg-gray-50 transition-all shadow-lg"
            >
              Launch Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/dclawstack/dclaw-sales"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-white rounded-xl text-base font-semibold border border-white/30 hover:bg-white/10 transition-all"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-medium text-white">DClaw Sales</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <Link href="/leads" className="hover:text-white transition-colors">Leads</Link>
              <Link href="/opportunities" className="hover:text-white transition-colors">Opportunities</Link>
              <Link href="/quotes" className="hover:text-white transition-colors">Quotes</Link>
            </div>
            <p className="text-xs">
              Built on{" "}
              <a href="https://github.com/dclawstack" className="hover:text-white transition-colors">
                DClaw Stack
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
