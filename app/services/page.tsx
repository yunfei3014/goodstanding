import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/marketing/Navbar"
import Footer from "@/components/marketing/Footer"
import { Button } from "@/components/ui/button"
import {
  Building2,
  MapPin,
  FileCheck,
  Phone,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Services — GoodStanding.ai",
  description: "From entity formation to ongoing compliance monitoring, foreign qualification, and government liaison — GoodStanding.ai handles every compliance need for your startup.",
  openGraph: {
    title: "Services — GoodStanding.ai",
    description: "Entity formation, compliance monitoring, and government liaison for startups.",
    url: "https://goodstanding.ai/services",
  },
  twitter: { card: "summary_large_image" },
}

const services = [
  {
    id: "formation",
    icon: Building2,
    name: "Formation",
    tagline: "Start right.",
    price: "Free (+ state fees)",
    description:
      "Most formation services treat incorporation as a transaction. We treat it as the start of a relationship. Our AI guides you through entity selection, we file everything, and your compliance dashboard goes live the same day.",
    howAI:
      "AI interviews you about your situation (solo vs. co-founders, planning to raise vs. bootstrapping, US vs. international) and recommends the right entity type, state, and structure. No ambiguity.",
    includes: [
      "LLC, C-Corp, or S-Corp in all 50 states",
      "AI-guided entity selection",
      "EIN application (same-day for most entities)",
      "Operating agreement or bylaws (AI-drafted, customized)",
      "Bank account setup guidance",
      "Compliance dashboard goes live immediately",
    ],
    outcome: "You get your formation documents and EIN in days, not weeks.",
  },
  {
    id: "registered-agent",
    icon: MapPin,
    name: "Registered Agent",
    tagline: "Not just a mailbox.",
    price: "$99/year per state",
    description:
      "A registered agent is legally required in every state where your company is registered. Most registered agent services are just a mailbox. We digitize every document, AI-summarize what it means, and tell you what to do about it.",
    howAI:
      "When mail arrives, AI reads it, classifies it (notice, penalty, annual report, subpoena), extracts key dates and amounts, and generates a recommended action — often 'approve this filing' with one click.",
    includes: [
      "Registered agent in all 50 states",
      "All legal/state mail received and digitized",
      "AI-summarized documents with action recommendations",
      "Compliance calendar auto-populated from incoming mail",
      "Real-time notifications for time-sensitive documents",
      "Document vault storage",
    ],
    outcome: "You never get blindsided by government mail again.",
  },
  {
    id: "compliance",
    icon: FileCheck,
    name: "Compliance Monitoring",
    tagline: "Green means you're good.",
    price: "Included in paid plans",
    description:
      "Annual reports. Franchise tax. Foreign qualifications. Business licenses. State registrations. Every startup has compliance obligations that multiply as they grow — across states, across entities, across years. We track all of them.",
    howAI:
      "AI monitors every obligation deadline across all your registered states. When a deadline is approaching, we prepare the filing and send it to you for one-click approval. We submit. You get the confirmation.",
    includes: [
      "Annual report tracking and auto-filing",
      "Franchise tax calculation and filing",
      "Foreign qualification alerts and handling",
      "Good standing monitoring (active status checks)",
      "Multi-state expansion alerts",
      "One dashboard: every entity, every state, every deadline",
    ],
    outcome: "Green dashboard. Zero missed deadlines. No penalties.",
  },
  {
    id: "government-liaison",
    icon: Phone,
    name: "Government Liaison",
    tagline: "We make the call.",
    price: "Included in Growth + Scale",
    description:
      "This is what no one else does. IRS notice? We call. State rejected a filing? We resolve it. Need to verify a payment or untangle a tax issue? We have Enrolled Agent credentials and we use them — on your behalf.",
    howAI:
      "AI does 80% of the prep: generates Form 2848 (Power of Attorney), researches the specific issue, drafts talking points, pulls relevant account history. The licensed EA makes the call with AI-assisted real-time guidance. Post-call: AI generates summary and action items.",
    includes: [
      "IRS notice resolution (CP2000, CP503, CP504, audits)",
      "IRS account actions (transcripts, payments, holds)",
      "State agency representation (Secretary of State, FTB, DOR)",
      "Penalty abatement requests",
      "Good standing certificate expediting",
      "Full call summaries in your dashboard",
    ],
    outcome: "Government issues resolved in days, not weeks — without you on hold for a second.",
    highlight: true,
  },
]

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "GoodStanding.ai Services",
  description: "Business compliance services for startups: formation, registered agent, compliance monitoring, and government liaison.",
  url: "https://goodstanding.ai/services",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Service",
        name: "Entity Formation",
        description: "LLC, C-Corp, or S-Corp formation in all 50 states. AI-guided entity selection, EIN application, operating agreement, and compliance dashboard.",
        provider: { "@type": "Organization", name: "GoodStanding.ai" },
        areaServed: "US",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Free (plus state filing fees)" },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Service",
        name: "Registered Agent",
        description: "Registered agent service in all 50 states. Official address for legal documents, forwarding and digital delivery.",
        provider: { "@type": "Organization", name: "GoodStanding.ai" },
        areaServed: "US",
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Service",
        name: "Compliance Monitoring",
        description: "Annual report tracking and filing, franchise tax reminders, BOI/FinCEN reporting, and foreign qualification support.",
        provider: { "@type": "Organization", name: "GoodStanding.ai" },
        areaServed: "US",
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "Service",
        name: "Government Liaison",
        description: "Enrolled Agent-licensed representation before the IRS and state agencies. We make the calls and handle notices on your behalf.",
        provider: { "@type": "Organization", name: "GoodStanding.ai" },
        areaServed: "US",
      },
    },
  ],
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <Navbar />

      <div className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-[#1B2B4B] mb-4">
              Everything a startup needs to stay compliant.
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Four core services. AI-powered. Licensed professionals where it counts. One dashboard.
            </p>
          </div>

          <div className="space-y-8">
            {services.map((service, i) => (
              <div
                key={service.id}
                className={`rounded-2xl border p-8 ${
                  service.highlight
                    ? "bg-[#1B2B4B] border-[#1B2B4B] shadow-xl"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        service.highlight ? "bg-emerald-500/20" : "bg-[#1B2B4B]"
                      }`}>
                        <service.icon className={`w-5 h-5 ${service.highlight ? "text-emerald-400" : "text-emerald-400"}`} />
                      </div>
                      {service.highlight && (
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-1 rounded-full">
                          The differentiator
                        </span>
                      )}
                    </div>

                    <h2 className={`text-3xl font-bold mb-1 ${service.highlight ? "text-white" : "text-[#1B2B4B]"}`}>
                      {service.name}
                    </h2>
                    <p className={`text-lg font-medium mb-3 ${service.highlight ? "text-emerald-400" : "text-emerald-600"}`}>
                      {service.tagline}
                    </p>
                    <p className={`mb-4 leading-relaxed ${service.highlight ? "text-slate-400" : "text-slate-600"}`}>
                      {service.description}
                    </p>

                    <div className={`rounded-xl p-4 mb-6 ${service.highlight ? "bg-white/5 border border-white/10" : "bg-slate-50 border border-slate-200"}`}>
                      <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${service.highlight ? "text-slate-400" : "text-slate-500"}`}>
                        How AI powers this
                      </p>
                      <p className={`text-sm leading-relaxed ${service.highlight ? "text-slate-300" : "text-slate-600"}`}>
                        {service.howAI}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-xs uppercase tracking-wide ${service.highlight ? "text-slate-500" : "text-slate-400"}`}>
                          Pricing
                        </p>
                        <p className={`font-bold ${service.highlight ? "text-emerald-400" : "text-emerald-600"}`}>
                          {service.price}
                        </p>
                      </div>
                      {service.highlight ? (
                        <Link href="/signup?plan=growth">
                          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                            Get access <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      ) : (
                        <Link href="/signup">
                          <Button variant="outline" className="border-slate-200">
                            Get started <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className={`text-sm font-semibold uppercase tracking-wide mb-4 ${service.highlight ? "text-slate-400" : "text-slate-500"}`}>
                      What&apos;s included
                    </p>
                    <ul className="space-y-3 mb-6">
                      {service.includes.map((item, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${service.highlight ? "text-emerald-400" : "text-emerald-500"}`} />
                          <span className={`text-sm ${service.highlight ? "text-slate-300" : "text-slate-700"}`}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className={`rounded-xl p-5 ${service.highlight ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-emerald-50 border border-emerald-100"}`}>
                      <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${service.highlight ? "text-emerald-400" : "text-emerald-600"}`}>
                        The outcome
                      </p>
                      <p className={`text-sm font-semibold ${service.highlight ? "text-white" : "text-emerald-900"}`}>
                        {service.outcome}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-[#1B2B4B] mb-4">
              Ready to never think about compliance again?
            </h2>
            <p className="text-slate-500 mb-8">Form free today. Compliance handled from day one.</p>
            <Link href="/signup">
              <Button size="lg" className="bg-[#1B2B4B] hover:bg-[#243461] text-white">
                Start your company free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
