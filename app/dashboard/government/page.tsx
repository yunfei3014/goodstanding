"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
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
  X,
  Loader2,
  AlertCircle,
  Building2,
  Calendar,
  User,
  Pencil,
} from "lucide-react"

function StatusBadge({ status }: { status: string }) {
  if (status === "resolved") return <Badge variant="green">Resolved</Badge>
  if (status === "in_progress") return <Badge variant="blue">In progress</Badge>
  return <Badge variant="yellow">Scheduled</Badge>
}

type InteractionWithCompany = GovernmentInteraction & { company: Company | undefined }

// ─── Update / Resolve Modal ──────────────────────────────────────────────────

function UpdateInteractionModal({
  interaction,
  onClose,
  onSuccess,
}: {
  interaction: InteractionWithCompany
  onClose: () => void
  onSuccess: () => void
}) {
  const [status, setStatus] = useState<"in_progress" | "scheduled" | "resolved">(
    interaction.status
  )
  const [summary, setSummary] = useState(interaction.summary ?? "")
  const [eaName, setEaName] = useState(interaction.ea_name ?? "")
  const [duration, setDuration] = useState(
    interaction.call_duration_minutes ? String(interaction.call_duration_minutes) : ""
  )
  const [resolvedAt, setResolvedAt] = useState(
    interaction.resolved_at
      ? interaction.resolved_at.split("T")[0]
      : new Date().toISOString().split("T")[0]
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleSave() {
    setSaving(true)
    setError("")
    const supabase = createClient()
    const updates: Record<string, unknown> = {
      status,
      summary,
      ...(eaName ? { ea_name: eaName } : {}),
      ...(duration ? { call_duration_minutes: parseInt(duration) } : {}),
    }
    if (status === "resolved") {
      updates.resolved_at = new Date(resolvedAt).toISOString()
    } else {
      updates.resolved_at = null
    }
    const { error: err } = await supabase
      .from("government_interactions")
      .update(updates)
      .eq("id", interaction.id)
    setSaving(false)
    if (err) {
      setError(err.message)
    } else {
      onSuccess()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#1B2B4B]">Update interaction</h2>
            <p className="text-slate-500 text-sm mt-0.5">{interaction.type} · {interaction.agency}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Status */}
          <div>
            <Label className="mb-2 block">Status</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["scheduled", "in_progress", "resolved"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3 py-2 rounded-lg border-2 text-sm transition-all ${
                    status === s
                      ? "border-[#1B2B4B] bg-[#1B2B4B]/5 font-semibold text-[#1B2B4B]"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {s === "in_progress" ? "In progress" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Resolution date (if resolved) */}
          {status === "resolved" && (
            <div>
              <Label htmlFor="resolvedAt">Date resolved</Label>
              <Input
                id="resolvedAt"
                type="date"
                value={resolvedAt}
                onChange={(e) => setResolvedAt(e.target.value)}
                className="mt-1.5"
              />
            </div>
          )}

          {/* Summary */}
          <div>
            <Label htmlFor="summary">Summary / outcome</Label>
            <textarea
              id="summary"
              className="mt-1.5 w-full h-24 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Describe what happened, what was resolved, or next steps..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          {/* EA name + duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="eaName">EA / Rep name</Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="eaName"
                  placeholder="Agent name"
                  value={eaName}
                  onChange={(e) => setEaName(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="duration">Call duration (min)</Label>
              <div className="relative mt-1.5">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  placeholder="e.g. 45"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1 border-slate-200" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className={`flex-1 text-white ${
              status === "resolved"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-[#1B2B4B] hover:bg-[#243461]"
            }`}
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
            ) : status === "resolved" ? (
              <><CheckCircle2 className="w-4 h-4 mr-2" />Mark resolved</>
            ) : (
              <><Pencil className="w-4 h-4 mr-2" />Save update</>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function GovernmentPage() {
  const [requestOpen, setRequestOpen] = useState(false)
  const [requestType, setRequestType] = useState("")
  const [details, setDetails] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [interactions, setInteractions] = useState<InteractionWithCompany[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingInteraction, setUpdatingInteraction] = useState<InteractionWithCompany | null>(null)

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

  const active = interactions.filter((i) => i.status !== "resolved")
  const resolved = interactions.filter((i) => i.status === "resolved")

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Update / resolve modal */}
      {updatingInteraction && (
        <UpdateInteractionModal
          interaction={updatingInteraction}
          onClose={() => setUpdatingInteraction(null)}
          onSuccess={() => {
            setUpdatingInteraction(null)
            setLoading(true)
            loadData()
          }}
        />
      )}

      {/* New request modal */}
      {requestOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-[#1B2B4B]">Request government liaison</h2>
              <button onClick={() => setRequestOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
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
                {submitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>
                ) : (
                  <>Submit request <ArrowRight className="w-4 h-4 ml-1" /></>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

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
          <p className="text-emerald-400 font-bold text-2xl">{active.length}/2</p>
          <p className="text-slate-500 text-xs">active this month</p>
        </div>
      </div>

      {interactions.length === 0 ? (
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
      ) : (
        <div className="space-y-8">
          {/* Active interactions */}
          {active.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-900">Active</h2>
                <span className="text-sm text-slate-400">({active.length})</span>
              </div>
              <div className="space-y-3">
                {active.map((interaction) => (
                  <div
                    key={interaction.id}
                    className={`bg-white border rounded-xl p-5 shadow-sm ${
                      interaction.status === "in_progress" ? "border-blue-200" : "border-amber-200"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        interaction.status === "in_progress" ? "bg-blue-50" : "bg-amber-50"
                      }`}>
                        {interaction.status === "in_progress"
                          ? <AlertCircle className="w-5 h-5 text-blue-500" />
                          : <Clock className="w-5 h-5 text-amber-500" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-bold text-slate-900">{interaction.type}</h3>
                          <StatusBadge status={interaction.status} />
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-500 mb-2 flex-wrap">
                          <span>{interaction.agency}</span>
                          {interaction.company && (
                            <>
                              <span className="text-slate-300">·</span>
                              <span className="flex items-center gap-1">
                                <Building2 className="w-3.5 h-3.5" />
                                {interaction.company.name}
                              </span>
                            </>
                          )}
                          <span className="text-slate-300">·</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(interaction.created_at).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric",
                            })}
                          </span>
                        </div>
                        {interaction.summary && (
                          <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3 border border-slate-100 mb-2">
                            {interaction.summary}
                          </p>
                        )}
                        {(interaction.ea_name || interaction.call_duration_minutes) && (
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                            {interaction.ea_name && (
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" /> {interaction.ea_name}
                              </span>
                            )}
                            {interaction.call_duration_minutes && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {interaction.call_duration_minutes} min call
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                          onClick={() => setUpdatingInteraction(interaction)}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Resolve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs border-slate-200 hover:border-slate-300"
                          onClick={() => setUpdatingInteraction(interaction)}
                        >
                          <Pencil className="w-3.5 h-3.5 mr-1" />
                          Update
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Resolved */}
          {resolved.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h2 className="text-lg font-bold text-slate-900">Resolved</h2>
                <span className="text-sm text-slate-400">({resolved.length})</span>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Type</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Agency</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Company</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Resolved</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Outcome</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {resolved.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <p className="font-semibold text-slate-900 text-sm">{item.type}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-700">{item.agency}</p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <p className="text-sm text-slate-700">{item.company?.name ?? "—"}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-emerald-600 font-semibold">
                            {item.resolved_at
                              ? new Date(item.resolved_at).toLocaleDateString("en-US", {
                                  month: "short", day: "numeric", year: "numeric",
                                })
                              : "—"}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-xs text-slate-400 max-w-xs truncate">
                            {item.summary ?? "—"}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setUpdatingInteraction(item)}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
