import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { demoDocuments, demoCompanies } from "@/lib/demo-data"
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

export default function DocumentsPage() {
  const allDocs = demoDocuments.map((doc) => ({
    ...doc,
    company: demoCompanies.find((c) => c.id === doc.company_id),
  }))

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
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total documents", value: allDocs.length, icon: FileText },
          { label: "Formation", value: allDocs.filter(d => d.type === "Formation").length, icon: FolderOpen },
          { label: "Tax", value: allDocs.filter(d => d.type === "Tax").length, icon: FileText },
          { label: "Filings", value: allDocs.filter(d => d.type === "Filing").length, icon: FileText },
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

      {/* Documents by company */}
      {demoCompanies.map((company) => {
        const companyDocs = allDocs.filter((d) => d.company_id === company.id)
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
                        <p className="text-sm text-slate-400">{doc.size_kb} KB</p>
                      </td>
                      <td className="px-5 py-4">
                        <Button variant="ghost" size="sm" className="text-slate-500">
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
      })}
    </div>
  )
}
