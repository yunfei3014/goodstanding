import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import { demoCompanies, demoFilings, demoInteractions } from "@/lib/demo-data"

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

const upcomingFilings = demoFilings.filter((f) => f.status !== "completed").slice(0, 4)
const recentInteractions = demoInteractions.slice(0, 3)

export default function DashboardPage() {
  const goodCount = demoCompanies.filter((c) => c.status === "good_standing").length
  const attentionCount = demoCompanies.filter((c) => c.status !== "good_standing").length
  const overdueFilings = demoFilings.filter((f) => f.status === "overdue").length

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Good morning, Fei. 👋</h1>
        <p className="text-slate-500">
          {attentionCount > 0
            ? `${attentionCount} company needs your attention.`
            : "All companies are in good standing. You're all clear."}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Companies",
            value: demoCompanies.length,
            sub: "Active",
            icon: Building2,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Good Standing",
            value: goodCount,
            sub: `of ${demoCompanies.length} entities`,
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Entities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Your companies</h2>
            <Link href="/signup" className="text-sm text-emerald-600 font-semibold hover:underline">
              + Add company
            </Link>
          </div>

          {demoCompanies.map((company) => {
            const companyFilings = demoFilings.filter((f) => f.company_id === company.id)
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
                      <h3 className="font-bold text-slate-900">{company.name}</h3>
                      <p className="text-slate-400 text-sm">
                        {company.entity_type === "c_corp" ? "C-Corporation" : "LLC"} ·{" "}
                        {company.state_of_incorporation} ·{" "}
                        {company.states_registered.join(", ")}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={company.status} />
                </div>

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

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      {pendingCount} pending
                    </span>
                    {overdueCount > 0 && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-400" />
                        {overdueCount} overdue
                      </span>
                    )}
                    <span>EIN: {company.ein}</span>
                  </div>
                  <Link href="/dashboard/compliance">
                    <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs">
                      View all <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right panel */}
        <div className="space-y-5">
          {/* Compliance health */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Compliance health
            </h3>
            <div className="space-y-3">
              {[
                { label: "Good standing", value: "2/2 entities", color: "bg-emerald-400" },
                { label: "Filings current", value: "3/5 filings", color: "bg-emerald-400" },
                { label: "Registered agent", value: "Active (3 states)", color: "bg-emerald-400" },
                { label: "Overdue items", value: "1 action needed", color: "bg-red-400" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-sm text-slate-600">{item.label}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{item.value}</span>
                </div>
              ))}
            </div>
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
            <div className="space-y-3">
              {recentInteractions.map((interaction) => (
                <div
                  key={interaction.id}
                  className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
                >
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
                    <p className="text-xs font-semibold text-slate-700 leading-tight">
                      {interaction.type}
                    </p>
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
                      {filing.status === "overdue" ? "Overdue" :
                        filing.due_date
                          ? new Date(filing.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                          : "—"
                      }
                    </p>
                    {filing.amount && (
                      <p className="text-xs text-slate-400">${filing.amount}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
