"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase"
import type { Company, Document } from "@/lib/supabase"
import {
  FileText,
  Download,
  Upload,
  FolderOpen,
  Search,
} from "lucide-react"
import { Input } from "@/components/ui/input"

const typeColors: Record<string, string> = {
  Formation: "blue",
  Tax: "purple",
  Filing: "emerald",
  Agreement: "amber",
}

function TypeBadge({ type }: { type: string }) {
  const color = typeColors[type] || "default"
  return <Badge variant={color as "blue" | "green" | "yellow" | "red" | "navy" | "default"}>{type}</Badge>
}

type DocumentWithCompany = Document & { company: Company | undefined }

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocumentWithCompany[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const [{ data: docsData }, { data: companiesData }] = await Promise.all([
        supabase.from("documents").select("*").order("uploaded_at", { ascending: false }),
        supabase.from("companies").select("*"),
      ])
      const companiesList = companiesData ?? []
      const combined = (docsData ?? []).map((d) => ({
        ...d,
        company: companiesList.find((c: Company) => c.id === d.company_id),
      }))
      setDocs(combined)
      setCompanies(companiesList)
      setLoading(false)
    }
    load()
  }, [])

  const filtered = search
    ? docs.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
    : docs

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Documents</h1>
          <p className="text-slate-500">All formation documents, filings, and government correspondence in one place.</p>
        </div>
        <Button className="bg-[#1B2B4B] hover:bg-[#243461] text-white flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search documents..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total documents", value: docs.length, icon: FileText },
          { label: "Formation", value: docs.filter((d) => d.type === "Formation").length, icon: FolderOpen },
          { label: "Tax", value: docs.filter((d) => d.type === "Tax").length, icon: FileText },
          { label: "Filings", value: docs.filter((d) => d.type === "Filing").length, icon: FileText },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-1">
              <stat.icon className="w-4 h-4 text-slate-400" />
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {docs.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center">
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 mb-1">No documents yet</h3>
          <p className="text-slate-400 text-sm">Upload formation documents, filings, or correspondence.</p>
        </div>
      ) : (
        companies.map((company) => {
          const companyDocs = filtered.filter((d) => d.company_id === company.id)
          if (!companyDocs.length) return null

          return (
            <div key={company.id} className="mb-8">
              <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-slate-400" />
                {company.name}
              </h2>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Document</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Type</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Date</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Size</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {companyDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="w-4 h-4 text-slate-500" />
                            </div>
                            <p className="font-semibold text-slate-900 text-sm">{doc.name}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <TypeBadge type={doc.type} />
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-500">
                            {new Date(doc.uploaded_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-400">{doc.size_kb ? `${doc.size_kb} KB` : "—"}</p>
                        </td>
                        <td className="px-5 py-4">
                          {doc.url ? (
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="sm" className="text-slate-500">
                                <Download className="w-4 h-4" />
                              </Button>
                            </a>
                          ) : (
                            <Button variant="ghost" size="sm" className="text-slate-300" disabled>
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
