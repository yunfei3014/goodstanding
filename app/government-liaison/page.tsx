import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/marketing/Navbar"
import Footer from "@/components/marketing/Footer"
import { Button } from "@/components/ui/button"
import {
  Phone,
  CheckCircle2,
  ArrowRight,
  Shield,
  FileText,
  Clock,
  Award,
  AlertCircle,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Government Liaison — GoodStanding.ai",
  description: "Enrolled agents who call the IRS and state agencies on your behalf. IRS notice resolution, state compliance calls, audit representation, and more.",
  openGraph: {
    title: "Government Liaison — GoodStanding.ai",
    description: "Enrolled agents who call the IRS and state agencies on your behalf.",
    url: "https://goodstanding.ai/government-liaison",
  },
  twitter: { card: "summary_large_image" },
}

const capabilities = [
  {
    title: "IRS notice resolution",
    items: [
      "CP2000 — income underreporting proposals",
      "CP503 / CP504 — balance due notices",
      "LT11 / LT1058 — intent to levy",
      "4464C — refund holds",
      "Audit notices and IDR responses",
    ],
  },
  {
    title: "IRS account actions",
    items: [
      "Transcript requests (wage, account, return)",
      "Payment verification and tracing",
      "Penalty abatement requests",
      "Installment agreement setup",
      "IRS hold resolution",
    ],
  },
  {
    title: "State agency representation",
    items: [
      "Secretary of State filings and disputes",
      "State franchise tax boards",
      "Department of Revenue communications",
      "Reinstatement after administrative dissolution",
      "Good standing certificate expediting",
    ],
  },
]

const process = [
  {
    step: "1",
    title: "Upload the notice",
    description:
      "Drop the government notice into your dashboard. Our AI reads it instantly and identifies what it is, what the deadline is, and what the risk is if ignored.",
  },
  {
    step: "2",
    title: "AI prep (same day)",
    description:
      "AI generates Form 2848 (Power of Attorney), researches the specific issue, drafts talking points, and prepares the call script for your Enrolled Agent.",
  },
  {
    step: "3",
    title: "We make the call",
    description:
      "Your Enrolled Agent calls the IRS Practitioner Priority Service line (dedicated EA line — much shorter hold times than public lines) with AI-assisted real-time guidance.",
  },
  {
    step: "4",
    title: "Resolution in your dashboard",
    description:
      "Call summary, resolution status, next steps, and all filed documentation appear in your dashboard. You get notified by email. Usually resolved in 1–5 days.",
  },
]

const caseStudies = [
  {
    agency: "IRS",
    type: "CP2000 Notice",
    situation:
      "Delaware C-Corp received a CP2000 proposing $1,240 in additional taxes for the prior year. Founders didn't recognize the issue.",
    action:
      "AI analyzed the notice in minutes, identified a mismatched 1099 from a dissolved subsidiary. EA called IRS, provided documentation proving no tax was owed.",
    result: "Issue resolved in 2 days. $0 owed. No penalties.",
    company: "Prism AI, Inc.",
    plan: "Growth",
  },
  {
    agency: "Delaware Division of Corporations",
    type: "Administrative Dissolution",
    situation:
      "Series A startup discovered their Delaware entity had been administratively dissolved due to a missed annual report — during investor due diligence.",
    action:
      "Paid the back-due annual report and penalty. Filed for reinstatement same day. Followed up with Delaware Secretary of State to expedite processing.",
    result: "Entity reinstated in 3 business days. Deal closed on time.",
    company: "Nexus Ventures, Inc.",
    plan: "Scale",
  },
  {
    agency: "California Franchise Tax Board",
    type: "FTB Notice",
    situation:
      "Wyoming LLC with California employees received a $1,600 assessment from the FTB for failure to register as a foreign entity.",
    action:
      "Filed retroactive foreign qualification. Negotiated penalty abatement with FTB on first-time offender grounds. Submitted supporting documentation.",
    result: "$800 in penalties waived. Entity now properly registered in CA.",
    company: "Beacon Health, LLC",
    plan: "Essentials + add-on",
  },
]

export default function GovernmentLiaisonPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-20 px-4 sm:px-6 bg-[#1B2B4B]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-8">
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">
                Enrolled Agent licensed · Unlimited IRS representation authority
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-[1.08]">
              When the IRS calls,
              <br />
              <span className="text-emerald-400">we answer.</span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 leading-relaxed">
              When they don&apos;t pick up, we keep calling. Our Enrolled Agents handle every
              government interaction so you never spend a day on hold again.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/signup?plan=growth">
                <Button size="xl" className="bg-emerald-500 hover:bg-emerald-600 text-white w-full sm:w-auto">
                  Get government liaison
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="mailto:hello@goodstanding.ai">
                <Button
                  size="xl"
                  variant="outline"
                  className="bg-transparent border-white/20 text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  Have an urgent issue?
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What is an EA */}
      <section className="py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#1B2B4B] mb-6">
                What&apos;s an Enrolled Agent — and why does it matter?
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                An <strong>Enrolled Agent (EA)</strong> is the highest IRS credential available to
                tax professionals — granted by the IRS itself. EAs have <em>unlimited practice rights</em>:
                they can represent any taxpayer before any IRS office, for any tax matter.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                The same authority as a CPA or tax attorney — but EAs are specifically focused on
                tax representation. No startup compliance competitor has this credential.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                Here&apos;s what that means for you: when you receive an IRS notice, your EA can call
                the <strong>Practitioner Priority Service (PPS)</strong> — a dedicated IRS line for
                licensed professionals with dramatically shorter hold times. They can access your
                account, get answers, and resolve issues the same call. You cannot do this yourself.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { stat: "Unlimited", label: "IRS representation scope" },
                  { stat: "1–5 days", label: "Average resolution time" },
                  { stat: "$0", label: "Cost vs. lawyer alternatives" },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border border-slate-200 text-center">
                    <p className="text-2xl font-bold text-emerald-600 mb-1">{item.stat}</p>
                    <p className="text-xs text-slate-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#1B2B4B] rounded-2xl p-8">
              <h3 className="text-white font-bold text-lg mb-6">
                EA vs. other credentials
              </h3>
              <div className="space-y-4">
                {[
                  { credential: "Enrolled Agent (EA)", irs: true, state: true, note: "GoodStanding.ai" },
                  { credential: "CPA", irs: true, state: true, note: "$300–500/hr" },
                  { credential: "Tax Attorney", irs: true, state: true, note: "$400–600/hr" },
                  { credential: "Every.io", irs: false, state: false, note: "No license" },
                  { credential: "doola", irs: false, state: false, note: "No license" },
                  { credential: "LegalZoom", irs: false, state: false, note: "No license" },
                ].map((row, i) => (
                  <div key={i} className={`flex items-center gap-3 rounded-lg p-3 ${i === 0 ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-white/5"}`}>
                    <span className={`text-sm font-medium flex-1 ${i === 0 ? "text-emerald-400" : "text-slate-300"}`}>
                      {row.credential}
                    </span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${row.irs ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
                      {row.irs ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <span className="text-red-400 text-xs font-bold">✗</span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 w-28 text-right shrink-0">{row.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What we can do */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-[#1B2B4B] mb-4">
              What we can do for you
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              If it involves the IRS, a state tax authority, or the Secretary of State — we handle it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {capabilities.map((cap, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                <div className="w-10 h-10 bg-[#1B2B4B] rounded-lg flex items-center justify-center mb-5">
                  {i === 0 ? (
                    <AlertCircle className="w-5 h-5 text-emerald-400" />
                  ) : i === 1 ? (
                    <FileText className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Shield className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-[#1B2B4B] mb-4">{cap.title}</h3>
                <ul className="space-y-2.5">
                  {cap.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-[#1B2B4B] mb-4">
              How it works
            </h2>
            <p className="text-slate-500 text-lg">AI does 80% of the prep. Our EA makes the call. You get resolution.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {process.map((step, i) => (
              <div key={i} className="relative">
                {i < process.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-full w-full h-0.5 bg-slate-200 -z-0 translate-x-4" />
                )}
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-[#1B2B4B] text-emerald-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {step.step}
                  </div>
                </div>
                <h3 className="font-bold text-[#1B2B4B] mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case studies */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-[#1B2B4B] mb-4">
              Real resolutions
            </h2>
            <p className="text-slate-500 text-lg">Examples of what government liaison looks like in practice.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {caseStudies.map((cs, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold text-white bg-[#1B2B4B] rounded-full px-2.5 py-1">
                    {cs.agency}
                  </span>
                  <span className="text-xs text-slate-500">{cs.type}</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Situation</p>
                    <p className="text-slate-700 text-sm leading-relaxed">{cs.situation}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">What we did</p>
                    <p className="text-slate-700 text-sm leading-relaxed">{cs.action}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Result</p>
                    <p className="text-emerald-800 text-sm font-semibold">{cs.result}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs text-slate-500">{cs.company}</span>
                  <span className="text-xs text-slate-400">{cs.plan}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing for this service */}
      <section className="py-20 px-4 sm:px-6 bg-[#1B2B4B]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Government liaison is included in Growth and Scale.
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Growth: 2 government liaison calls/month. Scale: unlimited.
            Essentials customers can add government liaison at $199/hour.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-10">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-left">
              <p className="text-emerald-400 font-bold text-lg mb-1">Growth</p>
              <p className="text-3xl font-bold text-white mb-1">$249<span className="text-sm text-slate-400">/mo</span></p>
              <p className="text-slate-400 text-sm">2 government liaison calls included</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-left">
              <p className="text-emerald-400 font-bold text-lg mb-1">Scale</p>
              <p className="text-3xl font-bold text-white mb-1">$499<span className="text-sm text-slate-400">/mo</span></p>
              <p className="text-slate-400 text-sm">Unlimited government liaison calls</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup?plan=growth">
              <Button size="xl" className="bg-emerald-500 hover:bg-emerald-600 text-white w-full sm:w-auto">
                Get Growth plan
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="mailto:hello@goodstanding.ai">
              <Button
                size="xl"
                variant="outline"
                className="bg-transparent border-white/20 text-white hover:bg-white/10 w-full sm:w-auto"
              >
                Talk to us first
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
