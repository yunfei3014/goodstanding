import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/marketing/Navbar"
import Footer from "@/components/marketing/Footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Resources — GoodStanding.ai",
  description: "Compliance guides for startup founders. Delaware C-corps, IRS notices, franchise tax, foreign qualification — written by enrolled agents, not lawyers.",
  openGraph: {
    title: "Resources — GoodStanding.ai",
    description: "Compliance guides for startup founders. Written by enrolled agents.",
    url: "https://goodstanding.ai/resources",
  },
  twitter: { card: "summary_large_image" },
}

const articles = [
  {
    slug: "delaware-c-corp-formation",
    title: "How to Form a Delaware C-Corp for Your Startup",
    description:
      "Delaware is the default for VC-backed startups. Here's why, and exactly what you need to do — entity type, authorized shares, registered agent, EIN — in the right order.",
    category: "Formation",
    readTime: "8 min read",
    featured: true,
  },
  {
    slug: "irs-notice-startup",
    title: "What to Do When the IRS Sends Your Startup a Letter",
    description:
      "Don't panic. Most IRS notices are routine. Here's how to read what the IRS sent you, what it actually means, what the deadline is, and what happens if you ignore it.",
    category: "Government Liaison",
    readTime: "6 min read",
    featured: true,
  },
  {
    slug: "california-foreign-qualification",
    title: "Do You Need to Foreign-Qualify in California?",
    description:
      "If your startup is incorporated in Delaware but you have employees, an office, or significant sales in California — you almost certainly need to foreign-qualify. Here's how.",
    category: "Compliance",
    readTime: "5 min read",
    featured: true,
  },
  {
    slug: "startup-compliance-checklist",
    title: "Startup Compliance Checklist: Pre-Seed to Series A",
    description:
      "The complete compliance checklist from incorporation through your Series A. Annual reports, franchise tax, registered agent, foreign qualifications, board minutes — everything organized by stage.",
    category: "Compliance",
    readTime: "10 min read",
    featured: false,
  },
  {
    slug: "good-standing-explained",
    title: "Good Standing: What It Is and Why Your Startup Can't Afford to Lose It",
    description:
      "\"Good standing\" is a legal status your company must maintain to operate, raise capital, and sign contracts. Here's what it means, how you lose it, and how we prevent that.",
    category: "Foundation",
    readTime: "5 min read",
    featured: false,
  },
  {
    slug: "international-founder-us-entity",
    title: "How to Form a US Company as an International Founder",
    description:
      "Chinese founders, Indian founders, Canadian founders — the process is different when you don't have a US SSN. Here's exactly how to form a US entity, get an EIN, and open a bank account.",
    category: "International",
    readTime: "9 min read",
    featured: false,
  },
  {
    slug: "enrolled-agent-explainer",
    title: "What Is an Enrolled Agent? (And Why Your Compliance Provider Probably Doesn't Have One)",
    description:
      "The Enrolled Agent credential is the highest IRS designation — unlimited authority to represent taxpayers. Most startup compliance services don't have it. Here's why it matters.",
    category: "Government Liaison",
    readTime: "4 min read",
    featured: false,
  },
  {
    slug: "delaware-franchise-tax-guide",
    title: "Delaware Franchise Tax for Startups: The Authorized Shares Method",
    description:
      "Delaware franchise tax can look terrifying — $50,000+ bills for early-stage startups using the default calculation. Here's how to use the Assumed Par Value method to pay $400 instead.",
    category: "Compliance",
    readTime: "7 min read",
    featured: false,
  },
  {
    slug: "boi-report-guide",
    title: "BOI Report Guide: What Startups Need to Know About FinCEN",
    description:
      "The Corporate Transparency Act requires most small US companies to file a Beneficial Ownership Information report with FinCEN. Here's who has to file, what to disclose, and what happens if you miss the deadline.",
    category: "Compliance",
    readTime: "6 min read",
    featured: false,
  },
]

const categories = ["All", "Formation", "Compliance", "Government Liaison", "International", "Foundation"]

const categoryColors: Record<string, string> = {
  Formation: "bg-blue-50 text-blue-700",
  Compliance: "bg-emerald-50 text-emerald-700",
  "Government Liaison": "bg-purple-50 text-purple-700",
  International: "bg-amber-50 text-amber-700",
  Foundation: "bg-slate-100 text-slate-700",
}

export default function ResourcesPage() {
  const featured = articles.filter((a) => a.featured)
  const rest = articles.filter((a) => !a.featured)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-[#1B2B4B] mb-4">
              Startup compliance, explained.
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl">
              Plain-English guides on formation, filings, and everything the government expects from
              your startup — from day zero through Series A.
            </p>
          </div>

          {/* Featured */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {featured.map((article) => (
              <Link
                key={article.slug}
                href={`/resources/${article.slug}`}
                className="group bg-white border border-slate-200 rounded-2xl p-7 shadow-sm hover:shadow-md transition-all hover:border-slate-300"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[article.category] || "bg-slate-100 text-slate-700"}`}>
                    {article.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[#1B2B4B] mb-3 group-hover:text-emerald-600 transition-colors leading-snug">
                  {article.title}
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {article.description}
                </p>
              </Link>
            ))}
          </div>

          {/* Rest */}
          <h2 className="text-2xl font-bold text-[#1B2B4B] mb-6">More guides</h2>
          <div className="space-y-4">
            {rest.map((article) => (
              <Link
                key={article.slug}
                href={`/resources/${article.slug}`}
                className="group flex items-start gap-6 bg-white border border-slate-200 rounded-xl p-6 hover:shadow-sm transition-all hover:border-slate-300"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[article.category] || "bg-slate-100 text-slate-700"}`}>
                      {article.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#1B2B4B] mb-1 group-hover:text-emerald-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{article.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors flex-shrink-0 mt-1" />
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 bg-slate-50 rounded-2xl p-10 border border-slate-200 text-center">
            <h2 className="text-2xl font-bold text-[#1B2B4B] mb-3">
              Don&apos;t want to figure this out yourself?
            </h2>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Start your company free. We handle all of this — and everything that comes up after.
            </p>
            <Link href="/signup">
              <Button className="bg-[#1B2B4B] hover:bg-[#243461] text-white">
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
