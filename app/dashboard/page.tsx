"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase"
import type { Company, Filing, GovernmentInteraction } from "@/lib/supabase"
import { SetupChecklist, type ChecklistItem } from "@/components/dashboard/SetupChecklist"
import { ShareStatusModal } from "@/components/dashboard/ShareStatusModal"
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowRight,
  Phone,
  FileCheck,
  Calendar,
  Building2,
  TrendingUp,
  Share2,
} from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

function StatusBadge({ status }: { status: string }) {
  if (status === "good_standing")
    return (
      <Badge variant="green">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
        Good Standing
      </Badge>
    )
  if (status === "attention_needed")
    return (
      <Badge variant="yellow">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
        Action Needed
      </Badge>
    )
  return (
    <Badge variant="red">
      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />
      Critical
    </Badge>
  )
}

function FilingStatusIcon({ status }: { status: string }) {
  if (status === "completed") return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
  if (status === "overdue") return <XCircle className="w-4 h-4 text-red-500" />
  return <AlertCircle className="w-4 h-4 text-amber-500" />
}

function FilingStatusLabel({ status }: { status: string }) {
  if (status === "completed") return <span className="text-xs text-emerald-600 font-semibold">Filed ✓</span>
  if (status === "overdue") return <span className="text-xs text-red-600 font-semibold">Overdue</span>
  return <span className="text-xs text-amber-600 font-semibold">Pending</span>
}

const HEALTH_COLORS = { completed: "#10b981", pending: "#f59e0b", overdue: "#ef4444" }

function FilingHealthChart({ filings }: { filings: Filing[] }) {
  if (filings.length === 0) {
    return <p className="text-xs text-slate-400 text-center py-6">No filings tracked yet</p>
  }

  const completed = filings.filter((f) => f.status === "completed").length
  const pending   = filings.filter((f) => f.status === "pending").length
  const overdue   = filings.filter((f) => f.status === "overdue").length

  const data = [
    { name: "Filed",   value: completed, color: HEALTH_COLORS.completed },
    { name: "Pending", value: pending,   color: HEALTH_COLORS.pending },
    { name: "Overdue", value: overdue,   color: HEALTH_COLORS.overdue },
  ].filter((d) => d.value > 0)

  return (
    <div>
      <div className="relative">
        <ResponsiveContainer width="100%" height={130}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={42}
              outerRadius={60}
              paddingAngle={3}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [value, name]}
              contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "4px 8px" }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-2xl font-bold text-slate-900 leading-none">{filings.length}</p>
          <p className="text-xs text-slate-400">total</p>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-2">
        {data.map((entry, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-xs text-slate-500">{entry.name} <span className="font-semibold text-slate-700">{entry.value}</span></span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [filings, setFilings] = useState<Filing[]>([])
  const [interactions, setInteractions] = useState<GovernmentInteraction[]>([])
  const [docCounts, setDocCounts] = useState<Record<string, number>>({})
  const [firstName, setFirstName] = useState("")
  const [loading, setLoading] = useState(true)
  const [dismissedChecklists, setDismissedChecklists] = useState<Set<string>>(new Set())
  const [sharingCompany, setSharingCompany] = useState<Company | null>(null)

  // Load dismissed state from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("gs_checklist_dismissed")
      if (raw) setDismissedChecklists(new Set(JSON.parse(raw)))
    } catch {}
  }, [])

  const dismissChecklist = useCallback((companyId: string) => {
    setDismissedChecklists((prev) => {
      const next = new Set(prev).add(companyId)
      try { localStorage.setItem("gs_checklist_dismissed", JSON.stringify([...next])) } catch {}
      return next
    })
  }, [])

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const fullName = user.user_metadata?.full_name ?? user.email ?? ""
        setFirstName(fullName.split(" ")[0])
      }

      const [{ data: companiesData }, { data: filingsData }, { data: interactionsData }] = await Promise.all([
        supabase.from("companies").select("*").order("created_at", { ascending: true }),
        supabase.from("filings").select("*").order("due_date", { ascending: true }),
        supabase.from("government_interactions").select("*").order("created_at", { ascending: false }),
      ])

      const companies = companiesData ?? []
      const filings = filingsData ?? []

      // Auto-sync company status based on filing health
      for (const company of companies) {
        const companyFilings = filings.filter((f) => f.company_id === company.id)
        const overdueCount = companyFilings.filter((f) => f.status === "overdue").length
        const newStatus: Company["status"] =
          overdueCount >= 3 ? "action_required"
          : overdueCount >= 1 ? "attention_needed"
          : "good_standing"
        if (newStatus !== company.status) {
          company.status = newStatus
          await supabase.from("companies").update({ status: newStatus }).eq("id", company.id)
        }
      }

      setCompanies(companies)
      setFilings(filings)
      setInteractions(interactionsData ?? [])

      // Load document counts per company
      if (companies.length > 0) {
        const { data: docsData } = await supabase
          .from("documents")
          .select("company_id")
          .in("company_id", companies.map((c) => c.id))
        const counts: Record<string, number> = {}
        for (const doc of docsData ?? []) {
          counts[doc.company_id] = (counts[doc.company_id] ?? 0) + 1
        }
        setDocCounts(counts)
      }

      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const goodCount = companies.filter((c) => c.status === "good_standing").length
  const attentionCount = companies.filter((c) => c.status !== "good_standing").length
  const upcomingFilings = filings.filter((f) => f.status !== "completed").slice(0, 4)
  const overdueFilings = filings.filter((f) => f.status === "overdue").length
  const recentInteractions = interactions.slice(0, 3)

  // Build setup checklist for the primary company
  function buildChecklist(company: Company): ChecklistItem[] {
    const companyFilings = filings.filter((f) => f.company_id === company.id)
    const hasOverdue = companyFilings.some((f) => f.status === "overdue")
    const hasFilings = companyFilings.length > 0
    const hasDocs = (docCounts[company.id] ?? 0) > 0
    return [
      {
        id: "company",
        label: "Company created",
        description: `${company.name} has been added to your dashboard.`,
        done: true,
        href: "/dashboard/settings",
        cta: "View",
      },
      {
        id: "ein",
        label: "Add your EIN",
        description: "Required for tax filings and banking. Format: XX-XXXXXXX.",
        done: !!company.ein,
        href: "/dashboard/settings",
        cta: "Add EIN",
      },
      {
        id: "formed_at",
        label: "Set your formation date",
        description: "The date your entity was officially formed or incorporated.",
        done: !!company.formed_at,
        href: "/dashboard/settings",
        cta: "Set date",
      },
      {
        id: "documents",
        label: "Upload key documents",
        description: "Certificate of Incorporation, Operating Agreement, or EIN letter.",
        done: hasDocs,
        href: "/dashboard/documents",
        cta: "Upload",
      },
      {
        id: "filings",
        label: "Review your compliance filings",
        description: hasOverdue ? "You have overdue filings that need attention." : "Mark any completed filings and confirm upcoming due dates.",
        done: hasFilings && !hasOverdue,
        href: "/dashboard/compliance",
        cta: hasOverdue ? "Fix overdue" : "Review",
      },
    ]
  }

  const primaryCompany = companies[0]
  const checklistItems = primaryCompany ? buildChecklist(primaryCompany) : []
  const showChecklist = primaryCompany && !dismissedChecklists.has(primaryCompany.id)

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      {sharingCompany && (
        <ShareStatusModal
          company={sharingCompany}
          filings={filings}
          onClose={() => setSharingCompany(null)}
        />
      )}

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Good morning{firstName ? `, ${firstName}` : ""}. 👋
        </h1>
        <p className="text-slate-500">
          {companies.length === 0
            ? "Get started by adding your first company."
            : attentionCount > 0
            ? `${attentionCount} company needs your attention.`
            : "All companies are in good standing. You're all clear."}
        </p>
      </div>

      {/* Setup checklist */}
      {showChecklist && (
        <SetupChecklist
          companyId={primaryCompany.id}
          items={checklistItems}
          onDismiss={() => dismissChecklist(primaryCompany.id)}
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Companies",
            value: companies.length,
            sub: "Active",
            icon: Building2,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Good Standing",
            value: goodCount,
            sub: `of ${companies.length} entities`,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Upcoming Filings",
            value: upcomingFilings.length,
            sub: "Next 90 days",
            icon: Calendar,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Overdue",
            value: overdueFilings,
            sub: overdueFilings === 0 ? "All clear" : "Need action",
            icon: AlertCircle,
            color: overdueFilings > 0 ? "text-red-600" : "text-emerald-600",
            bg: overdueFilings > 0 ? "bg-red-50" : "bg-emerald-50",
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {companies.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-1">No companies yet</h3>
          <p className="text-slate-400 text-sm mb-4">Add your first company to get started.</p>
          <Link href="/dashboard/add-company">
            <Button className="bg-[#1B2B4B] hover:bg-[#243461] text-white">Add your first company</Button>
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Entities */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Your companies</h2>
              <Link href="/dashboard/add-company" className="text-sm text-emerald-600 font-semibold hover:underline">
                + Add company
              </Link>
            </div>

            {companies.map((company) => {
              const companyFilings = filings.filter((f) => f.company_id === company.id)
              const pendingCount = companyFilings.filter((f) => f.status === "pending").length
              const overdueCount = companyFilings.filter((f) => f.status === "overdue").length

              return (
                <div
                  key={company.id}
                  className={`bg-white rounded-xl border shadow-sm p-6 ${
                    company.status === "attention_needed"
                      ? "border-amber-200"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#1B2B4B] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Building2 className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <Link href={`/dashboard/companies/${company.id}`} className="hover:underline decoration-slate-300">
                          <h3 className="font-bold text-slate-900">{company.name}</h3>
                        </Link>
                        <p className="text-slate-400 text-sm">
                          {company.entity_type === "c_corp"
                            ? "C-Corporation"
                            : company.entity_type === "s_corp"
                            ? "S-Corporation"
                            : "LLC"}{" "}
                          · {company.state_of_incorporation}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={company.status} />
                  </div>

                  {companyFilings.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {companyFilings.slice(0, 3).map((filing) => (
                        <div
                          key={filing.id}
                          className={`rounded-lg p-3 border ${
                            filing.status === "overdue"
                              ? "bg-red-50 border-red-100"
                              : filing.status === "completed"
                              ? "bg-emerald-50 border-emerald-100"
                              : "bg-amber-50 border-amber-100"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <FilingStatusIcon status={filing.status} />
                            <FilingStatusLabel status={filing.status} />
                          </div>
                          <p className="text-xs font-semibold text-slate-700 leading-tight">{filing.type}</p>
                          <p className="text-xs text-slate-400">{filing.state}</p>
                          {filing.due_date && (
                            <p className="text-xs text-slate-400">
                              {new Date(filing.due_date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mb-4 py-3 text-center text-xs text-slate-400">No filings yet</div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      {pendingCount > 0 && (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          {pendingCount} pending
                        </span>
                      )}
                      {overdueCount > 0 && (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-red-400" />
                          {overdueCount} overdue
                        </span>
                      )}
                      {pendingCount === 0 && overdueCount === 0 && (
                        <span className="text-emerald-600">All clear</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 text-xs"
                        onClick={() => setSharingCompany(company)}
                      >
                        <Share2 className="w-3 h-3 mr-1" />
                        Share
                      </Button>
                      <Link href="/dashboard/compliance">
                        <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs">
                          View all <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right panel */}
          <div className="space-y-5">
            {/* Compliance health */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Filing breakdown
              </h3>
              <FilingHealthChart filings={filings} />
              {filings.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${goodCount === companies.length ? "bg-emerald-400" : "bg-amber-400"}`} />
                    <span className="text-xs text-slate-500">
                      {goodCount}/{companies.length} entities in good standing
                    </span>
                  </div>
                  <Link href="/dashboard/compliance">
                    <button className="text-xs text-emerald-600 font-semibold hover:underline">
                      Details
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Government Liaison */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-500" />
                  Government Liaison
                </h3>
                <Link href="/dashboard/government">
                  <Button variant="ghost" size="sm" className="text-xs text-slate-500">
                    View all
                  </Button>
                </Link>
              </div>
              {recentInteractions.length > 0 ? (
                <div className="space-y-3">
                  {recentInteractions.map((interaction) => (
                    <div key={interaction.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        interaction.status === "resolved" ? "bg-emerald-50" : "bg-blue-50"
                      }`}>
                        {interaction.status === "resolved" ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700 leading-tight">{interaction.type}</p>
                        <p className="text-xs text-slate-400">{interaction.agency}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(interaction.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <span className={`text-xs font-semibold flex-shrink-0 ${
                        interaction.status === "resolved" ? "text-emerald-600" : "text-blue-600"
                      }`}>
                        {interaction.status === "resolved" ? "Resolved" : "Active"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No interactions yet</p>
              )}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <Link href="/dashboard/government">
                  <Button className="w-full bg-[#1B2B4B] hover:bg-[#243461] text-white text-sm">
                    <Phone className="w-3.5 h-3.5 mr-2" />
                    Request government call
                  </Button>
                </Link>
              </div>
            </div>

            {/* Upcoming */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-amber-500" />
                  Upcoming filings
                </h3>
                <Link href="/dashboard/compliance">
                  <Button variant="ghost" size="sm" className="text-xs text-slate-500">
                    View all
                  </Button>
                </Link>
              </div>
              {upcomingFilings.length > 0 ? (
                <div className="space-y-2">
                  {upcomingFilings.map((filing) => (
                    <div key={filing.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                      <FilingStatusIcon status={filing.status} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700 truncate">{filing.type}</p>
                        <p className="text-xs text-slate-400">{filing.state}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-xs font-semibold ${
                          filing.status === "overdue" ? "text-red-600" : "text-amber-600"
                        }`}>
                          {filing.status === "overdue"
                            ? "Overdue"
                            : filing.due_date
                            ? new Date(filing.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                            : "—"}
                        </p>
                        {filing.amount && (
                          <p className="text-xs text-slate-400">${filing.amount}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No upcoming filings</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
