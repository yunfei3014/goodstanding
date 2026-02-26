"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase"
import type { Company } from "@/lib/supabase"
import {
  CreditCard,
  Check,
  Zap,
  Building2,
  FileCheck,
  FolderOpen,
  Phone,
  Sparkles,
  Shield,
  Users,
  Star,
  ArrowRight,
  AlertCircle,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const PLANS = [
  {
    id: "launch",
    name: "Launch",
    price: 0,
    period: "/mo",
    tagline: "Everything to start your company",
    features: [
      "1 company",
      "Entity formation (+ state fees)",
      "EIN application",
      "Operating agreement",
      "30-day compliance guidance",
    ],
    limits: { companies: 1, filings: 10, documents: 5 },
    cta: "Current plan",
    ctaUpgrade: false,
    icon: Zap,
    accentColor: "text-slate-600",
    borderColor: "border-slate-200",
    bgColor: "bg-white",
  },
  {
    id: "essentials",
    name: "Essentials",
    price: 99,
    period: "/mo",
    tagline: "Formation → ongoing compliance",
    features: [
      "Registered agent (1 state)",
      "Compliance monitoring",
      "Annual report filing",
      "Document vault",
      "Email support",
    ],
    limits: { companies: 3, filings: Infinity, documents: 50 },
    cta: "Upgrade to Essentials",
    ctaUpgrade: true,
    icon: Star,
    accentColor: "text-emerald-600",
    borderColor: "border-emerald-400",
    bgColor: "bg-white",
    badge: "Most Popular",
  },
  {
    id: "growth",
    name: "Growth",
    price: 249,
    period: "/mo",
    tagline: "For startups raising or expanding",
    features: [
      "Registered agent (up to 3 states)",
      "2 government liaison calls/month",
      "Proactive compliance alerts",
      "Fundraise-readiness check",
      "Priority support",
    ],
    limits: { companies: 10, filings: Infinity, documents: Infinity },
    cta: "Upgrade to Growth",
    ctaUpgrade: true,
    icon: Users,
    accentColor: "text-blue-600",
    borderColor: "border-blue-200",
    bgColor: "bg-white",
  },
  {
    id: "scale",
    name: "Scale",
    price: 499,
    period: "/mo",
    tagline: "Complex or scaling startups",
    features: [
      "Unlimited government liaison calls",
      "Dedicated compliance lead",
      "Multi-state expansion support",
      "Quarterly compliance review",
      "Tax prep discount",
    ],
    limits: { companies: Infinity, filings: Infinity, documents: Infinity },
    cta: "Upgrade to Scale",
    ctaUpgrade: true,
    icon: Shield,
    accentColor: "text-purple-600",
    borderColor: "border-purple-200",
    bgColor: "bg-white",
  },
]

function UsageMeter({
  label,
  icon: Icon,
  used,
  limit,
  color,
}: {
  label: string
  icon: React.ElementType
  used: number
  limit: number
  color: string
}) {
  const isUnlimited = limit === Infinity
  const pct = isUnlimited ? 0 : Math.min(100, Math.round((used / limit) * 100))
  const nearLimit = !isUnlimited && pct >= 80
  const atLimit = !isUnlimited && used >= limit

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-slate-700">{label}</span>
        </div>
        {atLimit && (
          <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
            Limit reached
          </span>
        )}
        {nearLimit && !atLimit && (
          <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            Near limit
          </span>
        )}
      </div>
      <div className="flex items-end justify-between mb-2">
        <p className="text-2xl font-bold text-slate-900">{used}</p>
        <p className="text-sm text-slate-400 mb-0.5">
          {isUnlimited ? "unlimited" : `of ${limit}`}
        </p>
      </div>
      {!isUnlimited && (
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              atLimit ? "bg-red-500" : nearLimit ? "bg-amber-400" : "bg-emerald-400"
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
      {isUnlimited && (
        <div className="w-full h-1.5 bg-emerald-100 rounded-full overflow-hidden">
          <div className="h-full w-full bg-emerald-400 rounded-full" />
        </div>
      )}
    </div>
  )
}

export default function BillingPage() {
  const searchParams = useSearchParams()
  const stripeSuccess = searchParams.get("success") === "1"
  const stripeCanceled = searchParams.get("canceled") === "1"

  const [companies, setCompanies] = useState<Company[]>([])
  const [filingCount, setFilingCount] = useState(0)
  const [docCount, setDocCount] = useState(0)
  const [interactionCount, setInteractionCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const [
        { data: companiesData },
        { data: filingsData },
        { data: docsData },
        { data: interactionsData },
      ] = await Promise.all([
        supabase.from("companies").select("*"),
        supabase.from("filings").select("id"),
        supabase.from("documents").select("id"),
        supabase.from("government_interactions").select("id"),
      ])
      setCompanies(companiesData ?? [])
      setFilingCount((filingsData ?? []).length)
      setDocCount((docsData ?? []).length)
      setInteractionCount((interactionsData ?? []).length)
      setLoading(false)
    }
    load()
  }, [])

  async function handleUpgrade(planId: string) {
    setCheckoutLoading(planId)
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: planId }),
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      setCheckoutLoading(null)
    }
  }

  async function handleManageBilling() {
    setPortalLoading(true)
    const res = await fetch("/api/billing/portal", { method: "POST" })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      setPortalLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Determine current plan from the first company
  const rawPlan = companies[0]?.plan ?? "launch"
  const currentPlanId = ["launch", "essentials", "growth", "scale"].includes(rawPlan)
    ? rawPlan
    : "launch"
  const currentPlan = PLANS.find((p) => p.id === currentPlanId) ?? PLANS[0]
  const currentLimits = currentPlan.limits

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Billing & Plan</h1>
        <p className="text-slate-500">Manage your subscription and view usage.</p>
      </div>

      {/* Stripe redirect banners */}
      {stripeSuccess && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-6">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <p className="text-sm font-medium text-emerald-800">
            Subscription activated! Your plan has been upgraded.
          </p>
        </div>
      )}
      {stripeCanceled && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <p className="text-sm font-medium text-amber-800">
            Checkout was canceled — no charge was made.
          </p>
        </div>
      )}

      {/* Current plan banner */}
      <div className="bg-[#0F1829] rounded-2xl p-6 mb-8 flex items-center justify-between gap-6 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-lg font-bold text-white">{currentPlan.name} Plan</h2>
              <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              {currentPlan.price === 0
                ? "Free plan — upgrade anytime to unlock more"
                : `$${currentPlan.price}/mo — billed monthly`}
            </p>
          </div>
        </div>
        {currentPlan.price === 0 ? (
          <button
            onClick={() => handleUpgrade("professional")}
            disabled={!!checkoutLoading}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors disabled:opacity-70"
          >
            {checkoutLoading === "professional" ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Upgrade plan <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        ) : (
          <button
            onClick={handleManageBilling}
            disabled={portalLoading}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors disabled:opacity-70"
          >
            {portalLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><CreditCard className="w-4 h-4" />Manage billing</>
            )}
          </button>
        )}
      </div>

      {/* Usage */}
      <div className="mb-8">
        <h2 className="text-base font-bold text-slate-900 mb-4">Current usage</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <UsageMeter
            label="Companies"
            icon={Building2}
            used={companies.length}
            limit={currentLimits.companies}
            color="bg-blue-50 text-blue-600"
          />
          <UsageMeter
            label="Filings"
            icon={FileCheck}
            used={filingCount}
            limit={currentLimits.filings}
            color="bg-amber-50 text-amber-600"
          />
          <UsageMeter
            label="Documents"
            icon={FolderOpen}
            used={docCount}
            limit={currentLimits.documents}
            color="bg-purple-50 text-purple-600"
          />
          <UsageMeter
            label="Gov't Interactions"
            icon={Phone}
            used={interactionCount}
            limit={Infinity}
            color="bg-emerald-50 text-emerald-600"
          />
        </div>
        {(companies.length >= currentLimits.companies ||
          (currentLimits.filings !== Infinity && filingCount >= currentLimits.filings) ||
          (currentLimits.documents !== Infinity && docCount >= currentLimits.documents)) && (
          <div className="mt-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              You&apos;ve reached one or more plan limits. Upgrade to continue adding data without restrictions.
            </p>
          </div>
        )}
      </div>

      {/* Plan comparison */}
      <div className="mb-8">
        <h2 className="text-base font-bold text-slate-900 mb-4">Choose a plan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((plan) => {
            const isCurrent = plan.id === currentPlanId
            const PlanIcon = plan.icon
            return (
              <div
                key={plan.id}
                className={cn(
                  "relative rounded-2xl border-2 p-5 flex flex-col transition-all",
                  isCurrent
                    ? "border-[#1B2B4B] bg-[#1B2B4B]/[0.03]"
                    : plan.borderColor + " bg-white hover:shadow-md"
                )}
              >
                {plan.badge && !isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1B2B4B] text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    Current plan
                  </div>
                )}

                <div className="mb-4">
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center mb-3",
                    isCurrent ? "bg-[#1B2B4B]/10" : "bg-slate-100"
                  )}>
                    <PlanIcon className={cn("w-4 h-4", isCurrent ? "text-[#1B2B4B]" : plan.accentColor)} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-0.5">{plan.name}</h3>
                  <p className="text-xs text-slate-400">{plan.tagline}</p>
                </div>

                <div className="mb-5">
                  {plan.price === null ? (
                    <p className="text-2xl font-bold text-slate-900">Custom</p>
                  ) : (
                    <div className="flex items-end gap-1">
                      <p className="text-2xl font-bold text-slate-900">${plan.price}</p>
                      <p className="text-sm text-slate-400 mb-0.5">/mo</p>
                    </div>
                  )}
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className={cn(
                        "w-3.5 h-3.5 flex-shrink-0 mt-0.5",
                        isCurrent ? "text-[#1B2B4B]" : "text-emerald-500"
                      )} />
                      <span className="text-xs text-slate-600">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  disabled={isCurrent || !!checkoutLoading}
                  onClick={() => !isCurrent && plan.ctaUpgrade && plan.id !== "enterprise" && handleUpgrade(plan.id)}
                  className={cn(
                    "w-full py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5",
                    isCurrent
                      ? "bg-[#1B2B4B]/10 text-[#1B2B4B] cursor-default"
                      : plan.id === "professional"
                      ? "bg-emerald-500 hover:bg-emerald-400 text-white"
                      : plan.id === "enterprise"
                      ? "bg-purple-100 hover:bg-purple-200 text-purple-700"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700",
                    checkoutLoading === plan.id && "opacity-70"
                  )}
                >
                  {checkoutLoading === plan.id ? (
                    <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  ) : (
                    <>{plan.cta}{!isCurrent && <ChevronRight className="w-3.5 h-3.5" />}</>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Payment method + Invoices */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Payment method */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-slate-500" />
            Payment method
          </h3>
          {currentPlan.price === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-slate-400 mb-3">No payment method on file.</p>
              <p className="text-xs text-slate-400">
                Upgrade to a paid plan to add a payment method.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-10 h-7 bg-[#1B2B4B] rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">VISA</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">•••• •••• •••• 4242</p>
                <p className="text-xs text-slate-400">Expires 12/27</p>
              </div>
              <button className="ml-auto text-xs text-emerald-600 font-semibold hover:underline">
                Update
              </button>
            </div>
          )}
        </div>

        {/* Invoice history */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-slate-500" />
            Invoice history
          </h3>
          <div className="text-center py-6">
            <p className="text-sm text-slate-400 mb-1">No invoices yet.</p>
            <p className="text-xs text-slate-400">
              Invoices will appear here once you upgrade to a paid plan.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
