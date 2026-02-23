import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/marketing/Navbar"
import Footer from "@/components/marketing/Footer"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, Globe, Shield, Building2, FileCheck, Phone } from "lucide-react"

export const metadata: Metadata = {
  title: "US Company Formation for International Founders — GoodStanding.ai",
  description:
    "Form a US C-Corp or LLC as a non-resident founder. GoodStanding.ai handles compliance, registered agent, annual reports, and government liaison — no US address required.",
  openGraph: {
    title: "US Company Formation for International Founders — GoodStanding.ai",
    description: "No US address required. Form a Delaware C-Corp, get your EIN, and stay compliant — handled for you.",
    url: "https://goodstanding.ai/international",
  },
  twitter: { card: "summary_large_image" },
}

const COUNTRIES = [
  "India", "China", "Canada", "UK", "Australia", "Israel",
  "Germany", "France", "Brazil", "Singapore", "Nigeria", "UAE",
]

const STEPS = [
  {
    number: "01",
    title: "Choose Delaware C-Corp",
    body: "Delaware is the default for international founders. Clear corporate law, no state income tax for non-residents, and VCs expect it.",
    icon: Building2,
  },
  {
    number: "02",
    title: "We handle formation & agent",
    body: "GoodStanding.ai files your Certificate of Incorporation and serves as your registered agent — your US presence covered.",
    icon: Shield,
  },
  {
    number: "03",
    title: "Get your EIN without SSN",
    body: "You can apply for an EIN as a non-resident using Form SS-4 by fax or mail. No SSN required. We walk you through it.",
    icon: FileCheck,
  },
  {
    number: "04",
    title: "Stay compliant automatically",
    body: "Annual reports, franchise tax reminders, and overdue filing alerts — tracked and managed from your GoodStanding.ai dashboard.",
    icon: FileCheck,
  },
  {
    number: "05",
    title: "Government liaison when needed",
    body: "IRS notices, state agency letters, ITIN applications — our Enrolled Agents handle calls on your behalf.",
    icon: Phone,
  },
]

const FAQS = [
  {
    q: "Do I need a US address to form a US company?",
    a: "No. Your registered agent's address (which GoodStanding.ai provides) serves as the company's official address in Delaware. You can run the company entirely from outside the US.",
  },
  {
    q: "Can I get a bank account without a US presence?",
    a: "Mercury, Relay, and Brex all offer online US bank accounts to non-resident founders. You'll need your EIN, Certificate of Incorporation, and a video verification call. GoodStanding.ai helps you prepare the required documents.",
  },
  {
    q: "What taxes does a Delaware C-Corp owe if it has no US operations?",
    a: "Delaware charges an annual franchise tax ($400–$200K depending on method) and a $50 filing fee. Federal corporate taxes apply only to US-sourced income. If your customers and operations are entirely outside the US, federal tax exposure is typically minimal — but consult a CPA.",
  },
  {
    q: "Do I need a visa to form a US company?",
    a: "No visa is required to own and operate a US corporation from abroad. You may need a visa if you want to physically work in the US, but simply owning a Delaware C-Corp carries no immigration requirements.",
  },
  {
    q: "What is FBAR / FinCEN 114?",
    a: "If your US company has foreign bank accounts (or you have foreign accounts related to the business) exceeding $10,000, you may need to file FBAR annually. GoodStanding.ai tracks this deadline and alerts you — but you'll need a licensed tax professional for the actual filing.",
  },
]

export default function InternationalPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="bg-[#0F1829] py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-3 py-1.5 rounded-full mb-6">
              <Globe className="w-3.5 h-3.5" />
              International founders
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight tracking-tight">
              A US company from{" "}
              <span className="text-emerald-400">anywhere in the world</span>
            </h1>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              No US address, no SSN, no lawyer required. Form a Delaware C-Corp, get your EIN, and keep your compliance on autopilot — from wherever you are.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8">
                  Start for free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/resources/international-founder-us-entity">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                  Read the guide
                </Button>
              </Link>
            </div>

            {/* Country pills */}
            <div className="flex flex-wrap gap-2 justify-center mt-10">
              {COUNTRIES.map((c) => (
                <span key={c} className="text-xs text-slate-300 bg-white/10 px-3 py-1 rounded-full">
                  {c}
                </span>
              ))}
              <span className="text-xs text-slate-400 bg-white/5 px-3 py-1 rounded-full">
                + 180 countries
              </span>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-4 bg-slate-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-black text-slate-900 mb-2 text-center">How it works</h2>
            <p className="text-slate-500 text-center mb-12">Five steps from zero to a compliant US company.</p>

            <div className="space-y-6">
              {STEPS.map((step) => (
                <div key={step.number} className="flex gap-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-10 h-10 bg-[#1B2B4B] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-black text-emerald-400">{step.number}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What's included */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-black text-slate-900 mb-2 text-center">What GoodStanding.ai handles</h2>
            <p className="text-slate-500 text-center mb-12">Everything to keep your US entity in good standing.</p>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Delaware C-Corp formation",
                "Registered agent service",
                "Annual report tracking & filing",
                "Delaware franchise tax alerts",
                "Federal tax deadline reminders",
                "BOI Report (FinCEN) tracking",
                "IRS & state agency liaison",
                "EIN application guidance",
                "Foreign founder compliance checklist",
                "Document vault for formation docs",
                "Share status with investors",
                "Multi-company support",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4 bg-slate-50">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-slate-900 mb-12 text-center">Common questions</h2>
            <div className="space-y-6">
              {FAQS.map(({ q, a }) => (
                <div key={q} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-3 leading-snug">{q}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 bg-[#0F1829]">
          <div className="max-w-2xl mx-auto text-center">
            <Shield className="w-10 h-10 text-emerald-400 mx-auto mb-5" />
            <h2 className="text-3xl font-black text-white mb-4">
              Start your US company today
            </h2>
            <p className="text-slate-400 mb-8">
              Free to start. No US address required. Cancel anytime.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8">
                Create your account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
