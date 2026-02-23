"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase"
import type { Company, GovernmentInteraction } from "@/lib/supabase"
import {
  Phone,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  FileText,
  Shield,
} from "lucide-react"

function StatusBadge({ status }: { status: string }) {
  if (status === "resolved") return <Badge variant="green">Resolved</Badge>
  if (status === "in_progress") return <Badge variant="blue">In progress</Badge>
  return <Badge variant="yellow">Scheduled</Badge>
}

type InteractionWithCompany = GovernmentInteraction & { company: Company | undefined }

export default function GovernmentPage() {
  const [requestOpen, setRequestOpen] = useState(false)
  const [requestType, setRequestType] = useState("")
  const [details, setDetails] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [interactions, setInteractions] = useState<InteractionWithCompany[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const supabase = createClient()
    const [{ data: interactionsData }, { data: companiesData }] = await Promise.all([
      supabase.from("government_interactions").select("*").order("created_at", { ascending: false }),
      supabase.from("companies").select("*"),
    ])
    const companiesList = companiesData ?? []
    const combined = (interactionsData ?? []).map((i) => ({
      ...i,
      company: companiesList.find((c: Company) => c.id === i.company_id),
    }))
    setInteractions(combined)
    setCompanies(companiesList)
    setLoading(false)
  }

  async function handleSubmit() {
    if (!requestType || companies.length === 0) return
    setSubmitting(true)
    const supabase = createClient()
    await supabase.from("government_interactions").insert({
      company_id: companies[0].id,
      type: requestType,
      agency: "Pending assignment",
      status: "scheduled",
      summary: details || "Request submitted — our Enrolled Agent will review shortly.",
    })
    await loadData()
    setRequestOpen(false)
    setRequestType("")
    setDetails("")
    setSubmitting(false)
  }

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
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Government Liaison</h1>
          <p className="text-slate-500">
            Every government interaction, handled by our Enrolled Agents on your behalf.
          </p>
        </div>
        <Button
          onClick={() => setRequestOpen(true)}
          className="bg-[#1B2B4B] hover:bg-[#243461] text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New request
        </Button>
      </div>

      {/* New request modal */}
      {requestOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <h2 className="text-xl font-bold text-[#1B2B4B] mb-2">Request government liaison</h2>
            <p className="text-slate-500 text-sm mb-6">
              Describe the issue. Our Enrolled Agent will review, prep, and make the call.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <Label>Type of issue</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    "IRS notice",
                    "State agency issue",
                    "Transcript request",
                    "Payment verification",
                    "Penalty abatement",
                    "Good standing cert",
                  ].map((type) => (
                    <button
                      key={type}
                      onClick={() => setRequestType(type)}
                      className={`text-left px-3 py-2.5 rounded-lg border-2 text-sm transition-all ${
                        requestType === type
                          ? "border-[#1B2B4B] bg-[#1B2B4B]/5 font-semibold text-[#1B2B4B]"
                          : "border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="details">Details</Label>
                <textarea
                  id="details"
                  className="mt-1.5 w-full h-28 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 resize-none"
                  placeholder="Describe the notice, issue, or request. Attach document in the Documents tab."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4 mb-6 border border-emerald-100">
              <p className="text-sm font-semibold text-emerald-800 mb-1">What happens next</p>
              <ol className="space-y-1 text-sm text-emerald-700">
                <li>1. AI reviews your request and preps the call</li>
                <li>2. EA calls the relevant agency (usually within 24 hours)</li>
                <li>3. Resolution summary appears here in your dashboard</li>
              </ol>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 border-slate-200" onClick={() => setRequestOpen(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#1B2B4B] hover:bg-[#243461] text-white"
                disabled={!requestType || submitting}
                onClick={handleSubmit}
              >
                {submitting ? "Submitting..." : "Submit request"} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* EA info banner */}
      <div className="bg-[#1B2B4B] rounded-xl p-5 mb-8 flex items-center gap-5">
        <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
          <Shield className="w-6 h-6 text-emerald-400" />
        </div>
        <div className="flex-1">
          <p className="text-white font-semibold mb-0.5">Enrolled Agent authorized</p>
          <p className="text-slate-400 text-sm">
            Your account includes government liaison on the Growth plan (2 calls/month).
            Our EAs are federally licensed for unlimited IRS representation.
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-emerald-400 font-bold text-2xl">
            {interactions.filter((i) => i.status !== "resolved").length}/2
          </p>
          <p className="text-slate-500 text-xs">calls used this month</p>
        </div>
      </div>

      {/* Interaction history */}
      <h2 className="text-lg font-bold text-slate-900 mb-4">Interaction history</h2>

      {interactions.length > 0 ? (
        <div className="space-y-4">
          {interactions.map((interaction) => (
            <div key={interaction.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    interaction.status === "resolved" ? "bg-emerald-50" : "bg-blue-50"
                  }`}>
                    {interaction.status === "resolved" ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900">{interaction.type}</h3>
                      <StatusBadge status={interaction.status} />
                    </div>
                    <p className="text-slate-500 text-sm">
                      {interaction.agency} · {interaction.company?.name}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-slate-400">
                    Opened {new Date(interaction.created_at).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </p>
                  {interaction.resolved_at && (
                    <p className="text-xs text-emerald-600 font-semibold">
                      Resolved {new Date(interaction.resolved_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Summary</p>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{interaction.summary}</p>
              </div>

              {interaction.status === "resolved" && (
                <div className="flex items-center gap-2 mt-4 text-xs text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="font-semibold">Fully resolved · No further action needed</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-dashed border-slate-200 p-10 text-center">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-6 h-6 text-slate-300" />
          </div>
          <h3 className="font-semibold text-slate-700 mb-1">Request a government call</h3>
          <p className="text-slate-400 text-sm mb-4 max-w-xs mx-auto">
            Got a notice? Need a transcript? Have a state issue? We handle it.
          </p>
          <Button
            onClick={() => setRequestOpen(true)}
            className="bg-[#1B2B4B] hover:bg-[#243461] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New request
          </Button>
        </div>
      )}
    </div>
  )
}
