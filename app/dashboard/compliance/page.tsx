import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { demoCompanies, demoFilings } from "@/lib/demo-data"
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  Calendar,
  DollarSign,
  FileText,
  ArrowRight,
} from "lucide-react"

function StatusBadge({ status }: { status: string }) {
  if (status === "completed") return <Badge variant="green">Filed ✓</Badge>
  if (status === "overdue") return <Badge variant="red">Overdue</Badge>
  if (status === "pending") return <Badge variant="yellow">Pending</Badge>
  return <Badge>N/A</Badge>
}

function StatusIcon({ status }: { status: string }) {
  if (status === "completed") return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
  if (status === "overdue") return <XCircle className="w-5 h-5 text-red-500" />
  return <AlertCircle className="w-5 h-5 text-amber-500" />
}

export default function CompliancePage() {
  const allFilings = demoFilings.map((filing) => ({
    ...filing,
    company: demoCompanies.find((c) => c.id === filing.company_id),
  }))

  const overdue = allFilings.filter((f) => f.status === "overdue")
  const pending = allFilings.filter((f) => f.status === "pending")
  const completed = allFilings.filter((f) => f.status === "completed")

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Compliance</h1>
        <p className="text-slate-500">All filings, deadlines, and obligations across your entities.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Overdue", count: overdue.length, color: "red", icon: XCircle },
          { label: "Pending", count: pending.length, color: "amber", icon: AlertCircle },
          { label: "Filed this year", count: completed.length, color: "emerald", icon: CheckCircle2 },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-3">
              <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.count}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overdue — action needed */}
      {overdue.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-red-700">Needs immediate action</h2>
          </div>
          <div className="space-y-3">
            {overdue.map((filing) => (
              <div
                key={filing.id}
                className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-center gap-5"
              >
                <StatusIcon status={filing.status} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900">{filing.type}</h3>
                    <StatusBadge status={filing.status} />
                  </div>
                  <p className="text-slate-500 text-sm">
                    {filing.company?.name} · {filing.state}
                  </p>
                  {filing.notes && (
                    <p className="text-sm text-slate-600 mt-1 bg-white/60 rounded-lg p-2 border border-red-100">
                      {filing.notes}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  {filing.amount && (
                    <p className="text-sm font-semibold text-red-700 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />{filing.amount}
                    </p>
                  )}
                  <Button size="sm" className="mt-2 bg-[#1B2B4B] text-white hover:bg-[#243461]">
                    Resolve <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-slate-900">Upcoming filings</h2>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Filing</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Company</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Due date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pending.map((filing) => (
                <tr key={filing.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{filing.type}</p>
                        <p className="text-xs text-slate-400">{filing.state}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-700">{filing.company?.name}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <p className="text-sm font-semibold text-amber-700">
                        {filing.due_date
                          ? new Date(filing.due_date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-700">
                      {filing.amount ? `$${filing.amount}` : "—"}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={filing.status} />
                  </td>
                  <td className="px-5 py-4">
                    <Button variant="outline" size="sm" className="text-xs border-slate-200">
                      Approve & file
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Completed */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <h2 className="text-lg font-bold text-slate-900">Completed this year</h2>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Filing</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Company</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Filed date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {completed.map((filing) => (
                <tr key={filing.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{filing.type}</p>
                        <p className="text-xs text-slate-400">{filing.state}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-700">{filing.company?.name}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-500">
                      {filing.filed_at
                        ? new Date(filing.filed_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-700">
                      {filing.amount ? `$${filing.amount}` : "—"}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={filing.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
