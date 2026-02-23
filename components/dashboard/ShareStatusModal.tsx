"use client"

import { useState } from "react"
import type { Company, Filing } from "@/lib/supabase"
import { encodeShareToken, type ShareData } from "@/lib/share"
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Shield,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"

function statusLabel(status: string) {
  if (status === "good_standing") return "Good Standing"
  if (status === "attention_needed") return "Attention Needed"
  return "Action Required"
}

function statusColors(status: string) {
  if (status === "good_standing")
    return { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500" }
  if (status === "attention_needed")
    return { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500" }
  return { text: "text-red-700", bg: "bg-red-50", border: "border-red-200", dot: "bg-red-500" }
}

export function ShareStatusModal({
  company,
  filings,
  onClose,
}: {
  company: Company
  filings: Filing[]
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [regenerated, setRegenerated] = useState(false)

  const companyFilings = filings.filter((f) => f.company_id === company.id)
  const total = companyFilings.length
  const completed = companyFilings.filter((f) => f.status === "completed").length
  const overdue = companyFilings.filter((f) => f.status === "overdue").length
  const pending = companyFilings.filter((f) => f.status === "pending").length

  const status = company.status === "good_standing"
    ? "good_standing"
    : company.status === "attention_needed"
    ? "attention_needed"
    : "action_required"

  const shareData: ShareData = {
    companyName: company.name,
    entityType: company.entity_type,
    stateOfIncorporation: company.state_of_incorporation,
    status,
    totalFilings: total,
    completedFilings: completed,
    overdueFilings: overdue,
    pendingFilings: pending,
    generatedAt: new Date().toISOString(),
  }

  const [token, setToken] = useState(() => encodeShareToken(shareData))
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : "https://goodstanding.app"}/s/${token}`

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  function handleRegenerate() {
    const freshData: ShareData = { ...shareData, generatedAt: new Date().toISOString() }
    setToken(encodeShareToken(freshData))
    setRegenerated(true)
    setTimeout(() => setRegenerated(false), 2000)
  }

  const colors = statusColors(status)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#1B2B4B]">Share compliance status</h2>
            <p className="text-slate-500 text-sm mt-0.5">
              Send investors or partners a verified status link.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status preview card */}
        <div className={cn(
          "rounded-2xl border p-5 mb-6",
          colors.bg, colors.border
        )}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#0F1829] rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900 truncate">{company.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {company.entity_type === "c_corp" ? "C-Corp" : company.entity_type === "s_corp" ? "S-Corp" : "LLC"}{" "}
                · {company.state_of_incorporation}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className={cn("w-2 h-2 rounded-full", colors.dot)} />
                <span className={cn("text-xs font-bold", colors.text)}>
                  {statusLabel(status)}
                </span>
              </div>
            </div>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-current/10">
            {[
              { icon: CheckCircle2, color: "text-emerald-600", label: "Filed", value: completed },
              { icon: AlertCircle, color: "text-amber-600", label: "Pending", value: pending },
              { icon: XCircle, color: "text-red-500", label: "Overdue", value: overdue },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className={cn("w-4 h-4 mx-auto mb-0.5", stat.color)} />
                <p className="text-base font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* URL */}
        <div className="mb-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Shareable link
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-600 font-mono truncate">
              {shareUrl}
            </div>
            <button
              onClick={handleCopy}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all flex-shrink-0",
                copied
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
              )}
            >
              {copied ? <><Check className="w-3.5 h-3.5" />Copied!</> : <><Copy className="w-3.5 h-3.5" />Copy</>}
            </button>
          </div>
        </div>

        {/* Actions row */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleRegenerate}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", regenerated && "animate-spin")} />
            {regenerated ? "Regenerated" : "Regenerate link"}
          </button>
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Preview page
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Info note */}
        <div className="flex items-start gap-2.5 bg-slate-50 rounded-xl px-4 py-3 mb-6">
          <AlertCircle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 leading-relaxed">
            This link contains a snapshot of your compliance status as of right now. Anyone with the link can view it — no login required. Regenerate to refresh the data.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Done
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1B2B4B] hover:bg-[#243461] text-white text-sm font-semibold transition-colors"
          >
            {copied ? (
              <><Check className="w-4 h-4" />Copied!</>
            ) : (
              <><Copy className="w-4 h-4" />Copy link</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
