import { notFound } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { Shield, CheckCircle2, AlertCircle, XCircle, FileText, Clock } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { cn } from "@/lib/utils"

// ─── types ───────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ companyId: string; token: string }> }

type Filing = {
  id: string
  type: string
  state: string
  due_date: string | null
  status: "completed" | "pending" | "overdue" | "not_required"
  filed_at: string | null
  amount: number | null
  notes: string | null
}

type Company = {
  id: string
  name: string
  entity_type: "llc" | "c_corp" | "s_corp"
  state_of_incorporation: string
  status: string
  formed_at: string | null
  status_token: string
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function entityLabel(e: string) {
  if (e === "c_corp") return "C-Corporation"
  if (e === "s_corp") return "S-Corporation"
  return "LLC"
}

function fmt(date: string | null | undefined) {
  if (!date) return "—"
  return new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  })
}

function fmtRelative(dateStr: string | null | undefined): string {
  if (!dateStr) return ""
  const diff = Math.round(
    (new Date(dateStr + "T12:00:00").getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )
  if (diff < 0) return `${Math.abs(diff)}d overdue`
  if (diff === 0) return "due today"
  if (diff === 1) return "due tomorrow"
  return `in ${diff}d`
}

// ─── metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { companyId, token } = await params
  const company = await fetchCompany(companyId, token)
  if (!company) return { title: "Company Status" }
  return {
    title: `${company.name} — Compliance Status`,
    description: `Public compliance status for ${company.name}, verified by GoodStanding.ai.`,
    robots: "noindex",
  }
}

// ─── data fetching ────────────────────────────────────────────────────────────

async function fetchCompany(companyId: string, token: string): Promise<Company | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  const { data } = await supabase
    .from("companies")
    .select("id, name, entity_type, state_of_incorporation, status, formed_at, status_token")
    .eq("id", companyId)
    .single()

  if (!data || data.status_token !== token) return null
  return data as Company
}

async function fetchFilings(companyId: string): Promise<Filing[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
  const { data } = await supabase
    .from("filings")
    .select("id, type, state, due_date, status, filed_at, amount, notes")
    .eq("company_id", companyId)
    .neq("status", "not_required")
    .order("due_date", { ascending: true })

  return (data ?? []) as Filing[]
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default async function PublicStatusPage({ params }: Props) {
  const { companyId, token } = await params
  const company = await fetchCompany(companyId, token)
  if (!company) notFound()

  const filings = await fetchFilings(companyId)

  const overdue   = filings.filter((f) => f.status === "overdue")
  const pending   = filings.filter((f) => f.status === "pending")
  const completed = filings.filter((f) => f.status === "completed")

  const overallStatus =
    overdue.length >= 3  ? "action_required"
    : overdue.length >= 1 ? "attention_needed"
    : "good_standing"

  const statusConfig = {
    good_standing:    { label: "Good Standing",    dotClass: "bg-emerald-400", badgeClass: "bg-emerald-500/20 text-emerald-400", Icon: CheckCircle2 },
    attention_needed: { label: "Attention Needed", dotClass: "bg-amber-400",   badgeClass: "bg-amber-500/20 text-amber-400",   Icon: AlertCircle },
    action_required:  { label: "Action Required",  dotClass: "bg-red-400",     badgeClass: "bg-red-500/20 text-red-400",       Icon: XCircle },
  }[overallStatus]

  const generatedOn = new Date().toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  })

  // Upcoming: pending filings due within 60 days
  const soon = pending.filter((f) => {
    if (!f.due_date) return false
    const diff = (new Date(f.due_date + "T12:00:00").getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    return diff <= 60
  })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header bar */}
      <header className="bg-[#0F1829] py-4 px-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-white font-bold text-sm">
              GoodStanding<span className="text-emerald-400">.ai</span>
            </span>
          </Link>
          <span className="text-xs text-slate-500">Public compliance status</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">

        {/* Company hero card */}
        <div className="bg-[#0F1829] rounded-2xl p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">{company.name}</h1>
              <p className="text-slate-400 text-sm">
                {entityLabel(company.entity_type)} · Incorporated in {company.state_of_incorporation}
                {company.formed_at ? ` · Est. ${fmt(company.formed_at)}` : ""}
              </p>
            </div>
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold flex-shrink-0",
              statusConfig.badgeClass
            )}>
              <div className={cn("w-2 h-2 rounded-full", statusConfig.dotClass)} />
              {statusConfig.label}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
            {[
              { label: "Overdue", value: overdue.length,   color: overdue.length   > 0 ? "text-red-400"     : "text-white" },
              { label: "Pending", value: pending.length,   color: pending.length   > 0 ? "text-amber-400"   : "text-white" },
              { label: "Filed",   value: completed.length, color: completed.length > 0 ? "text-emerald-400" : "text-white" },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center">
                <p className={cn("text-3xl font-black", color)}>{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Overdue filings */}
        {overdue.length > 0 && (
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-red-50 bg-red-50/50">
              <XCircle className="w-4 h-4 text-red-500" />
              <h2 className="font-bold text-slate-900 text-sm">Overdue filings</h2>
              <span className="ml-auto text-xs font-semibold text-red-500">{overdue.length}</span>
            </div>
            <div className="divide-y divide-slate-50">
              {overdue.map((f) => (
                <div key={f.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{f.type}</p>
                    <p className="text-xs text-slate-400">{f.state} · was due {fmt(f.due_date)}</p>
                  </div>
                  <span className="text-xs font-bold text-red-500 flex-shrink-0">
                    {fmtRelative(f.due_date)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming (within 60 days) */}
        {soon.length > 0 && (
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-amber-50 bg-amber-50/50">
              <Clock className="w-4 h-4 text-amber-500" />
              <h2 className="font-bold text-slate-900 text-sm">Upcoming (next 60 days)</h2>
              <span className="ml-auto text-xs font-semibold text-amber-500">{soon.length}</span>
            </div>
            <div className="divide-y divide-slate-50">
              {soon.map((f) => (
                <div key={f.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{f.type}</p>
                    <p className="text-xs text-slate-400">{f.state} · due {fmt(f.due_date)}</p>
                  </div>
                  <span className="text-xs font-semibold text-amber-600 flex-shrink-0">
                    {fmtRelative(f.due_date)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filed / completed */}
        {completed.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100">
              <FileText className="w-4 h-4 text-slate-400" />
              <h2 className="font-bold text-slate-900 text-sm">Filed filings</h2>
              <span className="ml-auto text-xs text-slate-400">{completed.length}</span>
            </div>
            <div className="divide-y divide-slate-50">
              {completed.map((f) => (
                <div key={f.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{f.type}</p>
                    <p className="text-xs text-slate-400">
                      {f.state} · filed {fmt(f.filed_at)}
                      {f.amount ? ` · $${f.amount.toLocaleString()}` : ""}
                    </p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {filings.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <p className="text-slate-600 font-semibold">No filings on record yet.</p>
            <p className="text-slate-400 text-sm mt-1">Filings will appear here once added to the dashboard.</p>
          </div>
        )}

        {/* Footer note */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-emerald-500" />
            Verified by GoodStanding.ai
          </span>
          <span>Generated {generatedOn}</span>
        </div>

        {/* CTA for visitors */}
        <div className="bg-[#0F1829] rounded-2xl p-6 text-center">
          <p className="text-white font-bold text-sm mb-1">Keep your own startup compliant</p>
          <p className="text-slate-400 text-xs mb-4">
            Formation, annual reports, government liaison — all on autopilot.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
          >
            Start for free
          </Link>
        </div>
      </main>
    </div>
  )
}
