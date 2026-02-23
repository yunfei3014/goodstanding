import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/marketing/Navbar"
import Footer from "@/components/marketing/Footer"
import { Button } from "@/components/ui/button"
import { CheckCircle2, X, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Pricing — GoodStanding.ai",
  description: "Simple, transparent pricing for startup compliance. Start free and scale as you grow — from entity formation to ongoing compliance monitoring.",
  openGraph: {
    title: "Pricing — GoodStanding.ai",
    description: "Simple, transparent pricing for startup compliance. Start free and scale as you grow.",
    url: "https://goodstanding.ai/pricing",
  },
  twitter: { card: "summary_large_image" },
}

const tiers = [
  {
    name: "Launch",
    price: "Free",
    description: "Start your company today.",
    forWho: "Pre-incorporation founders",
    features: [
      { label: "Entity formation (+ state fees)", included: true },
      { label: "EIN application", included: true },
      { label: "Operating agreement / bylaws", included: true },
      { label: "30-day compliance guidance", included: true },
      { label: "Registered agent", included: false },
      { label: "Compliance monitoring", included: false },
      { label: "Annual report filing", included: false },
      { label: "Document vault", included: false },
      { label: "Government liaison calls", included: false },
    ],
    cta: "Start for free",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Essentials",
    price: "$99",
    period: "/mo",
    description: "Ongoing compliance, handled.",
    forWho: "Post-formation, single-state startups",
    features: [
      { label: "Everything in Launch", included: true },
      { label: "Registered agent (1 state)", included: true },
      { label: "Compliance monitoring & alerts", included: true },
      { label: "Annual report filing", included: true },
      { label: "Document vault", included: true },
      { label: "Email support", included: true },
      { label: "Government liaison calls", included: false },
      { label: "Multi-state registered agent", included: false },
      { label: "Fundraise-readiness check", included: false },
    ],
    cta: "Get Essentials",
    href: "/signup?plan=essentials",
    highlight: false,
  },
  {
    name: "Growth",
    price: "$249",
    period: "/mo",
    description: "For startups raising or expanding.",
    forWho: "Multi-state or fundraising startups",
    badge: "Most popular",
    features: [
      { label: "Everything in Essentials", included: true },
      { label: "Registered agent (up to 3 states)", included: true },
      { label: "2 government liaison calls/month", included: true },
      { label: "Proactive compliance alerts", included: true },
      { label: "Fundraise-readiness check", included: true },
      { label: "Priority support", included: true },
      { label: "Unlimited government calls", included: false },
      { label: "Dedicated compliance lead", included: false },
      { label: "Quarterly compliance review", included: false },
    ],
    cta: "Get Growth",
    href: "/signup?plan=growth",
    highlight: true,
  },
  {
    name: "Scale",
    price: "$499",
    period: "/mo",
    description: "Complex or scaling startups.",
    forWho: "Series A+ or multi-entity companies",
    features: [
      { label: "Everything in Growth", included: true },
      { label: "Unlimited government liaison calls", included: true },
      { label: "Dedicated compliance lead", included: true },
      { label: "Multi-state expansion support", included: true },
      { label: "Quarterly compliance review", included: true },
      { label: "Tax prep discount (30%)", included: true },
      { label: "Custom SLA", included: true },
      { label: "White-glove onboarding", included: true },
      { label: "Slack shared channel", included: true },
    ],
    cta: "Get Scale",
    href: "/signup?plan=scale",
    highlight: false,
  },
]

const addons = [
  { name: "Additional state registered agent", price: "$99/year per state" },
  { name: "Government liaison (ad hoc, Essentials tier)", price: "$199/hour" },
  { name: "Multi-state expansion package", price: "$500–1,500/state" },
  { name: "Business tax preparation", price: "$500–2,000/year" },
  { name: "Bookkeeping (Phase 2)", price: "$299–499/month" },
]

const faqs = [
  {
    q: "What's included in formation? Is it really free?",
    a: "Yes. We handle LLC, C-Corp, or S-Corp formation in all 50 states, EIN application, and operating agreement generation — all free. You pay only the state filing fees (e.g., $89 for Delaware, $70 for Wyoming). No hidden charges.",
  },
  {
    q: "What's an Enrolled Agent and why does it matter?",
    a: "An Enrolled Agent (EA) is a federally authorized tax practitioner licensed by the IRS — the same authority as CPAs and tax attorneys to represent clients before the IRS. No startup compliance competitor has EA credentials. This means only GoodStanding.ai can actually call the IRS on your behalf, not just send you alerts.",
  },
  {
    q: "Can you really call the IRS for me?",
    a: "Yes. On Growth and Scale plans, our Enrolled Agents call the IRS Practitioner Priority Service line, represent you on notices, request transcripts, verify payments, and resolve issues. We file Form 2848 (Power of Attorney) so we can act on your behalf.",
  },
  {
    q: "How fast are government liaison calls resolved?",
    a: "Most issues are resolved in 1–5 business days. Simple requests (good standing certificates, transcript requests) often resolve same-day or next-day. Complex IRS disputes can take 2–3 weeks depending on IRS processing times — but we follow up every step of the way.",
  },
  {
    q: "What states do you cover for registered agent?",
    a: "All 50 states. At launch we're fully operational in DE, CA, WY, TX, FL, NY, WA, CO, GA, and NC — the top 10 startup states. Additional states available on request at $99/year each.",
  },
  {
    q: "Do you handle multi-entity companies?",
    a: "Yes, and this is where we really shine. If you have a holding company, an operating entity, a foreign subsidiary — we track all of them in one dashboard. Scale plan includes multi-entity support. Contact us for custom pricing above 3 entities.",
  },
  {
    q: "What if I'm an international founder?",
    a: "We love international founders. We help non-US founders form US entities, get EINs (no SSN required), set up US bank accounts, and stay compliant — all in English. Our team is bilingual in Chinese and English.",
  },
]

const pricingJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "GoodStanding.ai",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://goodstanding.ai",
  offers: [
    {
      "@type": "Offer",
      name: "Launch",
      price: "0",
      priceCurrency: "USD",
      description: "Free entity formation, EIN application, and operating agreement.",
    },
    {
      "@type": "Offer",
      name: "Essentials",
      price: "99",
      priceCurrency: "USD",
      description: "Registered agent, compliance monitoring, and annual report filing.",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "99",
        priceCurrency: "USD",
        referenceQuantity: { "@type": "QuantitativeValue", unitCode: "MON" },
      },
    },
    {
      "@type": "Offer",
      name: "Growth",
      price: "249",
      priceCurrency: "USD",
      description: "Multi-state registered agent, government liaison calls, and fundraise-readiness check.",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "249",
        priceCurrency: "USD",
        referenceQuantity: { "@type": "QuantitativeValue", unitCode: "MON" },
      },
    },
    {
      "@type": "Offer",
      name: "Scale",
      price: "499",
      priceCurrency: "USD",
      description: "Unlimited government liaison calls, dedicated compliance lead, and quarterly compliance review.",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "499",
        priceCurrency: "USD",
        referenceQuantity: { "@type": "QuantitativeValue", unitCode: "MON" },
      },
    },
  ],
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />
      <Navbar />

      <div className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <h1 className="text-5xl font-bold text-[#1B2B4B] mb-4">
              Transparent pricing
            </h1>
            <p className="text-xl text-slate-500 max-w-xl mx-auto">
              Cheaper than one hour with a startup lawyer. Better than anything else out there.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-16">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border relative flex flex-col ${
                  tier.highlight
                    ? "bg-[#1B2B4B] border-[#1B2B4B] shadow-2xl"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <h3 className={`font-bold text-xl mb-1 ${tier.highlight ? "text-white" : "text-[#1B2B4B]"}`}>
                    {tier.name}
                  </h3>
                  <p className={`text-xs mb-4 ${tier.highlight ? "text-slate-400" : "text-slate-500"}`}>
                    {tier.forWho}
                  </p>
                  <div className="mb-1">
                    <span className={`text-4xl font-bold ${tier.highlight ? "text-white" : "text-[#1B2B4B]"}`}>
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span className={`text-sm ${tier.highlight ? "text-slate-400" : "text-slate-500"}`}>
                        {tier.period}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm mb-6 ${tier.highlight ? "text-slate-400" : "text-slate-500"}`}>
                    {tier.description}
                  </p>

                  <Link href={tier.href}>
                    <Button className={`w-full mb-6 ${
                      tier.highlight
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                        : "bg-[#1B2B4B] hover:bg-[#243461] text-white"
                    }`}>
                      {tier.cta}
                    </Button>
                  </Link>

                  <ul className="space-y-2.5">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        {f.included ? (
                          <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${tier.highlight ? "text-emerald-400" : "text-emerald-500"}`} />
                        ) : (
                          <X className={`w-4 h-4 flex-shrink-0 mt-0.5 ${tier.highlight ? "text-slate-600" : "text-slate-300"}`} />
                        )}
                        <span className={`text-sm ${
                          !f.included
                            ? tier.highlight ? "text-slate-500" : "text-slate-300"
                            : tier.highlight ? "text-slate-300" : "text-slate-600"
                        }`}>
                          {f.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Add-ons */}
          <div className="bg-slate-50 rounded-2xl p-8 mb-16 border border-slate-200">
            <h2 className="text-2xl font-bold text-[#1B2B4B] mb-6">Add-ons</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {addons.map((addon) => (
                <div key={addon.name} className="bg-white rounded-xl p-5 border border-slate-200">
                  <p className="font-semibold text-[#1B2B4B] text-sm mb-1">{addon.name}</p>
                  <p className="text-emerald-600 font-bold text-sm">{addon.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#1B2B4B] mb-8 text-center">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-slate-200 rounded-xl p-6">
                  <h3 className="font-semibold text-[#1B2B4B] mb-2">{faq.q}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-[#1B2B4B] mb-4">
              Still have questions?
            </h2>
            <p className="text-slate-500 mb-8">
              Our compliance team is happy to walk you through what you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-[#1B2B4B] hover:bg-[#243461] text-white">
                  Start free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="mailto:hello@goodstanding.ai">
                <Button size="lg" variant="outline" className="border-slate-200">
                  Email us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
