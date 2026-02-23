"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Building2,
  MapPin,
  User,
  CreditCard,
  Mail,
  Lock,
} from "lucide-react"

const STEPS = [
  { id: 1, label: "Company", icon: Building2 },
  { id: 2, label: "State", icon: MapPin },
  { id: 3, label: "Founders", icon: User },
  { id: 4, label: "Plan", icon: CreditCard },
  { id: 5, label: "Account", icon: Mail },
]

const ENTITY_TYPES = [
  {
    id: "c_corp",
    name: "C-Corporation",
    recommended: true,
    desc: "Delaware C-Corp is the standard for VC-backed startups. Required for institutional investors.",
    best_for: "Planning to raise venture capital",
  },
  {
    id: "llc",
    name: "LLC",
    recommended: false,
    desc: "Flexible, pass-through taxation. Great for solo founders or lifestyle businesses.",
    best_for: "Bootstrapped or cash-flow business",
  },
  {
    id: "s_corp",
    name: "S-Corporation",
    recommended: false,
    desc: "Tax advantages for profitable small businesses. Restrictions on shareholders.",
    best_for: "Profitable business, limiting self-employment tax",
  },
]

const STATES = [
  { value: "DE", label: "Delaware", popular: true, note: "Standard for VC-backed startups" },
  { value: "WY", label: "Wyoming", popular: true, note: "Low fees, no state income tax" },
  { value: "CA", label: "California", popular: true, note: "If your team is based here" },
  { value: "TX", label: "Texas", popular: true, note: "No state income tax" },
  { value: "FL", label: "Florida", popular: false, note: "No state income tax" },
  { value: "NY", label: "New York", popular: false, note: "" },
  { value: "WA", label: "Washington", popular: false, note: "" },
  { value: "CO", label: "Colorado", popular: false, note: "" },
  { value: "GA", label: "Georgia", popular: false, note: "" },
  { value: "NV", label: "Nevada", popular: false, note: "" },
]

const PLANS = [
  {
    id: "launch",
    name: "Launch",
    price: "Free",
    desc: "Form your company. Compliance guidance included.",
    includes: ["Entity formation", "EIN application", "Operating agreement", "30-day guidance"],
    highlight: false,
  },
  {
    id: "essentials",
    name: "Essentials",
    price: "$99/mo",
    desc: "Ongoing compliance, handled.",
    includes: ["Registered agent (1 state)", "Compliance monitoring", "Annual report filing", "Document vault"],
    highlight: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: "$249/mo",
    desc: "For startups raising or expanding.",
    includes: ["Everything in Essentials", "2 gov't liaison calls/mo", "Multi-state agent (3 states)", "Fundraise check"],
    highlight: true,
    badge: "Most popular",
  },
  {
    id: "scale",
    name: "Scale",
    price: "$499/mo",
    desc: "Complex or scaling startups.",
    includes: ["Unlimited gov't liaison calls", "Dedicated compliance lead", "Multi-state expansion", "Quarterly review"],
    highlight: false,
  },
]

type FormData = {
  companyName: string
  entityType: string
  state: string
  founderName: string
  founderEmail: string
  coFounders: string
  plan: string
  email: string
  password: string
}

function SignupContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialPlan = searchParams.get("plan") || "launch"

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    entityType: "c_corp",
    state: "DE",
    founderName: "",
    founderEmail: "",
    coFounders: "",
    plan: initialPlan,
    email: "",
    password: "",
  })

  const update = (field: keyof FormData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  const canProceed = () => {
    if (step === 1) return formData.companyName.length >= 2
    if (step === 2) return !!formData.state
    if (step === 3) return formData.founderName.length >= 2 && formData.founderEmail.includes("@")
    if (step === 4) return !!formData.plan
    if (step === 5) return formData.email.includes("@") && formData.password.length >= 8
    return true
  }

  const handleNext = () => {
    if (step < 5) setStep(step + 1)
    else handleSubmit()
  }

  const handleSubmit = async () => {
    setLoading(true)
    // Simulate account creation — Supabase auth will go here
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#1B2B4B] rounded-lg flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="font-bold text-[#1B2B4B] text-base">
            GoodStanding<span className="text-emerald-500">.ai</span>
          </span>
        </Link>
        <Link href="/login" className="text-sm text-slate-500 hover:text-slate-700">
          Already have an account? <span className="font-semibold text-[#1B2B4B]">Sign in</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        {/* Progress */}
        <div className="w-full max-w-xl mb-10">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      step > s.id
                        ? "bg-emerald-500 text-white"
                        : step === s.id
                        ? "bg-[#1B2B4B] text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {step > s.id ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <s.icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium ${step >= s.id ? "text-[#1B2B4B]" : "text-slate-400"}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-4 ${step > s.id ? "bg-emerald-500" : "bg-slate-100"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="w-full max-w-xl">
          {/* Step 1 — Company */}
          {step === 1 && (
            <div>
              <h1 className="text-3xl font-bold text-[#1B2B4B] mb-2">
                Let&apos;s start with your company.
              </h1>
              <p className="text-slate-500 mb-8">
                What are you building, and how do you want to structure it?
              </p>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="companyName">Company name</Label>
                  <Input
                    id="companyName"
                    className="mt-1.5"
                    placeholder="Acme AI, Inc."
                    value={formData.companyName}
                    onChange={(e) => update("companyName", e.target.value)}
                  />
                  <p className="text-xs text-slate-400 mt-1.5">
                    You can always change this before we file.
                  </p>
                </div>

                <div>
                  <Label className="mb-3 block">Entity type</Label>
                  <div className="space-y-3">
                    {ENTITY_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => update("entityType", type.id)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          formData.entityType === type.id
                            ? "border-[#1B2B4B] bg-[#1B2B4B]/5"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-[#1B2B4B]">{type.name}</span>
                              {type.recommended && (
                                <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                                  Recommended for most startups
                                </span>
                              )}
                            </div>
                            <p className="text-slate-500 text-sm">{type.desc}</p>
                            <p className="text-xs text-slate-400 mt-1">Best for: {type.best_for}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 ml-3 flex items-center justify-center ${
                            formData.entityType === type.id ? "border-[#1B2B4B] bg-[#1B2B4B]" : "border-slate-300"
                          }`}>
                            {formData.entityType === type.id && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — State */}
          {step === 2 && (
            <div>
              <h1 className="text-3xl font-bold text-[#1B2B4B] mb-2">
                Where should we incorporate?
              </h1>
              <p className="text-slate-500 mb-8">
                Not the state your office is in — the state where you want to form your legal entity.
                Delaware is the standard for venture-backed startups.
              </p>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
                <p className="text-sm font-semibold text-emerald-800 mb-1">Our recommendation</p>
                <p className="text-sm text-emerald-700">
                  For a {formData.entityType === "c_corp" ? "C-Corp" : formData.entityType === "llc" ? "LLC" : "S-Corp"}{" "}
                  planning to {formData.entityType === "c_corp" ? "raise venture capital" : "stay bootstrapped"}:{" "}
                  <strong>{formData.entityType === "c_corp" ? "Delaware" : "Wyoming"}</strong>.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Popular for startups</p>
                {STATES.filter((s) => s.popular).map((state) => (
                  <button
                    key={state.value}
                    onClick={() => update("state", state.value)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all flex items-center justify-between ${
                      formData.state === state.value
                        ? "border-[#1B2B4B] bg-[#1B2B4B]/5"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-[#1B2B4B]">{state.label}</span>
                      {state.note && (
                        <span className="text-slate-400 text-sm ml-2">— {state.note}</span>
                      )}
                    </div>
                    {formData.state === state.value && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    )}
                  </button>
                ))}

                <details className="mt-2">
                  <summary className="text-sm text-slate-500 cursor-pointer hover:text-slate-700 py-2">
                    More states
                  </summary>
                  <div className="space-y-2 mt-2">
                    {STATES.filter((s) => !s.popular).map((state) => (
                      <button
                        key={state.value}
                        onClick={() => update("state", state.value)}
                        className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-between ${
                          formData.state === state.value
                            ? "border-[#1B2B4B] bg-[#1B2B4B]/5"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <span className="font-semibold text-[#1B2B4B]">{state.label}</span>
                        {formData.state === state.value && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          )}

          {/* Step 3 — Founders */}
          {step === 3 && (
            <div>
              <h1 className="text-3xl font-bold text-[#1B2B4B] mb-2">
                Tell us about the founding team.
              </h1>
              <p className="text-slate-500 mb-8">
                We&apos;ll use this to draft your operating agreement or bylaws and set up your entity correctly.
              </p>

              <div className="space-y-5">
                <div>
                  <Label htmlFor="founderName">Your full name</Label>
                  <Input
                    id="founderName"
                    className="mt-1.5"
                    placeholder="Jane Doe"
                    value={formData.founderName}
                    onChange={(e) => update("founderName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="founderEmail">Your email</Label>
                  <Input
                    id="founderEmail"
                    type="email"
                    className="mt-1.5"
                    placeholder="jane@yourcompany.com"
                    value={formData.founderEmail}
                    onChange={(e) => update("founderEmail", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="coFounders">Co-founders (optional)</Label>
                  <Input
                    id="coFounders"
                    className="mt-1.5"
                    placeholder="John Smith (CTO), Sarah Lee (CPO)"
                    value={formData.coFounders}
                    onChange={(e) => update("coFounders", e.target.value)}
                  />
                  <p className="text-xs text-slate-400 mt-1.5">
                    Names and roles. We&apos;ll set up the equity split in the next step.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-sm font-semibold text-slate-700 mb-1">Forming in {STATES.find(s => s.value === formData.state)?.label || formData.state}</p>
                  <p className="text-sm text-slate-500">
                    {formData.entityType === "c_corp"
                      ? "We'll file Articles of Incorporation, get your EIN, and draft your bylaws and initial resolutions."
                      : "We'll file Articles of Organization, get your EIN, and draft your Operating Agreement."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4 — Plan */}
          {step === 4 && (
            <div>
              <h1 className="text-3xl font-bold text-[#1B2B4B] mb-2">
                Choose your plan.
              </h1>
              <p className="text-slate-500 mb-8">
                Start free. Upgrade anytime. No credit card required for Launch.
              </p>

              <div className="space-y-3">
                {PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => update("plan", plan.id)}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all relative ${
                      formData.plan === plan.id
                        ? "border-[#1B2B4B] bg-[#1B2B4B]/5"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {plan.badge && (
                      <span className="absolute -top-2.5 left-4 bg-emerald-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                        {plan.badge}
                      </span>
                    )}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-[#1B2B4B]">{plan.name}</span>
                          <span className="font-bold text-emerald-600">{plan.price}</span>
                        </div>
                        <p className="text-slate-500 text-sm mb-2">{plan.desc}</p>
                        <div className="flex flex-wrap gap-1">
                          {plan.includes.map((inc, i) => (
                            <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                              {inc}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 ml-4 flex items-center justify-center ${
                        formData.plan === plan.id ? "border-[#1B2B4B] bg-[#1B2B4B]" : "border-slate-300"
                      }`}>
                        {formData.plan === plan.id && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5 — Account */}
          {step === 5 && (
            <div>
              <h1 className="text-3xl font-bold text-[#1B2B4B] mb-2">
                Create your account.
              </h1>
              <p className="text-slate-500 mb-8">
                Almost there. We&apos;ll create your dashboard and get started on{" "}
                <strong>{formData.companyName}</strong>.
              </p>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
                <h3 className="text-sm font-semibold text-emerald-800 mb-2">Your order summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Company</span>
                    <span className="font-semibold text-emerald-900">{formData.companyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Entity type</span>
                    <span className="font-semibold text-emerald-900">
                      {ENTITY_TYPES.find(e => e.id === formData.entityType)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-700">State</span>
                    <span className="font-semibold text-emerald-900">
                      {STATES.find(s => s.value === formData.state)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-emerald-200 pt-1 mt-1">
                    <span className="text-emerald-700">Plan</span>
                    <span className="font-semibold text-emerald-900">
                      {PLANS.find(p => p.id === formData.plan)?.name} — {PLANS.find(p => p.id === formData.plan)?.price}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className="mt-1.5"
                    placeholder="you@yourcompany.com"
                    value={formData.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    className="mt-1.5"
                    placeholder="Minimum 8 characters"
                    value={formData.password}
                    onChange={(e) => update("password", e.target.value)}
                  />
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-4">
                By creating an account you agree to our{" "}
                <Link href="/terms" className="underline">Terms of Service</Link> and{" "}
                <Link href="/privacy" className="underline">Privacy Policy</Link>.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="border-slate-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            <Button
              className={`flex-1 bg-[#1B2B4B] hover:bg-[#243461] text-white ${!canProceed() ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleNext}
              disabled={!canProceed() || loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating your account...
                </span>
              ) : step === 5 ? (
                <span className="flex items-center gap-2">
                  Create account <CheckCircle2 className="w-4 h-4" />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Continue <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <SignupContent />
    </Suspense>
  )
}
