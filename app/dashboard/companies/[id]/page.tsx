"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import type { Company, Filing, Document, GovernmentInteraction } from "@/lib/supabase"
import { ShareStatusModal } from "@/components/dashboard/ShareStatusModal"
import {
  ArrowLeft,
  Building2,
  FileCheck,
  FolderOpen,
  Phone,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Calendar,
  DollarSign,
  FileText,
  Download,
  Share2,
  Settings,
  Plus,
  ChevronRight,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function entityLabel(t: string) {
  if (t === "c_corp") return "C-Corporation"
  if (t === "s_corp") return "S-Corporation"
  if (t === "llc") return "LLC"
  return t
}

function formatDate(iso: string | undefined) {
  if (!iso) return "—"
  return new Date(iso + (iso.length === 10 ? "T12:00:00" : "")).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  })
}

function complianceScore(filings: Filing[]) {
  if (filings.length === 0) return 100
  const overdue = filings.filter((f) => f.status === "overdue").length
  return Math.max(0, Math.min(100, Math.round(100 - overdue * 20)))
}

function scoreGrade(score: number): { label: string; color: string; ring: string; bg: string } {
  if (score >= 90) return { label: "Excellent", color: "text-emerald-700", ring: "stroke-emerald-500", bg: "bg-emerald-50" }
  if (score >= 70) return { label: "Good", color: "text-emerald-600", ring: "stroke-emerald-400", bg: "bg-emerald-50" }
  if (score >= 50) return { label: "Needs Work", color: "text-amber-700", ring: "stroke-amber-400", bg: "bg-amber-50" }
  return { label: "Critical", color: "text-red-700", ring: "stroke-red-500", bg: "bg-red-50" }
}

function ScoreRing({ score }: { score: number }) {
  const grade = scoreGrade(score)
  const r = 30
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 72 72" className="w-20 h-20 -rotate-90">
          <circle cx="36" cy="36" r={r} fill="none" stroke="#e2e8f0" strokeWidth="6" />
          <circle
            cx="36" cy="36" r={r} fill="none"
            className={grade.ring}
            strokeWidth="6"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-slate-900">{score}</span>
        </div>
      </div>
      <span className={cn("text-xs font-bold mt-1", grade.color)}>{grade.label}</span>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === "good_standing")
    return <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Good Standing</span>
  if (status === "attention_needed")
    return <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Attention Needed</span>
  return <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-100 px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-red-500" />Action Required</span>
}

function FilingStatusIcon({ status }: { status: string }) {
  if (status === "completed") return <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
  if (status === "overdue")   return <XCircle      className="w-4 h-4 text-red-500 flex-shrink-0" />
  return                             <AlertCircle  className="w-4 h-4 text-amber-500 flex-shrink-0" />
}

function formatBytes(kb: number | null) {
  if (!kb) return "—"
  if (kb < 1024) return `${kb} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

function docTypeColor(type: string) {
  const map: Record<string, string> = {
    Formation: "bg-blue-100 text-blue-700",
    Tax: "bg-slate-100 text-slate-600",
    Filing: "bg-emerald-100 text-emerald-700",
    Agreement: "bg-amber-100 text-amber-700",
    "Government Notice": "bg-[#1B2B4B]/10 text-[#1B2B4B]",
    Other: "bg-slate-100 text-slate-500",
  }
  return map[type] ?? "bg-slate-100 text-slate-500"
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CompanyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const companyId = params?.id as string

  const [company, setCompany] = useState<Company | null>(null)
  const [filings, setFilings] = useState<Filing[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [interactions, setInteractions] = useState<GovernmentInteraction[]>([])
  const [userId, setUserId] = useState("")
  const [loading, setLoading] = useState(true)
  const [sharing, setSharing] = useState(false)

  useEffect(() => {
    if (!companyId) return
    load()
  }, [companyId])

  async function load() {
    setLoading(true)
    const supabase = createClient()
    const [
      { data: { user } },
      { data: companyData },
      { data: filingsData },
      { data: docsData },
      { data: interactionsData },
    ] = await Promise.all([
      supabase.auth.getUser(),
      supabase.from("companies").select("*").eq("id", companyId).single(),
      supabase.from("filings").select("*").eq("company_id", companyId).order("due_date", { ascending: true }),
      supabase.from("documents").select("*").eq("company_id", companyId).order("uploaded_at", { ascending: false }),
      supabase.from("government_interactions").select("*").eq("company_id", companyId).order("created_at", { ascending: false }),
    ])
    if (!companyData) { router.push("/dashboard"); return }
    setCompany(companyData)
    setFilings(filingsData ?? [])
    setDocuments(docsData ?? [])
    setInteractions(interactionsData ?? [])
    if (user) setUserId(user.id)
    setLoading(false)
  }

  async function handleDownload(doc: Document) {
    if (!doc.storage_path) return
    const supabase = createClient()
    const { data } = await supabase.storage.from("documents").createSignedUrl(doc.storage_path, 3600)
    if (data?.signedUrl) window.open(data.signedUrl, "_blank")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!company) return null

  const score = complianceScore(filings)
  const grade = scoreGrade(score)
  const overdue = filings.filter((f) => f.status === "overdue")
  const pending = filings.filter((f) => f.status === "pending")
  const completed = filings.filter((f) => f.status === "completed")

  // Sort filings: overdue → pending → completed
  const sortedFilings = [...overdue, ...pending, ...completed]

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      {sharing && (
        <ShareStatusModal
          company={company}
          filings={filings}
          onClose={() => setSharing(false)}
        />
      )}

      {/* Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Overview
      </Link>

      {/* Company header */}
      <div className="bg-[#0F1829] rounded-2xl p-6 mb-6 flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
          <Building2 className="w-7 h-7 text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white">{company.name}</h1>
            <StatusBadge status={company.status} />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <span>{entityLabel(company.entity_type)}</span>
            <span className="text-slate-600">·</span>
            <span>{company.state_of_incorporation}</span>
            {company.ein && (
              <>
                <span className="text-slate-600">·</span>
                <span>EIN {company.ein}</span>
              </>
            )}
            {company.formed_at && (
              <>
                <span className="text-slate-600">·</span>
                <span>Formed {formatDate(company.formed_at)}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setSharing(true)}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition-colors"
          >
            <Settings className="w-4 h-4" />
            Edit
          </Link>
        </div>
      </div>

      {/* Stats + score */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        {[
          { label: "Total Filings", value: filings.length, icon: FileCheck, color: "text-slate-600", bg: "bg-slate-50" },
          { label: "Filed", value: completed.length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Pending", value: pending.length, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Overdue", value: overdue.length, icon: XCircle, color: overdue.length > 0 ? "text-red-600" : "text-slate-400", bg: overdue.length > 0 ? "bg-red-50" : "bg-slate-50" },
          { label: "Documents", value: documents.length, icon: FolderOpen, color: "text-blue-600", bg: "bg-blue-50" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", stat.bg)}>
              <stat.icon className={cn("w-4 h-4", stat.color)} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main layout */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Filings — 2 col */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-slate-400" />
                Filings
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {filings.length}
                </span>
              </h2>
              <Link
                href="/dashboard/compliance"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {filings.length === 0 ? (
              <div className="py-10 text-center">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400 mb-3">No filings yet</p>
                <Link
                  href="/dashboard/compliance"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />Add filing
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {sortedFilings.map((filing) => (
                  <div key={filing.id} className={cn(
                    "flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/60 transition-colors",
                    filing.status === "overdue" && "bg-red-50/40"
                  )}>
                    <FilingStatusIcon status={filing.status} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{filing.type}</p>
                      <p className="text-xs text-slate-400">{filing.state}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {filing.status === "completed" ? (
                        <p className="text-xs font-semibold text-emerald-600">Filed {formatDate(filing.filed_at)}</p>
                      ) : filing.status === "overdue" ? (
                        <p className="text-xs font-bold text-red-600">Overdue</p>
                      ) : (
                        <p className="text-xs font-semibold text-amber-600">
                          Due {formatDate(filing.due_date)}
                        </p>
                      )}
                      {filing.amount != null && (
                        <p className="text-xs text-slate-400 flex items-center gap-0.5 justify-end">
                          <DollarSign className="w-3 h-3" />{filing.amount}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Compliance score */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-4">Compliance score</h3>
            <div className="flex items-center gap-5">
              <ScoreRing score={score} />
              <div className="flex-1">
                <div className="space-y-2">
                  {[
                    { label: "Filed on time", ok: completed.length > 0 && overdue.length === 0 },
                    { label: "No overdue items", ok: overdue.length === 0 },
                    { label: "Filings tracked", ok: filings.length > 0 },
                    { label: "Documents on file", ok: documents.length > 0 },
                  ].map(({ label, ok }) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className={cn(
                        "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0",
                        ok ? "bg-emerald-100" : "bg-slate-100"
                      )}>
                        <CheckCircle2 className={cn("w-2.5 h-2.5", ok ? "text-emerald-600" : "text-slate-300")} />
                      </div>
                      <span className={cn("text-xs", ok ? "text-slate-700" : "text-slate-400")}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-slate-400" />
                Documents
              </h3>
              <Link
                href="/dashboard/documents"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {documents.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-xs text-slate-400 mb-2">No documents uploaded</p>
                <Link
                  href="/dashboard/documents"
                  className="text-xs font-semibold text-emerald-600 hover:underline"
                >
                  Upload document →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {documents.slice(0, 5).map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                    <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{doc.name}</p>
                      <span className={cn("text-xs font-semibold px-1.5 py-0.5 rounded", docTypeColor(doc.type))}>
                        {doc.type}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDownload(doc)}
                      disabled={!doc.storage_path}
                      className="text-slate-300 hover:text-slate-600 disabled:opacity-30 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {documents.length > 5 && (
                  <div className="px-5 py-2.5 text-center">
                    <Link href="/dashboard/documents" className="text-xs text-slate-400 hover:text-emerald-600 transition-colors">
                      +{documents.length - 5} more
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Government interactions */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                Gov't Liaison
              </h3>
              <Link
                href="/dashboard/government"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {interactions.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-xs text-slate-400 mb-2">No interactions yet</p>
                <Link
                  href="/dashboard/government"
                  className="text-xs font-semibold text-emerald-600 hover:underline"
                >
                  Request a call →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {interactions.slice(0, 4).map((i) => (
                  <div key={i.id} className="flex items-start gap-3 px-5 py-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                      i.status === "resolved" ? "bg-emerald-50" : "bg-blue-50"
                    )}>
                      {i.status === "resolved"
                        ? <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        : <Clock className="w-3 h-3 text-blue-500" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{i.type}</p>
                      <p className="text-xs text-slate-400">{i.agency}</p>
                    </div>
                    <span className={cn(
                      "text-xs font-semibold flex-shrink-0",
                      i.status === "resolved" ? "text-emerald-600" : "text-blue-600"
                    )}>
                      {i.status === "resolved" ? "Done" : "Active"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
