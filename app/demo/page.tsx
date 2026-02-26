import type { Metadata } from "next"
import Link from "next/link"
import { Shield, CheckCircle2, AlertCircle, XCircle, Building2, FileText, Phone, ArrowRight, Calendar, TrendingUp, Sparkles, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { demoCompanies, demoFilings, demoDocuments, demoInteractions } from "@/lib/demo-data"

export const metadata: Metadata = {
  title: "Product Demo — GoodStanding.ai",
  description: "See the GoodStanding.ai compliance dashboard in action — entity status, filing deadlines, document vault, and government liaison all in one place.",
  openGraph: {
    title: "Product Demo — GoodStanding.ai",
    description: "See the compliance dashboard before you sign up. No login required.",
    url: "https://goodstanding.ai/demo",
  },
}

function StatusBadge({ status }: { status: string }) {
  if (status === "good_standing")
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Good Standing</span>
  if (status === "attention_needed")
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Action Needed</span>
  return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200"><span className="w-1.5 h-1.5 rounded-full bg-red-500" />Critical</span>
}

function FilingBadge({ status }: { status: string }) {
  if (status === "completed") return <span className="text-xs px-2 py-0.5 rounded border bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold">Filed ✓</span>
  if (status === "overdue")   return <span className="text-xs px-2 py-0.5 rounded border bg-red-50 text-red-700 border-red-200 font-semibold">Overdue</span>
  return <span className="text-xs px-2 py-0.5 rounded border bg-amber-50 text-amber-700 border-amber-200 font-semibold">Pending</span>
}

function FilingIcon({ status }: { status: string }) {
  if (status === "completed") return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
  if (status === "overdue")   return <XCircle className="w-4 h-4 text-red-500" />
  return <AlertCircle className="w-4 h-4 text-amber-500" />
}

export default function DemoPage() {
  const companies = demoCompanies
  const filings = demoFilings
  const documents = demoDocuments
  const interactions = demoInteractions

  const primaryCompany = companies[0]
  const primaryFilings = filings.filter((f) => f.company_id === primaryCompany.id)
  const overdueFilings = filings.filter((f) => f.status === "overdue")
  const pendingFilings = filings.filter((f) => f.status === "pending")
  const completedFilings = filings.filter((f) => f.status === "completed")

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top banner */}
      <div className="bg-[#1B2B4B] text-white px-4 py-3 text-center">
        <p className="text-sm font-medium">
          This is an <strong>interactive demo</strong> with sample data — sidebar links go to the real dashboard.{" "}
          <Link href="/signup" className="underline font-bold text-emerald-300 hover:text-emerald-200 ml-1">
            Start free →
          </Link>
        </p>
      </div>

      {/* Fake sidebar + dashboard layout */}
      <div className="flex h-[calc(100vh-44px)]">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-60 bg-[#0F1829] flex-col flex-shrink-0">
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/10">
            <div className="w-7 h-7 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-bold text-white text-sm">
              GoodStanding<span className="text-emerald-400">.ai</span>
            </span>
          </div>

          {/* Company selector mock */}
          <div className="px-3 py-3 border-b border-white/10">
            <div className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/5">
              <div className="w-7 h-7 bg-[#1B2B4B] rounded-md flex items-center justify-center flex-shrink-0">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{primaryCompany.name}</p>
                <p className="text-white/40 text-xs">2 companies</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {[
              { icon: TrendingUp, label: "Overview", href: "/dashboard", active: true },
              { icon: CheckCircle2, label: "Compliance", href: "/dashboard/compliance" },
              { icon: FolderOpen, label: "Documents", href: "/dashboard/documents" },
              { icon: Calendar, label: "Calendar", href: "/dashboard/calendar" },
              { icon: Phone, label: "Gov't Liaison", href: "/dashboard/government" },
              { icon: Sparkles, label: "AI Assistant", href: "/dashboard/assistant" },
            ].map(({ icon: Icon, label, href, active }) => (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-emerald-400" : "text-white/30"}`} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Bottom CTA */}
          <div className="px-3 pb-4">
            <Link href="/signup">
              <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold py-2.5 px-4 rounded-lg transition-colors">
                Start free
              </button>
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          {/* Mobile top bar */}
          <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#1B2B4B]" />
              <span className="font-bold text-[#1B2B4B] text-sm">GoodStanding.ai</span>
            </div>
            <Link href="/signup">
              <Button size="sm" className="bg-[#1B2B4B] text-white text-xs">Start free</Button>
            </Link>
          </div>

          <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-1">
                Good morning, Sarah. 👋
              </h1>
              <p className="text-slate-500">
                1 company needs your attention. Review overdue items below.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Companies",      value: companies.length,      icon: Building2,    color: "text-blue-600",    bg: "bg-blue-50"    },
                { label: "Good Standing",  value: companies.filter(c => c.status === "good_standing").length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Upcoming",       value: pendingFilings.length, icon: Calendar,     color: "text-amber-600",   bg: "bg-amber-50"   },
                { label: "Overdue",        value: overdueFilings.length, icon: AlertCircle,  color: "text-red-600",     bg: "bg-red-50"     },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left: companies */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-lg font-bold text-slate-900">Your companies</h2>

                {companies.map((company) => {
                  const compFilings = filings.filter((f) => f.company_id === company.id)
                  return (
                    <div
                      key={company.id}
                      className={`bg-white rounded-xl border shadow-sm p-6 ${
                        company.status !== "good_standing" ? "border-amber-200" : "border-slate-200"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-[#1B2B4B] rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900">{company.name}</h3>
                            <p className="text-slate-400 text-sm">
                              {company.entity_type === "c_corp" ? "C-Corporation" : "LLC"} · {company.state_of_incorporation}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={company.status} />
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {compFilings.slice(0, 3).map((filing) => (
                          <div
                            key={filing.id}
                            className={`rounded-lg p-3 border ${
                              filing.status === "overdue" ? "bg-red-50 border-red-100"
                              : filing.status === "completed" ? "bg-emerald-50 border-emerald-100"
                              : "bg-amber-50 border-amber-100"
                            }`}
                          >
                            <div className="flex items-center gap-1.5 mb-1">
                              <FilingIcon status={filing.status} />
                              <FilingBadge status={filing.status} />
                            </div>
                            <p className="text-xs font-semibold text-slate-700 leading-tight">{filing.type}</p>
                            <p className="text-xs text-slate-400">{filing.state}</p>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          {compFilings.filter(f => f.status === "overdue").length > 0 && (
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" />{compFilings.filter(f => f.status === "overdue").length} overdue</span>
                          )}
                          {compFilings.filter(f => f.status === "pending").length > 0 && (
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" />{compFilings.filter(f => f.status === "pending").length} pending</span>
                          )}
                        </div>
                        <Link href="/signup" className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-1">
                          View details <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Right panel */}
              <div className="space-y-5">
                {/* Filing breakdown */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    Filing breakdown
                  </h3>
                  <div className="space-y-2.5">
                    {[
                      { label: "Filed",   count: completedFilings.length, cls: "bg-emerald-400", pct: completedFilings.length / filings.length },
                      { label: "Pending", count: pendingFilings.length,   cls: "bg-amber-400",   pct: pendingFilings.length   / filings.length },
                      { label: "Overdue", count: overdueFilings.length,   cls: "bg-red-400",     pct: overdueFilings.length   / filings.length },
                    ].map((row) => (
                      <div key={row.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-slate-500">{row.label}</span>
                          <span className="text-sm font-bold text-slate-900">{row.count}</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full">
                          <div
                            className={`h-1.5 rounded-full ${row.cls}`}
                            style={{ width: `${Math.round(row.pct * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gov't Liaison */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-500" />
                    Government Liaison
                  </h3>
                  <div className="space-y-3">
                    {interactions.map((interaction) => (
                      <div key={interaction.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-700 leading-tight">{interaction.type}</p>
                          <p className="text-xs text-slate-400">{interaction.agency}</p>
                        </div>
                        <span className="text-xs font-semibold text-emerald-600 flex-shrink-0">Resolved</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/signup" className="block mt-4">
                    <button className="w-full bg-[#1B2B4B] hover:bg-[#243461] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                      <Phone className="w-3.5 h-3.5" />
                      Request government call
                    </button>
                  </Link>
                </div>

                {/* Documents */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    Document vault
                  </h3>
                  <div className="space-y-2">
                    {documents.slice(0, 4).map((doc) => (
                      <div key={doc.id} className="flex items-center gap-3 py-1.5">
                        <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-700 truncate">{doc.name}</p>
                          <p className="text-xs text-slate-400">{doc.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA section */}
            <div className="mt-12 bg-[#1B2B4B] rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-3">
                Ready to keep your startup in good standing?
              </h2>
              <p className="text-white/60 mb-6 max-w-md mx-auto">
                Formation is free. Compliance monitoring from $99/mo. Cancel anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/signup">
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8">
                    Start for free <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" className="border-white/20 text-white bg-transparent hover:bg-white/10">
                    See pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
