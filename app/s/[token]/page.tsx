"use client"

import { useParams } from "next/navigation"
import { decodeShareToken } from "@/lib/share"
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  Shield,
  Building2,
  FileCheck,
  Calendar,
  ExternalLink,
  Printer,
} from "lucide-react"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  })
}

function entityLabel(type: string) {
  if (type === "c_corp") return "C-Corporation"
  if (type === "s_corp") return "S-Corporation"
  if (type === "llc") return "Limited Liability Company"
  if (type === "lp") return "Limited Partnership"
  if (type === "nonprofit") return "Nonprofit Organization"
  return type
}

export default function StatusPage() {
  const params = useParams()
  const token = params?.token as string | undefined

  if (!token) {
    return <InvalidPage />
  }

  const data = decodeShareToken(token)

  if (!data) {
    return <InvalidPage />
  }

  const isGoodStanding = data.status === "good_standing"
  const isAttention = data.status === "attention_needed"
  const isCritical = data.status === "action_required"

  const statusConfig = isGoodStanding
    ? {
        label: "Good Standing",
        sublabel: "All compliance obligations are current.",
        icon: CheckCircle2,
        iconColor: "text-emerald-500",
        headerBg: "from-emerald-600 to-emerald-700",
        badgeBg: "bg-emerald-100",
        badgeText: "text-emerald-800",
        badgeBorder: "border-emerald-200",
        ringColor: "ring-emerald-400/30",
        dotColor: "bg-emerald-400",
      }
    : isAttention
    ? {
        label: "Attention Needed",
        sublabel: "Some filings require attention.",
        icon: AlertCircle,
        iconColor: "text-amber-500",
        headerBg: "from-amber-500 to-amber-600",
        badgeBg: "bg-amber-100",
        badgeText: "text-amber-800",
        badgeBorder: "border-amber-200",
        ringColor: "ring-amber-400/30",
        dotColor: "bg-amber-400",
      }
    : {
        label: "Action Required",
        sublabel: "Overdue compliance items need immediate resolution.",
        icon: XCircle,
        iconColor: "text-red-500",
        headerBg: "from-red-600 to-red-700",
        badgeBg: "bg-red-100",
        badgeText: "text-red-800",
        badgeBorder: "border-red-200",
        ringColor: "ring-red-400/30",
        dotColor: "bg-red-400",
      }

  const StatusIcon = statusConfig.icon
  const filedPct =
    data.totalFilings > 0
      ? Math.round((data.completedFilings / data.totalFilings) * 100)
      : 0

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top banner */}
      <div className="bg-[#0F1829] text-white text-center py-3 text-xs font-medium tracking-wide">
        <span className="opacity-60">Verified compliance status powered by</span>{" "}
        <span className="font-bold text-emerald-400">GoodStanding.ai</span>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Certificate card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 print:shadow-none">
            {/* Header strip */}
            <div className={`bg-gradient-to-br ${statusConfig.headerBg} px-8 pt-8 pb-10 text-white relative overflow-hidden`}>
              {/* Decorative circles */}
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
              <div className="absolute -bottom-12 -left-6 w-32 h-32 bg-white/10 rounded-full" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold opacity-90 tracking-wide">
                    COMPLIANCE STATUS REPORT
                  </span>
                </div>

                <h1 className="text-2xl font-bold mb-1 leading-tight">{data.companyName}</h1>
                <p className="text-white/75 text-sm">
                  {entityLabel(data.entityType)} · {data.stateOfIncorporation}
                </p>

                <div className="mt-6 inline-flex items-center gap-2.5 bg-white/20 backdrop-blur rounded-xl px-4 py-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                    isGoodStanding ? "bg-emerald-300" : isAttention ? "bg-amber-300" : "bg-red-300"
                  }`} />
                  <span className="font-bold text-base">{statusConfig.label}</span>
                </div>
                <p className="mt-2 text-sm text-white/70">{statusConfig.sublabel}</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
              {[
                { label: "Total Filings", value: data.totalFilings, color: "text-slate-900" },
                {
                  label: "Filed",
                  value: data.completedFilings,
                  color: "text-emerald-700",
                },
                {
                  label: "Overdue",
                  value: data.overdueFilings,
                  color: data.overdueFilings > 0 ? "text-red-600" : "text-slate-400",
                },
              ].map((stat) => (
                <div key={stat.label} className="py-5 text-center">
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Filing progress */}
            <div className="px-8 py-6 border-b border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">Filing completion</span>
                <span className="text-sm font-bold text-slate-900">{filedPct}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    filedPct === 100
                      ? "bg-emerald-500"
                      : filedPct >= 70
                      ? "bg-amber-400"
                      : "bg-red-400"
                  }`}
                  style={{ width: `${filedPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1.5 text-xs text-slate-400">
                <span>{data.completedFilings} of {data.totalFilings} filed</span>
                {data.pendingFilings > 0 && (
                  <span>{data.pendingFilings} pending</span>
                )}
              </div>
            </div>

            {/* Breakdown */}
            <div className="px-8 py-6 border-b border-slate-100 space-y-3">
              {[
                {
                  icon: CheckCircle2,
                  color: "text-emerald-500",
                  bg: "bg-emerald-50",
                  label: "Filings completed",
                  value: data.completedFilings,
                  valueColor: "text-emerald-700",
                },
                {
                  icon: AlertCircle,
                  color: "text-amber-500",
                  bg: "bg-amber-50",
                  label: "Filings pending",
                  value: data.pendingFilings,
                  valueColor: "text-amber-700",
                },
                {
                  icon: XCircle,
                  color: "text-red-500",
                  bg: "bg-red-50",
                  label: "Filings overdue",
                  value: data.overdueFilings,
                  valueColor: data.overdueFilings > 0 ? "text-red-700" : "text-slate-400",
                },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${row.bg}`}>
                    <row.icon className={`w-3.5 h-3.5 ${row.color}`} />
                  </div>
                  <span className="text-sm text-slate-600 flex-1">{row.label}</span>
                  <span className={`text-sm font-bold ${row.valueColor}`}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Verification footer */}
            <div className="px-8 py-5 bg-slate-50/60">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#0F1829] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">Verified by GoodStanding.ai</p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    This report was generated on{" "}
                    <span className="font-semibold text-slate-600">{formatDateShort(data.generatedAt)}</span>.
                    Compliance status reflects data at the time of generation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons (hidden in print) */}
          <div className="mt-5 flex items-center gap-3 print:hidden">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 flex-1 justify-center py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <a
              href="https://goodstanding.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 flex-1 justify-center py-2.5 px-4 bg-[#0F1829] rounded-xl text-sm font-semibold text-white hover:bg-[#1B2B4B] transition-colors shadow-sm"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              Get GoodStanding.ai
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>

          <p className="text-center text-xs text-slate-400 mt-4 print:hidden">
            This link expires when the report is regenerated.
          </p>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
        }
      `}</style>
    </div>
  )
}

function InvalidPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        <Shield className="w-7 h-7 text-slate-400" />
      </div>
      <h1 className="text-xl font-bold text-slate-800 mb-2">Invalid or expired link</h1>
      <p className="text-slate-500 text-sm text-center max-w-sm">
        This compliance status link is invalid or has expired. Ask the company to generate a new one from their GoodStanding.ai dashboard.
      </p>
      <a
        href="https://goodstanding.app"
        className="mt-6 text-sm font-semibold text-emerald-600 hover:underline"
      >
        Go to GoodStanding.ai →
      </a>
    </div>
  )
}
