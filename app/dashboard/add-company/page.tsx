"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { generateDefaultFilings } from "@/lib/filings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  Loader2,
  MapPin,
  ArrowLeft,
} from "lucide-react"

const ENTITY_TYPES = [
  {
    id: "c_corp",
    name: "C-Corporation",
    recommended: true,
    desc: "Standard for VC-backed startups. Required for institutional investors.",
  },
  {
    id: "llc",
    name: "LLC",
    recommended: false,
    desc: "Flexible, pass-through taxation. Great for solo founders.",
  },
  {
    id: "s_corp",
    name: "S-Corporation",
    recommended: false,
    desc: "Tax advantages for profitable small businesses.",
  },
]

const POPULAR_STATES = [
  { value: "DE", label: "Delaware", note: "Standard for VC-backed startups" },
  { value: "WY", label: "Wyoming",  note: "Low fees, no state income tax" },
  { value: "CA", label: "California", note: "If your team is based here" },
  { value: "TX", label: "Texas",    note: "No state income tax" },
  { value: "NY", label: "New York", note: "" },
  { value: "FL", label: "Florida",  note: "No state income tax" },
]

const OTHER_STATES = [
  "AL","AK","AZ","AR","CO","CT","GA","HI","ID","IL","IN","IA","KS","KY","LA",
  "ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NC","ND",
  "OH","OK","OR","PA","RI","SC","SD","TN","UT","VT","VA","WA","WV","WI",
]

type Step = "entity" | "state" | "confirm"

export default function AddCompanyPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("entity")
  const [name, setName]             = useState("")
  const [entityType, setEntityType] = useState("c_corp")
  const [state, setState]           = useState("DE")
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState("")

  const canProceedEntity = name.trim().length >= 2
  const canProceedState  = !!state

  async function handleCreate() {
    setSaving(true)
    setError("")
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError("Session expired — please log in again.")
      setSaving(false)
      return
    }

    const { data: newCompany, error: insertError } = await supabase
      .from("companies")
      .insert({
        user_id: user.id,
        name: name.trim(),
        entity_type: entityType,
        state_of_incorporation: state,
        plan: "launch",
        status: "good_standing",
      })
      .select()
      .single()

    if (insertError || !newCompany) {
      setError(insertError?.message ?? "Failed to create company.")
      setSaving(false)
      return
    }

    // Seed default compliance filings
    const defaults = generateDefaultFilings(newCompany)
    if (defaults.length > 0) {
      await supabase.from("filings").insert(defaults)
    }

    router.push("/dashboard")
    router.refresh()
  }

  const entityLabel = ENTITY_TYPES.find((e) => e.id === entityType)?.name ?? entityType
  const stateLabel  = POPULAR_STATES.find((s) => s.value === state)?.label ?? state

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-[#1B2B4B] rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Add a company</h1>
        </div>
        <p className="text-slate-500 text-sm ml-[52px]">
          Set up a new entity on your compliance dashboard.
        </p>
      </div>

      {/* Step: Entity */}
      {step === "entity" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            Company details
          </h2>

          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Company name</Label>
              <Input
                id="name"
                className="mt-1.5"
                placeholder="Acme AI, Inc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <p className="text-xs text-slate-400 mt-1">
                Exactly as it will appear on official documents.
              </p>
            </div>

            <div>
              <Label className="mb-3 block">Entity type</Label>
              <div className="space-y-2.5">
                {ENTITY_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setEntityType(type.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      entityType === type.id
                        ? "border-[#1B2B4B] bg-[#1B2B4B]/5"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-[#1B2B4B]">{type.name}</span>
                          {type.recommended && (
                            <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 text-sm">{type.desc}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 ml-3 flex items-center justify-center ${
                          entityType === type.id ? "border-[#1B2B4B] bg-[#1B2B4B]" : "border-slate-300"
                        }`}
                      >
                        {entityType === type.id && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            className="w-full mt-6 bg-[#1B2B4B] hover:bg-[#243461] text-white"
            disabled={!canProceedEntity}
            onClick={() => setStep("state")}
          >
            Continue <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Step: State */}
      {step === "state" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            State of incorporation
          </h2>
          <p className="text-slate-500 text-sm mb-5">
            Where to form the legal entity — not necessarily where you operate.
          </p>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5">
            <p className="text-sm font-semibold text-emerald-800 mb-0.5">Recommendation</p>
            <p className="text-sm text-emerald-700">
              For a <strong>{entityLabel}</strong>:{" "}
              {entityType === "c_corp" ? (
                <><strong>Delaware</strong> — the default for VC-backed startups.</>
              ) : (
                <><strong>Wyoming</strong> — low fees, strong LLC protection.</>
              )}
            </p>
          </div>

          <div className="space-y-2 mb-2">
            {POPULAR_STATES.map((s) => (
              <button
                key={s.value}
                onClick={() => setState(s.value)}
                className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all flex items-center justify-between ${
                  state === s.value
                    ? "border-[#1B2B4B] bg-[#1B2B4B]/5"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div>
                  <span className="font-semibold text-[#1B2B4B]">{s.label}</span>
                  {s.note && <span className="text-slate-400 text-sm ml-2">— {s.note}</span>}
                </div>
                {state === s.value && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              </button>
            ))}
          </div>

          <details className="mb-6">
            <summary className="text-sm text-slate-500 cursor-pointer hover:text-slate-700 py-2 select-none">
              Other states
            </summary>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {OTHER_STATES.map((abbr) => (
                <button
                  key={abbr}
                  onClick={() => setState(abbr)}
                  className={`py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    state === abbr
                      ? "border-[#1B2B4B] bg-[#1B2B4B]/5 text-[#1B2B4B]"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {abbr}
                </button>
              ))}
            </div>
          </details>

          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-200" onClick={() => setStep("entity")}>
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              className="flex-1 bg-[#1B2B4B] hover:bg-[#243461] text-white"
              disabled={!canProceedState}
              onClick={() => setStep("confirm")}
            >
              Review <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step: Confirm */}
      {step === "confirm" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Review and confirm
          </h2>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 mb-6 space-y-3">
            <Row label="Company name"    value={name.trim()} />
            <Row label="Entity type"     value={entityLabel} />
            <Row label="Incorporation"   value={stateLabel} />
            <Row label="Compliance plan" value="Launch (Free)" />
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-emerald-800 mb-1">What happens next</p>
            <ul className="space-y-1 text-sm text-emerald-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                Your company is added to the dashboard
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                Default compliance filings are seeded automatically
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                Deadline tracking starts immediately
              </li>
            </ul>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>
          )}

          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-200" onClick={() => setStep("state")}>
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              className="flex-1 bg-[#1B2B4B] hover:bg-[#243461] text-white"
              disabled={saving}
              onClick={handleCreate}
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</>
              ) : (
                <><CheckCircle2 className="w-4 h-4 mr-2" />Create company</>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  )
}
