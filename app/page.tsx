import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/marketing/Navbar"
import Footer from "@/components/marketing/Footer"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Phone,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  Star,
  Building2,
  Globe,
  Clock,
  AlertCircle,
  TrendingUp,
  Lock,
} from "lucide-react"

const promises = [
  {
    icon: Building2,
    title: "We form your startup right the first time.",
    description:
      "Entity selection, incorporation, EIN, operating agreement — handled in days. AI-guided recommendations based on your specific situation. Free, because formation is table stakes.",
    highlight: "Free formation",
  },
  {
    icon: FileCheck,
    title: "We keep you in good standing — automatically.",
    description:
      "Annual reports, franchise tax, foreign qualifications — monitored, prepared, and filed before you know they're due. One dashboard. Every entity. Every deadline. You never see red.",
    highlight: "Zero missed deadlines",
  },
  {
    icon: Phone,
    title: "We talk to the government so you don't have to.",
    description:
      "IRS notice? We call them. State rejected a filing? We resolve it. We're Enrolled Agent licensed — the same credential that lets CPAs represent you before the IRS. Nobody else does this.",
    highlight: "EA licensed — nobody else does this",
  },
]

const howItWorks = [
  {
    step: "01",
    title: "Form your company",
    description:
      "Tell us about your startup. We recommend the right entity, state, and structure. We file everything — you get your EIN and documents in days.",
  },
  {
    step: "02",
    title: "We monitor everything",
    description:
      "Your compliance dashboard goes live immediately. Annual reports, franchise tax, foreign qualifications — we track every obligation and file before deadlines.",
  },
  {
    step: "03",
    title: "We handle what comes up",
    description:
      "Government notice? Expansion to a new state? IRS question? We handle it. Our Enrolled Agents make the calls, draft the responses, and update your dashboard.",
  },
]

const socialProof = [
  {
    quote:
      "I raised my seed round and realized I had zero idea about compliance. GoodStanding handled everything — and when we got a Delaware notice, they called and resolved it in two days.",
    author: "Sarah K.",
    role: "Founder, Prism AI",
  },
  {
    quote:
      "As a Chinese founder, dealing with the IRS was terrifying. GoodStanding speaks both languages — English and government. They just handled it.",
    author: "Wei L.",
    role: "Founder, Beacon Health",
  },
  {
    quote:
      "We saved $8,000 in lawyer fees in the first six months. My previous startup's compliance was a disaster. This is what I needed from day one.",
    author: "Marcus T.",
    role: "2nd-time founder, YC W25",
  },
]

const pricingTiers = [
  {
    name: "Launch",
    price: "Free",
    description: "Everything to start your company",
    features: [
      "Entity formation (+ state fees)",
      "EIN application",
      "Operating agreement",
      "30-day compliance guidance",
    ],
    cta: "Start free",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Essentials",
    price: "$99",
    period: "/month",
    description: "Formation → ongoing compliance",
    features: [
      "Registered agent (1 state)",
      "Compliance monitoring",
      "Annual report filing",
      "Document vault",
      "Email support",
    ],
    cta: "Get started",
    href: "/signup?plan=essentials",
    highlight: false,
  },
  {
    name: "Growth",
    price: "$249",
    period: "/month",
    description: "For startups raising or expanding",
    features: [
      "Registered agent (up to 3 states)",
      "2 government liaison calls/month",
      "Proactive compliance alerts",
      "Fundraise-readiness check",
      "Priority support",
    ],
    cta: "Get started",
    href: "/signup?plan=growth",
    highlight: true,
    badge: "Most popular",
  },
  {
    name: "Scale",
    price: "$499",
    period: "/month",
    description: "Complex or scaling startups",
    features: [
      "Unlimited government liaison calls",
      "Dedicated compliance lead",
      "Multi-state expansion support",
      "Quarterly compliance review",
      "Tax prep discount",
    ],
    cta: "Get started",
    href: "/signup?plan=scale",
    highlight: false,
  },
]

const competitors = [
  { name: "Every.io", issue: "No EA license. Can't call the IRS." },
  { name: "doola", issue: "Alerts only. No government calls." },
  { name: "LegalZoom", issue: "They tell you what to file. You file it." },
  { name: "ZenBusiness", issue: "800K customers. No IRS calls." },
]

export const metadata: Metadata = {
  title: "GoodStanding.ai — Your Startup's Co-Compliance Partner",
  description:
    "Form your company, stay compliant, and handle government calls — automated. Enrolled Agent licensed. No missed deadlines, no IRS surprises.",
  openGraph: {
    title: "GoodStanding.ai — Your Startup's Co-Compliance Partner",
    description: "Startup compliance on autopilot. Formation, registered agent, and Enrolled Agent government liaison.",
    url: "https://goodstanding.ai",
    siteName: "GoodStanding.ai",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://goodstanding.ai/#organization",
      name: "GoodStanding.ai",
      url: "https://goodstanding.ai",
      description:
        "Business compliance software for startups. Enrolled Agent-licensed formation, registered agent, compliance monitoring, and IRS/state government liaison services.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "hello@goodstanding.ai",
        url: "https://goodstanding.ai/contact",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "GoodStanding.ai",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://goodstanding.ai",
      description:
        "Startup compliance management platform. Entity formation, compliance monitoring, annual report filing, and IRS/state government liaison by Enrolled Agents.",
      offers: [
        { "@type": "Offer", name: "Launch", price: "0", priceCurrency: "USD" },
        { "@type": "Offer", name: "Essentials", price: "99", priceCurrency: "USD" },
        { "@type": "Offer", name: "Growth", price: "249", priceCurrency: "USD" },
        { "@type": "Offer", name: "Scale", price: "499", priceCurrency: "USD" },
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://goodstanding.ai/#website",
      url: "https://goodstanding.ai",
      name: "GoodStanding.ai",
      publisher: { "@id": "https://goodstanding.ai/#organization" },
    },
  ],
}

const homeFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is GoodStanding.ai?",
      acceptedAnswer: { "@type": "Answer", text: "GoodStanding.ai is a startup compliance platform. We handle entity formation, registered agent services, compliance monitoring, and government liaison — including IRS and state agency calls made by Enrolled Agents on your behalf." },
    },
    {
      "@type": "Question",
      name: "What is an Enrolled Agent and why does it matter?",
      acceptedAnswer: { "@type": "Answer", text: "An Enrolled Agent (EA) is a federally licensed tax professional authorized to represent taxpayers before the IRS. Unlike CPAs and attorneys, EAs specialize exclusively in tax. GoodStanding.ai uses EAs to make government calls, respond to IRS notices, and handle state agency matters — something most compliance platforms can't do." },
    },
    {
      "@type": "Question",
      name: "How much does GoodStanding.ai cost?",
      acceptedAnswer: { "@type": "Answer", text: "GoodStanding.ai starts free (Launch plan) and includes entity formation at no charge beyond state filing fees. Paid plans start at $99/month for ongoing compliance monitoring and registered agent service. Growth ($249/mo) and Scale ($499/mo) plans include government liaison calls." },
    },
    {
      "@type": "Question",
      name: "Can international founders use GoodStanding.ai?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. International founders can form a US Delaware C-Corp or LLC through GoodStanding.ai without a US address, SSN, or visa. We provide a US registered agent address and guide you through obtaining an EIN as a non-resident using Form SS-4." },
    },
    {
      "@type": "Question",
      name: "What compliance deadlines does GoodStanding.ai track?",
      acceptedAnswer: { "@type": "Answer", text: "GoodStanding.ai tracks Delaware franchise tax (due March 1), annual reports in all 50 states, foreign qualification renewals, BOI/FinCEN reports, federal tax deadlines, and state-specific compliance filings. You get email reminders and dashboard alerts for all upcoming deadlines." },
    },
    {
      "@type": "Question",
      name: "Is GoodStanding.ai a law firm?",
      acceptedAnswer: { "@type": "Answer", text: "No. GoodStanding.ai is a software platform, not a law firm, and does not provide legal advice. Enrolled Agent services are limited to representation before the IRS as authorized under 31 C.F.R. Part 10." },
    },
  ],
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqJsonLd) }}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 mb-8">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-emerald-700 font-medium">
              Enrolled Agent licensed · IRS + state agency representation
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#1B2B4B] tracking-tight leading-[1.08] mb-6">
            Your startup should
            <br />
            never lose{" "}
            <span className="text-emerald-500">good standing.</span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            We handle formation, filings, and the thing nobody else will do —
            <strong className="text-slate-700"> calling the government on your behalf.</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup">
              <Button
                size="xl"
                className="bg-[#1B2B4B] hover:bg-[#243461] text-white w-full sm:w-auto"
              >
                Start your company free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/government-liaison">
              <Button
                size="xl"
                variant="outline"
                className="w-full sm:w-auto border-slate-200 text-slate-700"
              >
                Got a government issue?
              </Button>
            </Link>
          </div>

          <p className="text-sm text-slate-400 mt-5">
            Free to form · No credit card required · $99/mo after formation
          </p>
        </div>

        {/* Dashboard preview */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="bg-[#0F1829] rounded-2xl p-1 shadow-2xl">
            <div className="bg-[#1B2B4B] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4 px-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <div className="flex-1 bg-white/10 rounded-md h-6 mx-4 flex items-center px-3">
                  <span className="text-white/40 text-xs font-mono">
                    app.goodstanding.ai/dashboard
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-white font-semibold text-sm">Prism AI, Inc.</p>
                      <p className="text-white/50 text-xs">Delaware C-Corp</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-500/20 rounded-full px-2.5 py-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-emerald-400 text-xs font-medium">Good Standing</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Annual Report</span>
                      <span className="text-emerald-400">Filed ✓</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Franchise Tax</span>
                      <span className="text-amber-400">Due Jun 1</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-amber-400/30">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-white font-semibold text-sm">Beacon Health, LLC</p>
                      <p className="text-white/50 text-xs">Wyoming LLC</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-amber-500/20 rounded-full px-2.5 py-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span className="text-amber-400 text-xs font-medium">Action Needed</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Foreign Qual (CA)</span>
                      <span className="text-red-400">Overdue</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Annual Report</span>
                      <span className="text-amber-400">Due Apr 15</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white/60 text-xs font-medium uppercase tracking-wide mb-3">
                    Government Liaison
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-white text-xs font-medium">IRS CP2000 resolved</p>
                        <p className="text-white/40 text-xs">Prism AI · 2 days</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-white text-xs font-medium">Good standing cert</p>
                        <p className="text-white/40 text-xs">Prism AI · 24 hrs</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Promises */}
      <section className="py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-[#1B2B4B] mb-4">
              Three promises. Zero exceptions.
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Everything a startup needs to stay in good standing — from day zero through Series B.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {promises.map((promise, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-[#1B2B4B] rounded-xl flex items-center justify-center mb-6">
                  <promise.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-[#1B2B4B] mb-3 leading-snug">
                  {promise.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  {promise.description}
                </p>
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 rounded-full px-3 py-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-700">
                    {promise.highlight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-[#1B2B4B] mb-4">How it works</h2>
            <p className="text-slate-500 text-lg">Three steps to never thinking about compliance again.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, i) => (
              <div key={i}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#1B2B4B] flex items-center justify-center text-emerald-400 font-bold text-sm flex-shrink-0">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[#1B2B4B] mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/signup">
              <Button size="lg" className="bg-[#1B2B4B] hover:bg-[#243461] text-white">
                Start your company free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* EA Differentiator */}
      <section className="py-20 px-4 sm:px-6 bg-[#1B2B4B]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-emerald-400 text-sm font-semibold uppercase tracking-wider mb-4 block">
                The EA Difference
              </span>
              <h2 className="text-4xl font-bold text-white mb-6 leading-snug">
                Every competitor can alert you.
                <br />
                Only we can call the IRS.
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                An Enrolled Agent (EA) is the highest IRS credential — unlimited authority to represent
                taxpayers. No startup compliance competitor has this license. When you get a government
                notice, they send you an email. We pick up the phone.
              </p>
              <div className="space-y-3">
                {competitors.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <div>
                      <span className="text-white text-sm font-semibold">{c.name}:</span>
                      <span className="text-slate-400 text-sm ml-2">{c.issue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Government Liaison in action</h3>
                  <p className="text-slate-400 text-sm">Here's what happens when the IRS notices something.</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: "IRS sends CP2000 notice", time: "Day 0", color: "amber" },
                  { label: "AI analyzes notice, preps response + call script", time: "Hour 1", color: "blue" },
                  { label: "Enrolled Agent calls IRS Practitioner Priority Line", time: "Day 1", color: "blue" },
                  { label: "Issue resolved, summary in your dashboard", time: "Day 2", color: "emerald" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      item.color === "amber" ? "bg-amber-400" :
                      item.color === "emerald" ? "bg-emerald-400" : "bg-blue-400"
                    }`} />
                    <span className="text-slate-300 text-sm flex-1">{item.label}</span>
                    <span className={`text-xs font-medium ${
                      item.color === "amber" ? "text-amber-400" :
                      item.color === "emerald" ? "text-emerald-400" : "text-blue-400"
                    }`}>{item.time}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-white/10">
                <Link href="/government-liaison">
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                    Learn about Government Liaison
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1B2B4B] mb-4">
              Founders who never think about compliance
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {socialProof.map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div>
                  <p className="text-slate-900 font-semibold text-sm">{testimonial.author}</p>
                  <p className="text-slate-400 text-xs">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 sm:px-6 bg-slate-50" id="pricing">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-[#1B2B4B] mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-slate-500 text-lg">
              Cheaper than one hour with a startup lawyer.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl p-6 border relative ${
                  tier.highlight
                    ? "bg-[#1B2B4B] border-[#1B2B4B] shadow-xl"
                    : "bg-white border-slate-200"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      {tier.badge}
                    </span>
                  </div>
                )}
                <div className="mb-4">
                  <h3 className={`font-bold text-lg mb-1 ${tier.highlight ? "text-white" : "text-[#1B2B4B]"}`}>
                    {tier.name}
                  </h3>
                  <p className={`text-sm ${tier.highlight ? "text-slate-400" : "text-slate-500"}`}>
                    {tier.description}
                  </p>
                </div>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${tier.highlight ? "text-white" : "text-[#1B2B4B]"}`}>
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className={`text-sm ${tier.highlight ? "text-slate-400" : "text-slate-500"}`}>
                      {tier.period}
                    </span>
                  )}
                </div>
                <ul className="space-y-2.5 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${tier.highlight ? "text-emerald-400" : "text-emerald-500"}`} />
                      <span className={`text-sm ${tier.highlight ? "text-slate-300" : "text-slate-600"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href={tier.href}>
                  <Button className={`w-full ${
                    tier.highlight
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                      : "bg-[#1B2B4B] hover:bg-[#243461] text-white"
                  }`}>
                    {tier.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for startups */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#1B2B4B] mb-6">
                Built for the startup lifecycle. Not the Fortune 500.
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: TrendingUp,
                    title: "Compliance grows with you",
                    desc: "One entity in one state today. Three entities in five states in 18 months. We track every new obligation as you grow.",
                  },
                  {
                    icon: Globe,
                    title: "Cross-border founders, fully supported",
                    desc: "Chinese-speaking team. US entity formation for non-US founders. EIN without SSN. We translate the government for you.",
                  },
                  {
                    icon: Clock,
                    title: "Speed matters for fundraising",
                    desc: "VCs do diligence. If your annual reports are late, the deal slows down or dies. We prevent that.",
                  },
                  {
                    icon: Lock,
                    title: "No law firm fees",
                    desc: "We're not billing $400/hour for work that doesn't require a law degree. GoodStanding is purpose-built for what founders actually need.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1B2B4B] mb-1">{item.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <h3 className="font-bold text-[#1B2B4B] mb-6">
                The compliance surface of a typical startup
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Delaware incorporation", status: "Day 1", done: true },
                  { label: "EIN from IRS", status: "Day 1", done: true },
                  { label: "CA foreign qualification", status: "Month 2", done: true },
                  { label: "Delaware annual report", status: "Year 1", done: true },
                  { label: "CA Statement of Information", status: "Year 1", done: true },
                  { label: "NY registration (new hire)", status: "Month 8", done: false },
                  { label: "Delaware franchise tax", status: "June 1", done: false },
                  { label: "TX registration (sales)", status: "Year 2", done: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-2">
                      {item.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                      )}
                      <span className="text-sm text-slate-700">{item.label}</span>
                    </div>
                    <span className="text-xs text-slate-400">{item.status}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-4">
                We track every single one of these. You focus on the product.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 bg-[#1B2B4B]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Keep your startup in good standing.
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Free to form. No credit card required. Your compliance dashboard
            goes live immediately after formation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup">
              <Button size="xl" className="bg-emerald-500 hover:bg-emerald-600 text-white w-full sm:w-auto">
                Start your company free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/government-liaison">
              <Button
                size="xl"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto"
              >
                Got a government issue?
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
