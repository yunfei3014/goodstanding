"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase"
import type { Company } from "@/lib/supabase"
import { generateDefaultFilings } from "@/lib/filings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  X,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Building2,
  MapPin,
  CreditCard,
} from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = [
  { id: 1, label: "Company", icon: Building2 },
  { id: 2, label: "State",   icon: MapPin },
  { id: 3, label: "Plan",    icon: CreditCard },
]

const ENTITY_TYPES = [
  { id: "c_corp", label: "C-Corporation", note: "Standard for VC-backed startups" },
  { id: "llc",    label: "LLC",           note: "Flexible, pass-through taxation" },
  { id: "s_corp", label: "S-Corporation", note: "Tax advantages for profitable SMBs" },
]

const POPULAR_STATES = [
  { value: "DE", label: "Delaware",   note: "Standard for venture-backed startups" },
  { value: "WY", label: "Wyoming",    note: "Low fees, no state income tax" },
  { value: "CA", label: "California", note: "If your team is based here" },
  { value: "TX", label: "Texas",      note: "No state income tax" },
  { value: "FL", label: "Florida",    note: "No state income tax" },
  { value: "NY", label: "New York",   note: "" },
  { value: "WA", label: "Washington", note: "" },
  { value: "CO", label: "Colorado",   note: "" },
]

const ALL_STATES = [
  ["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],
  ["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["FL","Florida"],["GA","Georgia"],
  ["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],["IN","Indiana"],["IA","Iowa"],
  ["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],["ME","Maine"],["MD","Maryland"],
  ["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],["MS","Mississippi"],["MO","Missouri"],
  ["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],["NH","New Hampshire"],["NJ","New Jersey"],
  ["NM","New Mexico"],["NY","New York"],["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],
  ["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],
  ["SD","South Dakota"],["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],
  ["VA","Virginia"],["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"],
]

const PLANS = [
  {
    id: "launch",
    name: "Launch",
    price: "Free",
    desc: "Formation guidance and compliance calendar.",
    features: ["Entity tracking", "Compliance calendar", "Document vault"],
  },
  {
    id: "essentials",
    name: "Essentials",
    price: "$99/mo",
    desc: "Ongoing compliance, handled.",
    features: ["Registered agent (1 state)", "Annual report filing", "Compliance monitoring"],
  },
  {
    id: "growth",
    name: "Growth",
    price: "$249/mo",
    desc: "For startups raising or expanding.",
    features: ["Multi-state agent (3 states)", "2 gov't liaison calls/mo", "Fundraise check"],
    popular: true,
  },
  {
    id: "scale",
    name: "Scale",
    price: "$499/mo",
    desc: "Complex or multi-entity operations.",
    features: ["Unlimited liaison calls", "Dedicated compliance lead", "Unlimited states"],
  },
]

type FormState = {
  name: string
  entityType: "llc" | "c_corp" | "s_corp"
  state: string
  plan: "launch" | "essentials" | "growth" | "scale"
}

export function AddCompanyModal({
  onClose,
  onAdded,
}: {
  onClose: () => void
  onAdded: (company: Company) => void
}) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showAllStates, setShowAllStates] = useState(false)
  const [form, setForm] = useState<FormState>({
    name: "",
    entityType: "c_corp",
    state: "DE",
    plan: "launch",
  })

  const update = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }))

  const canNext = () => {
    if (step === 1) return form.name.trim().length >= 2
    if (step === 2) return !!form.state
    if (step === 3) return !!form.plan
    return false
  }

  async function handleSubmit() {
    setLoading(true)
    setError("")
    const supabase = createClient()

    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) {
      setError("Not authenticated.")
      setLoading(false)
      return
    }

    const { data: company, error: insertError } = await supabase
      .from("companies")
      .insert({
        user_id: authData.user.id,
        name: form.name.trim(),
        entity_type: form.entityType,
        state_of_incorporation: form.state,
        plan: form.plan,
        status: "good_standing",
      })
      .select()
      .single()

    if (insertError || !company) {
      setError(insertError?.message ?? "Failed to create company.")
      setLoading(false)
      return
    }

    // Seed default compliance filings
    const defaultFilings = generateDefaultFilings(company)
    if (defaultFilings.length > 0) {
      await supabase.from("filings").insert(defaultFilings)
    }

    setLoading(false)
    onAdded(company as Company)
  }

  const entityLabel = ENTITY_TYPES.find((e) => e.id === form.entityType)?.label ?? ""
  const stateLabel  = ALL_STATES.find(([v]) => v === form.state)?.[1] ?? form.state
  const planInfo    = PLANS.find((p) => p.id === form.plan)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#1B2B4B]">Add a company</h2>
            <p className="text-slate-400 text-sm mt-0.5">Step {step} of {STEPS.length}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-2 px-6 pt-5 pb-1">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={cn(
                "h-1.5 rounded-full flex-1 transition-all",
                step >= s.id ? "bg-[#1B2B4B]" : "bg-slate-100"
              )}
            />
          ))}
        </div>

        {/* Body */}
        <div className="px-6 py-5 min-h-[340px]">

          {/* Step 1 — Company */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-slate-900 mb-1">What's the company name?</h3>
                <p className="text-slate-400 text-sm mb-4">You can edit this anytime from Settings.</p>
                <Label htmlFor="co-name">Company name</Label>
                <Input
                  id="co-name"
                  className="mt-1.5"
                  placeholder="Acme AI, Inc."
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canNext() && setStep(2)}
                  autoFocus
                />
              </div>

              <div>
                <Label className="mb-2.5 block">Entity type</Label>
                <div className="space-y-2">
                  {ENTITY_TYPES.map((et) => (
                    <button
                      key={et.id}
                      onClick={() => update("entityType", et.id as FormState["entityType"])}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-between",
                        form.entityType === et.id
                          ? "border-[#1B2B4B] bg-[#1B2B4B]/5"
                          : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <div>
                        <span className="font-semibold text-[#1B2B4B] text-sm">{et.label}</span>
                        <span className="text-slate-400 text-xs ml-2">— {et.note}</span>
                      </div>
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                        form.entityType === et.id ? "border-[#1B2B4B] bg-[#1B2B4B]" : "border-slate-300"
                      )}>
                        {form.entityType === et.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — State */}
          {step === 2 && (
            <div>
              <h3 className="font-bold text-slate-900 mb-1">State of incorporation</h3>
              <p className="text-slate-400 text-sm mb-4">
                The state where the legal entity is formed — not where your office is.
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {POPULAR_STATES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => update("state", s.value)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-between",
                      form.state === s.value
                        ? "border-[#1B2B4B] bg-[#1B2B4B]/5"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <div>
                      <span className="font-semibold text-[#1B2B4B] text-sm">{s.label}</span>
                      {s.note && <span className="text-slate-400 text-xs ml-2">— {s.note}</span>}
                    </div>
                    {form.state === s.value && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                  </button>
                ))}

                <button
                  onClick={() => setShowAllStates((v) => !v)}
                  className="w-full text-center text-sm text-slate-400 hover:text-slate-600 py-2 transition-colors"
                >
                  {showAllStates ? "Show fewer" : "Show all 50 states"}
                </button>

                {showAllStates && ALL_STATES
                  .filter(([v]) => !POPULAR_STATES.some((s) => s.value === v))
                  .map(([abbr, label]) => (
                    <button
                      key={abbr}
                      onClick={() => update("state", abbr)}
                      className={cn(
                        "w-full text-left px-4 py-2.5 rounded-xl border-2 transition-all flex items-center justify-between",
                        form.state === abbr
                          ? "border-[#1B2B4B] bg-[#1B2B4B]/5"
                          : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <span className="font-medium text-[#1B2B4B] text-sm">{label}</span>
                      {form.state === abbr && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                    </button>
                  ))
                }
              </div>
            </div>
          )}

          {/* Step 3 — Plan */}
          {step === 3 && (
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Choose a plan for this entity</h3>
              <p className="text-slate-400 text-sm mb-4">You can upgrade anytime.</p>
              <div className="space-y-2">
                {PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => update("plan", plan.id as FormState["plan"])}
                    className={cn(
                      "w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all relative",
                      form.plan === plan.id
                        ? "border-[#1B2B4B] bg-[#1B2B4B]/5"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2.5 left-4 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                        Popular
                      </span>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-[#1B2B4B] text-sm">{plan.name}</span>
                          <span className="font-bold text-emerald-600 text-sm">{plan.price}</span>
                        </div>
                        <p className="text-slate-500 text-xs">{plan.desc}</p>
                      </div>
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2 flex-shrink-0 ml-3 flex items-center justify-center",
                        form.plan === plan.id ? "border-[#1B2B4B] bg-[#1B2B4B]" : "border-slate-300"
                      )}>
                        {form.plan === plan.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
        </div>

        {/* Summary strip (step 2+) */}
        {step > 1 && (
          <div className="mx-6 mb-4 px-4 py-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-4 text-xs text-slate-500">
            <span className="font-semibold text-slate-700 truncate">{form.name || "—"}</span>
            <span>{entityLabel}</span>
            {step >= 2 && <span>{stateLabel}</span>}
            {step >= 3 && planInfo && <span>{planInfo.name}</span>}
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              className="border-slate-200"
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
          <Button
            className="flex-1 bg-[#1B2B4B] hover:bg-[#243461] text-white"
            disabled={!canNext() || loading}
            onClick={() => {
              if (step < 3) setStep((s) => s + 1)
              else handleSubmit()
            }}
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating…</>
            ) : step === 3 ? (
              <><CheckCircle2 className="w-4 h-4 mr-2" />Create company</>
            ) : (
              <>Continue <ArrowRight className="w-4 h-4 ml-2" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
