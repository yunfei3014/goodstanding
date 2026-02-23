import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/marketing/Navbar"
import Footer from "@/components/marketing/Footer"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "FAQ — GoodStanding.ai",
  description:
    "Frequently asked questions about GoodStanding.ai's startup compliance services, pricing, formation, government liaison, and Enrolled Agent representation.",
  openGraph: {
    title: "FAQ — GoodStanding.ai",
    description: "Common questions about startup compliance, pricing, formation, and government liaison.",
    url: "https://goodstanding.ai/faq",
  },
  twitter: { card: "summary_large_image" },
}

const categories = [
  {
    heading: "Platform & Pricing",
    items: [
      {
        q: "What is GoodStanding.ai?",
        a: "GoodStanding.ai is a startup compliance platform. We handle entity formation, registered agent services, annual report filing, compliance monitoring, and government liaison — including IRS and state agency calls made by our Enrolled Agents on your behalf.",
      },
      {
        q: "How much does GoodStanding.ai cost?",
        a: "The Launch plan is free and includes entity formation (plus state fees). Paid plans start at $99/month (Essentials) for ongoing compliance monitoring, registered agent service, and annual report filing. Growth ($249/mo) and Scale ($499/mo) plans include government liaison calls. See the full Pricing page for details.",
        link: { label: "View pricing", href: "/pricing" },
      },
      {
        q: "Is there a free trial?",
        a: "Yes — our Launch plan is free indefinitely. Formation, EIN application, and operating agreement are included at no cost. You only pay when you need ongoing compliance monitoring, a registered agent, or government liaison services.",
      },
      {
        q: "Can I cancel at any time?",
        a: "Yes. You can cancel your subscription at any time from your billing settings. Your access continues through the end of the current billing period. We don't lock you into annual contracts.",
      },
      {
        q: "Is GoodStanding.ai a law firm?",
        a: "No. GoodStanding.ai is a software platform and is not a law firm. We do not provide legal advice, and your use of the service does not create an attorney-client relationship. Enrolled Agent services are limited to federal tax representation as authorized under 31 C.F.R. Part 10.",
      },
    ],
  },
  {
    heading: "Formation & Entity Setup",
    items: [
      {
        q: "What entity types can I form?",
        a: "GoodStanding.ai supports LLCs, C-Corporations, and S-Corporations in all 50 states. Delaware C-Corps are the most common for VC-backed startups. We recommend the right entity type based on your funding plans, team structure, and jurisdiction.",
      },
      {
        q: "Why do most startups form in Delaware?",
        a: "Delaware's Court of Chancery is a specialized business court with 200+ years of corporate law precedent. VCs prefer Delaware C-Corps because they can hold preferred stock and the corporate structure is well-understood by investors, lawyers, and acquirers across the US.",
      },
      {
        q: "How long does formation take?",
        a: "Standard Delaware filings take 1–3 business days. Rush options are available for same-day or 24-hour processing. EIN applications are typically approved within 15 minutes when filed online, or can take 4–6 weeks if filed by fax or mail (required for international founders).",
      },
      {
        q: "What is an 83(b) election and should I file one?",
        a: "An 83(b) election is a tax filing that lets founders elect to be taxed on restricted stock at grant (when value is typically near zero) rather than at vesting. Missing the 30-day deadline after stock issuance can cost founders significant taxes at acquisition. GoodStanding.ai reminds you immediately when founder shares are issued.",
      },
    ],
  },
  {
    heading: "Registered Agent & Compliance",
    items: [
      {
        q: "What is a registered agent?",
        a: "A registered agent is a designated recipient of official legal and government mail for your company. Delaware requires every corporation to have a registered agent in the state. GoodStanding.ai provides registered agent service in all 50 states and forwards all notices to your dashboard.",
      },
      {
        q: "What compliance deadlines does GoodStanding.ai track?",
        a: "We track Delaware franchise tax (due March 1), annual reports for all registered states, BOI/FinCEN reports, foreign qualification renewals, federal tax deadlines (1120, 1065, etc.), and state-specific filing requirements. You get email reminders 60, 30, and 7 days before each deadline.",
      },
      {
        q: "What is a BOI report?",
        a: "The Beneficial Ownership Information (BOI) report is required by the Corporate Transparency Act (CTA). Most small US companies must file with FinCEN disclosing the identities of beneficial owners (individuals who own 25%+ or have substantial control). GoodStanding.ai tracks this deadline and sends reminders.",
      },
      {
        q: "What is the Delaware franchise tax?",
        a: "Delaware charges an annual franchise tax due March 1. The amount depends on which calculation method you use. The Authorized Shares Method can generate very large bills for startups. The Assumed Par Value Capital Method typically results in the $400 minimum for early-stage companies. GoodStanding.ai reminds you and explains which method to use.",
        link: { label: "Read the franchise tax guide", href: "/resources/delaware-franchise-tax-guide" },
      },
    ],
  },
  {
    heading: "Government Liaison & Enrolled Agents",
    items: [
      {
        q: "What is an Enrolled Agent?",
        a: "An Enrolled Agent (EA) is a federally licensed tax professional authorized by the US Treasury to represent taxpayers before the IRS. EAs specialize exclusively in taxation and have unlimited practice rights before the IRS — the same representation rights as CPAs and attorneys.",
        link: { label: "Learn more about EAs", href: "/resources/enrolled-agent-explainer" },
      },
      {
        q: "What does the government liaison service cover?",
        a: "GoodStanding.ai's Enrolled Agents can call the IRS and state tax agencies on your behalf, respond to notices, resolve rejected filings, handle ITIN applications, and communicate with the Delaware Division of Corporations. This is included in Growth and Scale plans.",
      },
      {
        q: "I received an IRS notice. What should I do?",
        a: "Don't panic — most IRS notices are informational or routine. Upload the notice to your GoodStanding.ai document vault and open a government liaison request. Our Enrolled Agents will review it, call the IRS if needed, and update your dashboard with the resolution.",
      },
      {
        q: "Can GoodStanding.ai file my taxes?",
        a: "GoodStanding.ai handles compliance filings (annual reports, franchise tax, BOI reports) and government liaison calls — not income tax preparation. For corporate income tax returns (Form 1120, etc.), you'll need a CPA or tax preparer. We can recommend partners.",
      },
    ],
  },
  {
    heading: "International Founders",
    items: [
      {
        q: "Can I form a US company if I'm not a US citizen?",
        a: "Yes. Non-US citizens can form and own US corporations and LLCs without any visa or immigration requirements. GoodStanding.ai provides a US registered agent address for Delaware — no US address of your own is needed.",
        link: { label: "International founders guide", href: "/international" },
      },
      {
        q: "How do I get an EIN without a Social Security Number?",
        a: "International founders without an SSN or ITIN can apply for an EIN using Form SS-4 by fax or mail to the IRS. The process takes 4–6 weeks. GoodStanding.ai guides you through the application and helps you prepare the required information.",
      },
      {
        q: "Do international founders need to pay US taxes?",
        a: "Delaware requires an annual franchise tax (minimum $400) regardless of where the company operates. Federal corporate taxes generally apply only to US-sourced income. If your customers and operations are entirely outside the US, federal income tax exposure may be minimal — but consult a CPA for your specific situation.",
      },
    ],
  },
]

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: categories.flatMap((cat) =>
    cat.items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    }))
  ),
}

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />

      <main className="flex-1 pt-24 pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">Support</p>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
              Frequently asked questions
            </h1>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Everything you need to know about startup compliance, formation, and the GoodStanding.ai platform.
            </p>
          </div>

          {/* Category index */}
          <nav className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-12">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Jump to</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <a
                  key={cat.heading}
                  href={`#${cat.heading.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                  className="text-sm text-slate-600 hover:text-emerald-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:border-emerald-300 transition-colors"
                >
                  {cat.heading}
                </a>
              ))}
            </div>
          </nav>

          {/* FAQ sections */}
          <div className="space-y-14">
            {categories.map((cat) => (
              <section
                key={cat.heading}
                id={cat.heading.toLowerCase().replace(/[^a-z]+/g, "-")}
                className="scroll-mt-24"
              >
                <h2 className="text-xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-200">
                  {cat.heading}
                </h2>
                <div className="space-y-6">
                  {cat.items.map(({ q, a, link }) => (
                    <div key={q}>
                      <h3 className="text-sm font-bold text-slate-900 mb-2">{q}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{a}</p>
                      {link && (
                        <Link
                          href={link.href}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mt-2 hover:underline"
                        >
                          {link.label}
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 bg-[#0F1829] rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Still have questions?</h2>
            <p className="text-slate-400 text-sm mb-5">
              Our team responds within one business day.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors"
            >
              Contact us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
