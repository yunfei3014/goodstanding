"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase"
import { useCompany } from "@/lib/company-context"
import type { Filing, Document, GovernmentInteraction } from "@/lib/supabase"
import {
  Shield,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Building2,
  FileText,
  Phone,
  FolderOpen,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── helpers ────────────────────────────────────────────────────────────────

function fmt(date: string | undefined | null) {
  if (!date) return "—"
  return new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  })
}

function statusLabel(s: string) {
  if (s === "completed") return "Filed"
  if (s === "overdue")   return "Overdue"
  return "Pending"
}

function statusClass(s: string) {
  if (s === "completed") return "text-emerald-700 bg-emerald-50 border-emerald-200"
  if (s === "overdue")   return "text-red-700 bg-red-50 border-red-200"
  return "text-amber-700 bg-amber-50 border-amber-200"
}

function exportCSV(filings: Filing[], companyName: string) {
  const headers = ["Type", "Jurisdiction", "Status", "Due Date", "Filed Date", "Amount ($)", "Notes"]
  const rows = filings.map((f) => [
    f.type,
    f.state,
    statusLabel(f.status),
    f.due_date ?? "",
    f.filed_at ?? "",
    f.amount != null ? String(f.amount) : "",
    f.notes ?? "",
  ])
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${companyName.replace(/\s+/g, "-").toLowerCase()}-compliance-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── component ──────────────────────────────────────────────────────────────

export default function ReportPage() {
  const { selectedCompany } = useCompany()
  const [filings, setFilings] = useState<Filing[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [interactions, setInteractions] = useState<GovernmentInteraction[]>([])
  const [loading, setLoading] = useState(true)
  const reportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!selectedCompany) return
    const supabase = createClient()
    async function load(id: string) {
      setLoading(true)
      const [{ data: f }, { data: d }, { data: g }] = await Promise.all([
        supabase.from("filings").select("*").eq("company_id", id).order("due_date", { ascending: true }),
        supabase.from("documents").select("*").eq("company_id", id).order("uploaded_at", { ascending: false }),
        supabase.from("government_interactions").select("*").eq("company_id", id).order("created_at", { ascending: false }),
      ])
      setFilings(f ?? [])
      setDocuments(d ?? [])
      setInteractions(g ?? [])
      setLoading(false)
    }
    load(selectedCompany.id)
  }, [selectedCompany])

  const overdue   = filings.filter((f) => f.status === "overdue")
  const pending   = filings.filter((f) => f.status === "pending")
  const completed = filings.filter((f) => f.status === "completed")

  const overallStatus =
    overdue.length >= 3 ? "action_required"
    : overdue.length >= 1 ? "attention_needed"
    : "good_standing"

  const generatedOn = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  })

  if (!selectedCompany) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400 text-sm">Select a company to generate a report.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      {/* Print CSS — hides shell, makes report full-width */}
      <style>{`
        @media print {
          aside, header, .no-print { display: none !important; }
          main { overflow: visible !important; }
          body { background: white !important; }
          .report-page { padding: 0 !important; max-width: 100% !important; }
          .report-card { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
          .report-table th, .report-table td { font-size: 11px !important; }
          @page { margin: 1.5cm; }
        }
      `}</style>

      <div className="report-page p-4 sm:p-8 max-w-4xl mx-auto">

        {/* Action bar — hidden when printing */}
        <div className="no-print flex items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Compliance Report</h1>
            <p className="text-slate-500 text-sm">Shareable summary for lawyers, accountants, or board members.</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => exportCSV(filings, selectedCompany.name)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1B2B4B] hover:bg-[#243461] text-white text-sm font-medium transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
          </div>
        </div>

        {/* ── Report body ── */}
        <div ref={reportRef} className="space-y-5">

          {/* Header card */}
          <div className="report-card bg-[#0F1829] rounded-2xl p-8 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-white/60 text-sm font-medium">GoodStanding.ai</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-1">{selectedCompany.name}</h2>
                <p className="text-white/50 text-sm">
                  {selectedCompany.entity_type === "c_corp" ? "C-Corporation"
                    : selectedCompany.entity_type === "s_corp" ? "S-Corporation"
                    : "LLC"}{" "}
                  · Incorporated in {selectedCompany.state_of_incorporation}
                </p>
              </div>
              <div className="text-right">
                <div className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold mb-3",
                  overallStatus === "good_standing"   ? "bg-emerald-500/20 text-emerald-400"
                  : overallStatus === "attention_needed" ? "bg-amber-500/20 text-amber-400"
                  : "bg-red-500/20 text-red-400"
                )}>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    overallStatus === "good_standing" ? "bg-emerald-400"
                    : overallStatus === "attention_needed" ? "bg-amber-400"
                    : "bg-red-400"
                  )} />
                  {overallStatus === "good_standing" ? "Good Standing"
                    : overallStatus === "attention_needed" ? "Attention Needed"
                    : "Action Required"}
                </div>
                <p className="text-white/40 text-xs">
                  Generated {generatedOn}
                </p>
              </div>
            </div>

            {/* Company metadata grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
              {[
                { label: "EIN",            value: selectedCompany.ein ?? "Not set" },
                { label: "Plan",           value: (selectedCompany.plan ?? "launch").charAt(0).toUpperCase() + (selectedCompany.plan ?? "launch").slice(1) },
                { label: "Formed",         value: selectedCompany.formed_at ? fmt(selectedCompany.formed_at) : "Not set" },
                { label: "Report period",  value: new Date().getFullYear().toString() },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-white/40 text-xs mb-0.5">{label}</p>
                  <p className="text-white text-sm font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: FileText,    label: "Total filings",  value: filings.length,    color: "text-slate-700",   bg: "bg-slate-50",   border: "border-slate-200" },
              { icon: XCircle,     label: "Overdue",        value: overdue.length,    color: "text-red-700",     bg: "bg-red-50",     border: "border-red-100" },
              { icon: AlertCircle, label: "Pending",        value: pending.length,    color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-100" },
              { icon: CheckCircle2,label: "Filed",          value: completed.length,  color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100" },
            ].map(({ icon: Icon, label, value, color, bg, border }) => (
              <div key={label} className={cn("report-card rounded-xl border p-5 shadow-sm", bg, border)}>
                <Icon className={cn("w-5 h-5 mb-2", color)} />
                <p className={cn("text-3xl font-bold", color)}>{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Filings table */}
          <div className="report-card bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100">
              <FileText className="w-4 h-4 text-slate-500" />
              <h3 className="font-bold text-slate-900">Compliance Filings</h3>
              <span className="ml-auto text-xs text-slate-400">{filings.length} total</span>
            </div>

            {filings.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No filings on record.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="report-table w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      {["Filing type", "Jurisdiction", "Due date", "Filed date", "Amount", "Status"].map((h) => (
                        <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Overdue first, then pending, then completed */}
                    {[...overdue, ...pending, ...completed].map((f, i) => (
                      <tr
                        key={f.id}
                        className={cn("border-b border-slate-50 last:border-0", i % 2 === 0 ? "bg-white" : "bg-slate-50/40")}
                      >
                        <td className="px-6 py-3 font-medium text-slate-900">{f.type}</td>
                        <td className="px-6 py-3 text-slate-500">{f.state}</td>
                        <td className="px-6 py-3 text-slate-500">{fmt(f.due_date)}</td>
                        <td className="px-6 py-3 text-slate-500">{f.filed_at ? fmt(f.filed_at) : "—"}</td>
                        <td className="px-6 py-3 text-slate-500">{f.amount ? `$${f.amount.toLocaleString()}` : "—"}</td>
                        <td className="px-6 py-3">
                          <span className={cn("inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border", statusClass(f.status))}>
                            {statusLabel(f.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Two-column: Gov interactions + Documents */}
          <div className="grid sm:grid-cols-2 gap-5">

            {/* Government interactions */}
            <div className="report-card bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
                <Phone className="w-4 h-4 text-slate-500" />
                <h3 className="font-bold text-slate-900 text-sm">Government Liaison</h3>
                <span className="ml-auto text-xs text-slate-400">{interactions.length}</span>
              </div>
              {interactions.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No interactions on record.</p>
              ) : (
                <div className="divide-y divide-slate-50">
                  {interactions.slice(0, 8).map((gi) => (
                    <div key={gi.id} className="px-5 py-3 flex items-start gap-3">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                        gi.status === "resolved" ? "bg-emerald-50" : "bg-blue-50"
                      )}>
                        {gi.status === "resolved"
                          ? <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          : <Clock className="w-3 h-3 text-blue-500" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{gi.type}</p>
                        <p className="text-xs text-slate-400">{gi.agency} · {fmt(gi.created_at)}</p>
                      </div>
                      <span className={cn(
                        "text-xs font-semibold flex-shrink-0",
                        gi.status === "resolved" ? "text-emerald-600" : "text-blue-600"
                      )}>
                        {gi.status === "resolved" ? "Resolved" : gi.status === "in_progress" ? "Active" : "Scheduled"}
                      </span>
                    </div>
                  ))}
                  {interactions.length > 8 && (
                    <p className="px-5 py-2 text-xs text-slate-400">+{interactions.length - 8} more interactions</p>
                  )}
                </div>
              )}
            </div>

            {/* Documents */}
            <div className="report-card bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
                <FolderOpen className="w-4 h-4 text-slate-500" />
                <h3 className="font-bold text-slate-900 text-sm">Documents</h3>
                <span className="ml-auto text-xs text-slate-400">{documents.length}</span>
              </div>
              {documents.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No documents on file.</p>
              ) : (
                <div className="divide-y divide-slate-50">
                  {documents.slice(0, 8).map((doc) => (
                    <div key={doc.id} className="px-5 py-3 flex items-center gap-3">
                      <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center flex-shrink-0">
                        <FileText className="w-3 h-3 text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{doc.name}</p>
                        <p className="text-xs text-slate-400">{doc.type} · {fmt(doc.uploaded_at)}</p>
                      </div>
                      {doc.size_kb && (
                        <span className="text-xs text-slate-400 flex-shrink-0">
                          {doc.size_kb < 1024 ? `${doc.size_kb} KB` : `${(doc.size_kb / 1024).toFixed(1)} MB`}
                        </span>
                      )}
                    </div>
                  ))}
                  {documents.length > 8 && (
                    <p className="px-5 py-2 text-xs text-slate-400">+{documents.length - 8} more documents</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Report footer */}
          <div className="report-card bg-white rounded-xl border border-slate-100 px-6 py-4 flex items-center justify-between text-xs text-slate-400 shadow-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-semibold text-slate-500">GoodStanding.ai</span>
            </div>
            <span>Generated {generatedOn}</span>
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3 h-3" />
              {selectedCompany.name}
            </span>
          </div>

        </div>
      </div>
    </>
  )
}
