import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/marketing/Navbar"
import Footer from "@/components/marketing/Footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Award } from "lucide-react"

export const metadata: Metadata = {
  title: "About — GoodStanding.ai",
  description: "GoodStanding.ai was built for founders who shouldn't need a lawyer to stay compliant. Learn about our mission to make startup compliance simple and stress-free.",
  openGraph: {
    title: "About — GoodStanding.ai",
    description: "Built for founders who shouldn't need a lawyer to stay compliant.",
    url: "https://goodstanding.ai/about",
  },
  twitter: { card: "summary_large_image" },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 mb-8">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span className="text-sm text-emerald-700 font-medium">
                For startups. By someone who&apos;s been on hold with the IRS so you don&apos;t have to.
              </span>
            </div>
            <h1 className="text-5xl font-bold text-[#1B2B4B] mb-6">
              The mission: make compliance invisible for founders.
            </h1>
          </div>

          {/* Story */}
          <div className="prose max-w-none">
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 mb-10">
              <p className="text-slate-700 text-lg leading-relaxed mb-4">
                I spent years helping founders at SPC and in my own consulting practice. Every
                single one of them had the same story: compliance was a mess. Annual reports
                filed late (or not at all). Registered agents lapsed. States sending penalty
                notices that sat unopened for months because nobody knew what to do with them.
              </p>
              <p className="text-slate-700 text-lg leading-relaxed mb-4">
                And the IRS. Nobody wants to deal with the IRS. I&apos;ve spent hours on hold
                — for my own company, for clients, for friends who got a scary letter and
                didn&apos;t know if they were in trouble.
              </p>
              <p className="text-slate-700 text-lg leading-relaxed">
                Then I realized: AI can do 80% of this work. And with an Enrolled Agent
                credential, a licensed professional can do the rest — government calls,
                IRS representation, state agency resolution — in a fraction of the time it
                takes a founder to even figure out who to call.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-[#1B2B4B] mb-4">
              Why we built it this way
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Formation services race to zero because formation is a commodity. GoodStanding.ai
              agrees — that&apos;s why formation is free. We make money on the ongoing
              relationship: registered agent, compliance monitoring, government liaison.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              The real value isn&apos;t the filing. It&apos;s knowing about the filing before
              it&apos;s late. It&apos;s having someone who can call the IRS when something
              goes wrong. It&apos;s having a system that grows with your compliance surface
              as you hire in new states, raise capital, and add entities.
            </p>

            <h2 className="text-2xl font-bold text-[#1B2B4B] mb-4">
              The credential that matters
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              The Enrolled Agent (EA) credential is the highest IRS credential available — granted
              by the IRS itself. It gives unlimited authority to represent any taxpayer before any
              IRS office, for any tax matter. Every.io doesn&apos;t have it. doola doesn&apos;t have
              it. LegalZoom doesn&apos;t have it.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8">
              This is the moat. Not because it&apos;s particularly hard to get (it&apos;s a rigorous exam,
              but it&apos;s passable with dedication) — but because nobody building startup compliance
              software thought they needed it. We built the whole product around it.
            </p>

            <h2 className="text-2xl font-bold text-[#1B2B4B] mb-4">
              Who we serve
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                {
                  title: "First-time founders",
                  desc: "Just incorporated — now what? We handle everything from day zero.",
                },
                {
                  title: "Repeat founders",
                  desc: "You've seen compliance disasters before. You know what good looks like. We are it.",
                },
                {
                  title: "International founders",
                  desc: "Chinese-speaking team. US entity formation without SSN. We translate the government for you.",
                },
                {
                  title: "Post-seed startups",
                  desc: "Just raised? VCs do diligence. If your compliance is messy, the deal slows down or dies.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-5">
                  <h3 className="font-semibold text-[#1B2B4B] mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#1B2B4B] rounded-2xl p-8 text-center">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                The mission is simple.
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6 max-w-xl mx-auto">
                Make compliance invisible. You should never think about annual reports, franchise tax,
                or IRS notices. That&apos;s our job. Yours is to build the product.
              </p>
              <Link href="/signup">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  Start your company free
                  <ArrowRight className="w-4 h-4" />
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
