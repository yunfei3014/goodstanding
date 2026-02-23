"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import type { Company, Filing, Document, GovernmentInteraction } from "@/lib/supabase"
import {
  Search,
  FileCheck,
  FolderOpen,
  Phone,
  Building2,
  X,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

type ResultKind = "company" | "filing" | "document" | "interaction"

type SearchResult = {
  id: string
  kind: ResultKind
  title: string
  subtitle: string
  href: string
  badge?: string
  badgeClass?: string
}

const KIND_ICON: Record<ResultKind, React.ElementType> = {
  company:     Building2,
  filing:      FileCheck,
  document:    FolderOpen,
  interaction: Phone,
}

const KIND_LABEL: Record<ResultKind, string> = {
  company:     "Companies",
  filing:      "Filings",
  document:    "Documents",
  interaction: "Gov't Liaison",
}

const KIND_ORDER: ResultKind[] = ["company", "filing", "document", "interaction"]

function norm(s: string) {
  return s.toLowerCase().replace(/\s+/g, " ").trim()
}

function buildResults(
  q: string,
  companies: Company[],
  filings: Filing[],
  documents: Document[],
  interactions: GovernmentInteraction[],
): SearchResult[] {
  if (!q) return []
  const nq = norm(q)
  const coName = (id: string) => companies.find((c) => c.id === id)?.name ?? ""
  const out: SearchResult[] = []

  for (const c of companies) {
    if (norm(c.name).includes(nq) || norm(c.state_of_incorporation).includes(nq)) {
      out.push({
        id: `co-${c.id}`,
        kind: "company",
        title: c.name,
        subtitle: `${c.entity_type === "c_corp" ? "C-Corporation" : c.entity_type === "s_corp" ? "S-Corporation" : "LLC"} · ${c.state_of_incorporation}`,
        href: "/dashboard",
      })
    }
  }

  for (const f of filings) {
    if (norm(f.type).includes(nq) || norm(f.state).includes(nq) || (f.notes && norm(f.notes).includes(nq))) {
      out.push({
        id: `f-${f.id}`,
        kind: "filing",
        title: f.type,
        subtitle: `${f.state}${companies.length > 1 ? ` · ${coName(f.company_id)}` : ""}`,
        href: "/dashboard/compliance",
        badge: f.status === "completed" ? "Filed" : f.status === "overdue" ? "Overdue" : "Pending",
        badgeClass:
          f.status === "completed" ? "bg-emerald-50 text-emerald-700"
          : f.status === "overdue"  ? "bg-red-50 text-red-700"
          : "bg-amber-50 text-amber-700",
      })
    }
  }

  for (const d of documents) {
    if (norm(d.name).includes(nq) || norm(d.type).includes(nq)) {
      out.push({
        id: `doc-${d.id}`,
        kind: "document",
        title: d.name,
        subtitle: `${d.type}${companies.length > 1 ? ` · ${coName(d.company_id)}` : ""}`,
        href: "/dashboard/documents",
      })
    }
  }

  for (const gi of interactions) {
    if (norm(gi.type).includes(nq) || norm(gi.agency).includes(nq) || norm(gi.summary).includes(nq)) {
      out.push({
        id: `gi-${gi.id}`,
        kind: "interaction",
        title: gi.type,
        subtitle: `${gi.agency}${companies.length > 1 ? ` · ${coName(gi.company_id)}` : ""}`,
        href: "/dashboard/government",
        badge: gi.status === "resolved" ? "Resolved" : gi.status === "in_progress" ? "In progress" : "Scheduled",
        badgeClass: gi.status === "resolved" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700",
      })
    }
  }

  return out.slice(0, 15)
}

export function SearchModal({
  companies,
  onClose,
}: {
  companies: Company[]
  onClose: () => void
}) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState("")
  const [filings, setFilings] = useState<Filing[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [interactions, setInteractions] = useState<GovernmentInteraction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIdx, setSelectedIdx] = useState(0)

  // Load searchable data once on mount
  useEffect(() => {
    if (companies.length === 0) { setLoading(false); return }
    const supabase = createClient()
    const ids = companies.map((c) => c.id)
    Promise.all([
      supabase.from("filings").select("*").in("company_id", ids),
      supabase.from("documents").select("*").in("company_id", ids),
      supabase.from("government_interactions").select("*").in("company_id", ids),
    ]).then(([{ data: f }, { data: d }, { data: g }]) => {
      setFilings(f ?? [])
      setDocuments(d ?? [])
      setInteractions(g ?? [])
      setLoading(false)
    })
  }, [companies])

  useEffect(() => { inputRef.current?.focus() }, [])

  const results = useMemo(
    () => buildResults(query, companies, filings, documents, interactions),
    [query, companies, filings, documents, interactions],
  )

  useEffect(() => { setSelectedIdx(0) }, [results])

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${selectedIdx}"]`)
    el?.scrollIntoView({ block: "nearest" })
  }, [selectedIdx])

  function go(href: string) {
    router.push(href)
    onClose()
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown")  { e.preventDefault(); setSelectedIdx((i) => Math.min(i + 1, results.length - 1)) }
    else if (e.key === "ArrowUp")   { e.preventDefault(); setSelectedIdx((i) => Math.max(i - 1, 0)) }
    else if (e.key === "Enter" && results[selectedIdx]) go(results[selectedIdx].href)
    else if (e.key === "Escape") onClose()
  }

  // Build grouped display list
  const grouped = KIND_ORDER.flatMap((kind) => {
    const items = results.map((r, i) => ({ ...r, _idx: i })).filter((r) => r.kind === kind)
    if (items.length === 0) return []
    return [{ kind, items }]
  })

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Search filings, documents, interactions…"
            className="flex-1 text-slate-900 placeholder:text-slate-400 outline-none text-sm bg-transparent"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-0.5 text-slate-400 hover:text-slate-600 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
              esc
            </kbd>
          )}
        </div>

        {/* Results body */}
        <div ref={listRef} className="max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : query.length === 0 ? (
            <div className="py-10 text-center space-y-1.5">
              <Search className="w-8 h-8 text-slate-200 mx-auto" />
              <p className="text-sm text-slate-400">Start typing to search everything.</p>
              <p className="text-xs text-slate-300">Filings · Documents · Gov&apos;t interactions · Companies</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-slate-500">
                No results for <span className="font-semibold">"{query}"</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">Try a different search term.</p>
            </div>
          ) : (
            <div className="py-2">
              {grouped.map(({ kind, items }) => (
                <div key={kind}>
                  {/* Section header */}
                  <div className="flex items-center gap-2 px-4 py-1.5 mt-1">
                    {(() => { const Icon = KIND_ICON[kind]; return <Icon className="w-3 h-3 text-slate-400" /> })()}
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {KIND_LABEL[kind]}
                    </span>
                  </div>

                  {/* Items */}
                  {items.map((result) => {
                    const Icon = KIND_ICON[result.kind]
                    const isSel = result._idx === selectedIdx
                    return (
                      <button
                        key={result.id}
                        data-idx={result._idx}
                        onMouseEnter={() => setSelectedIdx(result._idx)}
                        onClick={() => go(result.href)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left group",
                          isSel ? "bg-slate-50" : "hover:bg-slate-50"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                          isSel ? "bg-[#1B2B4B]" : "bg-slate-100"
                        )}>
                          <Icon className={cn("w-4 h-4", isSel ? "text-emerald-400" : "text-slate-500")} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{result.title}</p>
                          <p className="text-xs text-slate-400 truncate">{result.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {result.badge && (
                            <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", result.badgeClass)}>
                              {result.badge}
                            </span>
                          )}
                          <ArrowRight className={cn(
                            "w-3.5 h-3.5 transition-opacity",
                            isSel ? "text-slate-400 opacity-100" : "opacity-0"
                          )} />
                        </div>
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Keyboard hint footer */}
        {results.length > 0 && (
          <div className="flex items-center gap-5 px-4 py-2 border-t border-slate-100 bg-slate-50/60">
            {[
              { keys: ["↑", "↓"], label: "navigate" },
              { keys: ["↵"],      label: "open" },
              { keys: ["esc"],    label: "close" },
            ].map(({ keys, label }) => (
              <div key={label} className="flex items-center gap-1">
                {keys.map((k) => (
                  <kbd key={k} className="inline-flex items-center text-xs text-slate-400 bg-white border border-slate-200 px-1.5 py-px rounded font-mono">
                    {k}
                  </kbd>
                ))}
                <span className="text-xs text-slate-400 ml-1">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
