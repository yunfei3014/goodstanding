"use client"

import { useState, useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase"
import type { Company, Filing, Document, GovernmentInteraction } from "@/lib/supabase"
import {
  CheckCircle2,
  XCircle,
  FileText,
  Phone,
  Upload,
  Activity,
  Filter,
} from "lucide-react"
import { cn } from "@/lib/utils"

type EventKind = "filed" | "overdue" | "document_uploaded" | "interaction_opened" | "interaction_resolved"

type ActivityEvent = {
  id: string
  kind: EventKind
  title: string
  description: string
  companyName: string
  date: string
}

const KIND_META: Record<EventKind, {
  icon: React.ElementType
  iconBg: string
  iconColor: string
  badgeClass: string
  badge: string
}> = {
  filed: {
    icon: CheckCircle2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    badgeClass: "bg-emerald-50 text-emerald-700",
    badge: "Filed",
  },
  overdue: {
    icon: XCircle,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    badgeClass: "bg-red-50 text-red-700",
    badge: "Overdue",
  },
  document_uploaded: {
    icon: Upload,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    badgeClass: "bg-blue-50 text-blue-700",
    badge: "Document",
  },
  interaction_opened: {
    icon: Phone,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    badgeClass: "bg-purple-50 text-purple-700",
    badge: "Gov't Liaison",
  },
  interaction_resolved: {
    icon: CheckCircle2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    badgeClass: "bg-emerald-50 text-emerald-700",
    badge: "Resolved",
  },
}

const FILTER_OPTIONS = [
  { value: "all",      label: "All activity" },
  { value: "filings",  label: "Filings" },
  { value: "documents", label: "Documents" },
  { value: "liaison",  label: "Gov't Liaison" },
]

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60)     return "just now"
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: diff > 86400 * 365 ? "numeric" : undefined,
  })
}

function buildEvents(
  filings: Filing[],
  documents: Document[],
  interactions: GovernmentInteraction[],
  companies: Company[]
): ActivityEvent[] {
  const companyName = (id: string) => companies.find((c) => c.id === id)?.name ?? "Unknown"
  const events: ActivityEvent[] = []

  // Filings: completed ones
  for (const f of filings) {
    if (f.status === "completed" && f.filed_at) {
      events.push({
        id: `filed-${f.id}`,
        kind: "filed",
        title: `Filed: ${f.type}`,
        description: `${f.state}${f.amount ? ` · $${f.amount.toLocaleString()}` : ""}${f.notes ? ` · ${f.notes}` : ""}`,
        companyName: companyName(f.company_id),
        date: f.filed_at,
      })
    }
    if (f.status === "overdue") {
      events.push({
        id: `overdue-${f.id}`,
        kind: "overdue",
        title: `Past due: ${f.type}`,
        description: `${f.state} · Due ${new Date(f.due_date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
        companyName: companyName(f.company_id),
        date: f.due_date,
      })
    }
  }

  // Documents
  for (const d of documents) {
    events.push({
      id: `doc-${d.id}`,
      kind: "document_uploaded",
      title: `Uploaded: ${d.name}`,
      description: `${d.type}${d.size_kb ? ` · ${d.size_kb < 1024 ? `${d.size_kb} KB` : `${(d.size_kb / 1024).toFixed(1)} MB`}` : ""}`,
      companyName: companyName(d.company_id),
      date: d.uploaded_at,
    })
  }

  // Government interactions
  for (const gi of interactions) {
    events.push({
      id: `gi-opened-${gi.id}`,
      kind: "interaction_opened",
      title: `Opened: ${gi.type}`,
      description: `${gi.agency}${gi.summary ? ` · ${gi.summary.slice(0, 80)}${gi.summary.length > 80 ? "…" : ""}` : ""}`,
      companyName: companyName(gi.company_id),
      date: gi.created_at,
    })
    if (gi.resolved_at) {
      events.push({
        id: `gi-resolved-${gi.id}`,
        kind: "interaction_resolved",
        title: `Resolved: ${gi.type}`,
        description: `${gi.agency}${gi.ea_name ? ` · via ${gi.ea_name}` : ""}`,
        companyName: companyName(gi.company_id),
        date: gi.resolved_at,
      })
    }
  }

  // Sort newest first
  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

const PAGE_SIZE = 20

export default function ActivityPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [filings, setFilings] = useState<Filing[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [interactions, setInteractions] = useState<GovernmentInteraction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [page, setPage] = useState(1)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data: companiesData } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: true })

      const cos = companiesData ?? []
      setCompanies(cos)

      if (cos.length === 0) {
        setLoading(false)
        return
      }

      const ids = cos.map((c: Company) => c.id)

      const [{ data: filingsData }, { data: docsData }, { data: giData }] = await Promise.all([
        supabase.from("filings").select("*").in("company_id", ids),
        supabase.from("documents").select("*").in("company_id", ids),
        supabase.from("government_interactions").select("*").in("company_id", ids),
      ])

      setFilings(filingsData ?? [])
      setDocuments(docsData ?? [])
      setInteractions(giData ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const allEvents = useMemo(
    () => buildEvents(filings, documents, interactions, companies),
    [filings, documents, interactions, companies]
  )

  const filtered = useMemo(() => {
    if (filter === "all") return allEvents
    if (filter === "filings") return allEvents.filter((e) => e.kind === "filed" || e.kind === "overdue")
    if (filter === "documents") return allEvents.filter((e) => e.kind === "document_uploaded")
    if (filter === "liaison") return allEvents.filter((e) => e.kind === "interaction_opened" || e.kind === "interaction_resolved")
    return allEvents
  }, [allEvents, filter])

  const visible = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = visible.length < filtered.length

  // Group events by date label
  function dateLabel(dateStr: string) {
    const date = new Date(dateStr)
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)
    const eventDay = new Date(date); eventDay.setHours(0, 0, 0, 0)
    if (eventDay.getTime() === today.getTime()) return "Today"
    if (eventDay.getTime() === yesterday.getTime()) return "Yesterday"
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
  }

  // Build grouped list
  const grouped: { label: string; events: ActivityEvent[] }[] = []
  for (const event of visible) {
    const label = dateLabel(event.date)
    const last = grouped[grouped.length - 1]
    if (last && last.label === label) {
      last.events.push(event)
    } else {
      grouped.push({ label, events: [event] })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Activity</h1>
          <p className="text-slate-500 text-sm">
            A full history of filings, documents, and government interactions.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1 flex-shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setFilter(opt.value); setPage(1) }}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                filter === opt.value
                  ? "bg-[#1B2B4B] text-white"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { label: "Filings filed",  value: allEvents.filter((e) => e.kind === "filed").length,              color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Overdue",        value: allEvents.filter((e) => e.kind === "overdue").length,            color: "text-red-600",     bg: "bg-red-50" },
          { label: "Documents",      value: allEvents.filter((e) => e.kind === "document_uploaded").length,  color: "text-blue-600",    bg: "bg-blue-50" },
          { label: "Gov't actions",  value: allEvents.filter((e) => e.kind === "interaction_opened" || e.kind === "interaction_resolved").length, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((s) => (
          <div key={s.label} className={cn("rounded-xl p-4 text-center", s.bg)}>
            <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center">
          <Activity className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-semibold text-slate-600 mb-1">No activity yet</p>
          <p className="text-sm text-slate-400">
            {filter === "all"
              ? "File a compliance item, upload a document, or log a government interaction to see activity here."
              : `No ${filter} activity found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ label, events }) => (
            <div key={label}>
              {/* Date heading */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                  {label}
                </span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              {/* Events for this date */}
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[19px] top-5 bottom-2 w-px bg-slate-100" />

                <div className="space-y-1">
                  {events.map((event, i) => {
                    const meta = KIND_META[event.kind]
                    const Icon = meta.icon
                    return (
                      <div key={event.id} className="flex items-start gap-4 group">
                        {/* Icon dot */}
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 border-2 border-white",
                          meta.iconBg
                        )}>
                          <Icon className={cn("w-4 h-4", meta.iconColor)} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 bg-white rounded-xl border border-slate-100 px-4 py-3 shadow-sm group-hover:border-slate-200 transition-colors mb-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", meta.badgeClass)}>
                                  {meta.badge}
                                </span>
                                {companies.length > 1 && (
                                  <span className="text-xs text-slate-400 font-medium">{event.companyName}</span>
                                )}
                              </div>
                              <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                              {event.description && (
                                <p className="text-xs text-slate-400 mt-0.5 truncate">{event.description}</p>
                              )}
                            </div>
                            <span className="text-xs text-slate-400 flex-shrink-0 mt-0.5">
                              {timeAgo(event.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Load more */}
          {hasMore && (
            <div className="text-center pt-2">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-6 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                Load more ({filtered.length - visible.length} remaining)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
