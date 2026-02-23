"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase"
import type { Company, Document } from "@/lib/supabase"
import { useCompany } from "@/lib/company-context"
import {
  FileText,
  Download,
  Upload,
  FolderOpen,
  Search,
  X,
  File,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const DOC_TYPES = ["Formation", "Tax", "Filing", "Agreement", "Government Notice", "Other"]

const typeVariants: Record<string, "blue" | "green" | "yellow" | "red" | "navy" | "default"> = {
  Formation: "blue",
  Tax: "default",
  Filing: "green",
  Agreement: "yellow",
  "Government Notice": "navy",
  Other: "default",
}

function TypeBadge({ type }: { type: string }) {
  return <Badge variant={typeVariants[type] ?? "default"}>{type}</Badge>
}

type DocumentWithCompany = Document & { company: Company | undefined }

function formatBytes(kb: number | null): string {
  if (!kb) return "—"
  if (kb < 1024) return `${kb} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

export default function DocumentsPage() {
  const { companies, selectedCompany } = useCompany()
  const [docs, setDocs] = useState<DocumentWithCompany[]>([])
  const [userId, setUserId] = useState<string>("")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  // Upload modal state
  const [uploadOpen, setUploadOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [docType, setDocType] = useState("")
  const [selectedCompanyId, setSelectedCompanyId] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (selectedCompany) loadData(selectedCompany.id)
  }, [selectedCompany])

  // Keep upload company selector in sync with selected company
  useEffect(() => {
    if (selectedCompany && !selectedCompanyId) setSelectedCompanyId(selectedCompany.id)
  }, [selectedCompany, selectedCompanyId])

  async function loadData(companyId: string) {
    setLoading(true)
    const supabase = createClient()
    const [{ data: { user } }, { data: docsData }] = await Promise.all([
      supabase.auth.getUser(),
      supabase.from("documents").select("*").eq("company_id", companyId).order("uploaded_at", { ascending: false }),
    ])
    const combined = (docsData ?? []).map((d) => ({
      ...d,
      company: companies.find((c: Company) => c.id === d.company_id),
    }))
    setDocs(combined)
    if (user) setUserId(user.id)
    setLoading(false)
  }

  function openUpload() {
    setSelectedFile(null)
    setDocType("")
    setUploadMsg("")
    setUploadOpen(true)
  }

  function closeUpload() {
    setUploadOpen(false)
    setSelectedFile(null)
    setDocType("")
    setUploadMsg("")
  }

  async function handleUpload() {
    if (!selectedFile || !docType || !selectedCompanyId || !userId) return
    setUploading(true)
    setUploadMsg("")

    const supabase = createClient()
    const safeName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const storagePath = `${userId}/${selectedCompanyId}/${Date.now()}_${safeName}`

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(storagePath, selectedFile, { upsert: false })

    if (uploadError) {
      setUploadMsg(`Upload failed: ${uploadError.message}`)
      setUploading(false)
      return
    }

    const { error: dbError } = await supabase.from("documents").insert({
      company_id: selectedCompanyId,
      name: selectedFile.name,
      type: docType,
      storage_path: storagePath,
      size_kb: Math.round(selectedFile.size / 1024),
    })

    if (dbError) {
      setUploadMsg(`Database error: ${dbError.message}`)
      setUploading(false)
      return
    }

    if (selectedCompany) await loadData(selectedCompany.id)
    closeUpload()
    setUploading(false)
  }

  async function handleDownload(doc: DocumentWithCompany) {
    if (!doc.storage_path) return
    const supabase = createClient()
    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(doc.storage_path, 60 * 60)
    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank")
    } else if (error) {
      console.error("Download error:", error.message)
    }
  }

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
        <Button
          className="bg-[#1B2B4B] hover:bg-[#243461] text-white flex items-center gap-2"
          onClick={openUpload}
        >
          <Upload className="w-4 h-4" />
          Upload
        </Button>
      </div>

      {/* Upload modal */}
      {uploadOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1B2B4B]">Upload document</h2>
              <button onClick={closeUpload} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* File picker */}
              <div>
                <Label className="mb-2 block">File</Label>
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                    selectedFile
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <File className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="text-left min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">{selectedFile.name}</p>
                        <p className="text-xs text-slate-400">{formatBytes(Math.round(selectedFile.size / 1024))}</p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto flex-shrink-0" />
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">Click to select a file</p>
                      <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX, JPG, PNG</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                  />
                </div>
              </div>

              {/* Document type */}
              <div>
                <Label className="mb-2 block">Document type</Label>
                <div className="grid grid-cols-3 gap-2">
                  {DOC_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setDocType(type)}
                      className={`px-3 py-2 rounded-lg border-2 text-sm transition-all ${
                        docType === type
                          ? "border-[#1B2B4B] bg-[#1B2B4B]/5 font-semibold text-[#1B2B4B]"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Company selector (only shown when multiple companies) */}
              {companies.length > 1 && (
                <div>
                  <Label className="mb-2 block">Company</Label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={selectedCompanyId}
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                  >
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {uploadMsg && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{uploadMsg}</p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1 border-slate-200" onClick={closeUpload}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#1B2B4B] hover:bg-[#243461] text-white"
                disabled={!selectedFile || !docType || uploading}
                onClick={handleUpload}
              >
                {uploading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading...</>
                ) : (
                  <><Upload className="w-4 h-4 mr-2" />Upload</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

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
          <p className="text-slate-400 text-sm mb-4">Upload formation documents, filings, or correspondence.</p>
          <Button className="bg-[#1B2B4B] hover:bg-[#243461] text-white" onClick={openUpload}>
            <Upload className="w-4 h-4 mr-2" />
            Upload document
          </Button>
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
                          <p className="text-sm text-slate-400">{formatBytes(doc.size_kb)}</p>
                        </td>
                        <td className="px-5 py-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={doc.storage_path ? "text-slate-500 hover:text-slate-700" : "text-slate-300"}
                            disabled={!doc.storage_path}
                            onClick={() => handleDownload(doc)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
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
