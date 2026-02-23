import type { Metadata } from "next"
import Navbar from "@/components/marketing/Navbar"
import Footer from "@/components/marketing/Footer"
import { CheckCircle2, Zap, Shield, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "Changelog — GoodStanding.ai",
  description: "Track new features, improvements, and fixes shipped to GoodStanding.ai.",
  openGraph: {
    title: "Changelog — GoodStanding.ai",
    description: "Track new features, improvements, and fixes shipped to GoodStanding.ai.",
    url: "https://goodstanding.ai/changelog",
  },
  twitter: { card: "summary_large_image" },
}

type ChangeType = "feature" | "improvement" | "fix"

type Entry = {
  date: string
  version: string
  title: string
  description: string
  changes: { type: ChangeType; text: string }[]
}

const CHANGELOG: Entry[] = [
  {
    date: "February 2026",
    version: "1.0",
    title: "Slack integration, REST API v1, outgoing webhooks & developer platform",
    description: "Developer-first release: real Slack alerts via Incoming Webhooks, a full REST API with API key management, HMAC-signed outgoing webhooks, and the BOI report compliance guide.",
    changes: [
      { type: "feature", text: "Slack Incoming Webhook integration — paste your webhook URL to receive overdue alerts, upcoming deadline alerts, and weekly digests directly in any Slack channel" },
      { type: "feature", text: "Test button for Slack — verify the connection by sending a test message from the dashboard" },
      { type: "feature", text: "REST API v1 — GET /api/v1/companies, /companies/{id}, /companies/{id}/filings with Bearer API key auth" },
      { type: "feature", text: "API key management — create up to 5 named keys, view prefix + last-used date, revoke instantly" },
      { type: "feature", text: "Outgoing webhooks — HMAC-SHA256 signed POST requests to any HTTPS endpoint for filing.overdue, filing.upcoming, and digest.weekly events" },
      { type: "feature", text: "BOI report guide — new compliance resource covering FinCEN Beneficial Ownership Information filings, deadlines, penalties, and ongoing obligations" },
      { type: "improvement", text: "Slack cron integration — send-reminders cron now fires Slack Block Kit messages alongside emails for all three event types" },
      { type: "improvement", text: "Integrations page Developer section — API access and webhooks panels moved from Coming Soon to active" },
    ],
  },
  {
    date: "February 2026",
    version: "0.9",
    title: "Team collaboration, Stripe billing & email reminders",
    description: "Major release focused on making GoodStanding.ai a team product with real payment flows.",
    changes: [
      { type: "feature", text: "Team invite system — send email invites to collaborators with Admin, Member, or Viewer roles" },
      { type: "feature", text: "Stripe billing integration — upgrade, manage subscriptions, and view plan limits" },
      { type: "feature", text: "Email reminder system — deadline reminders, overdue alerts, and Monday weekly digests via Resend" },
      { type: "feature", text: "Data export — download all filings, documents, and company data as CSV or JSON" },
      { type: "feature", text: "iCal calendar feed — subscribe to filing deadlines in Google Calendar, Apple Calendar, or Outlook" },
      { type: "feature", text: "Public compliance status page — share a verified status link with investors or partners" },
      { type: "improvement", text: "Loading skeletons on every dashboard page for a polished perceived-performance experience" },
      { type: "improvement", text: "Notification preferences now persisted to Supabase (were localStorage-only)" },
      { type: "fix", text: "Fixed domain references: goodstanding.app → goodstanding.ai across all pages" },
    ],
  },
  {
    date: "January 2026",
    version: "0.8",
    title: "AI assistant, government liaison & filing dashboard",
    description: "Core product features: Claude-powered compliance assistant, government call tracking, and the main filing workflow.",
    changes: [
      { type: "feature", text: "AI compliance assistant powered by Claude — answers questions about your specific filings and deadlines" },
      { type: "feature", text: "Government liaison tracking — log and manage IRS/state agency calls with Enrolled Agent notes" },
      { type: "feature", text: "Compliance calendar — view all filing deadlines in a monthly calendar view" },
      { type: "feature", text: "Activity feed — audit log of all compliance events across all companies" },
      { type: "feature", text: "Compliance report — printable PDF-ready status report shareable with stakeholders" },
      { type: "feature", text: "Document vault — upload, organize, and tag compliance documents by type and company" },
      { type: "improvement", text: "Company detail page with compliance score ring, filing breakdown, and recent activity" },
      { type: "improvement", text: "Cmd+K global search across companies, filings, documents, and government interactions" },
    ],
  },
  {
    date: "December 2025",
    version: "0.7",
    title: "Multi-company support & smart filing defaults",
    description: "Support for multiple entities with auto-generated default compliance filings based on entity type and state.",
    changes: [
      { type: "feature", text: "Multi-company workspace — manage unlimited entities from one dashboard" },
      { type: "feature", text: "Auto-generated default filings on company creation (annual reports, federal taxes, state-specific)" },
      { type: "feature", text: "State-specific filing rules — California $800 minimum tax, NY biennial statement, DE franchise tax guidance" },
      { type: "feature", text: "Daily cron job to auto-mark overdue filings and sync company status" },
      { type: "improvement", text: "Company selector in sidebar — switch between entities with a click" },
      { type: "improvement", text: "Filing status badges: Filed, Pending, Overdue, N/A" },
    ],
  },
  {
    date: "November 2025",
    version: "0.6",
    title: "Authentication & onboarding flow",
    description: "End-to-end signup with company setup, email confirmation, and Supabase auth.",
    changes: [
      { type: "feature", text: "Email/password authentication with Supabase" },
      { type: "feature", text: "Multi-step onboarding: company name → entity type → state → plan → account creation" },
      { type: "feature", text: "Auth middleware protecting /dashboard routes" },
      { type: "feature", text: "Password reset flow via email" },
      { type: "improvement", text: "Post-confirmation company seeding via user metadata" },
    ],
  },
]

const TYPE_META: Record<ChangeType, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  feature:     { label: "New",   color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: Zap },
  improvement: { label: "Impr.", color: "text-blue-700",    bg: "bg-blue-50 border-blue-200",       icon: Star },
  fix:         { label: "Fix",   color: "text-slate-600",   bg: "bg-slate-100 border-slate-200",    icon: CheckCircle2 },
}

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-[#1B2B4B] rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Changelog</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
              What&apos;s new
            </h1>
            <p className="text-slate-500 text-lg">
              New features, improvements, and fixes — shipped continuously.
            </p>
          </div>

          {/* Entries */}
          <div className="space-y-16">
            {CHANGELOG.map((entry) => (
              <div key={entry.version} className="relative pl-6 border-l-2 border-slate-100">
                {/* Timeline dot */}
                <div className="absolute -left-[9px] top-1 w-4 h-4 bg-white border-2 border-[#1B2B4B] rounded-full" />

                {/* Date + version */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-semibold text-slate-400">{entry.date}</span>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                    v{entry.version}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-2">{entry.title}</h2>
                <p className="text-sm text-slate-500 mb-5 leading-relaxed">{entry.description}</p>

                {/* Changes */}
                <ul className="space-y-2">
                  {entry.changes.map((change, i) => {
                    const meta = TYPE_META[change.type]
                    const Icon = meta.icon
                    return (
                      <li key={i} className="flex items-start gap-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border flex-shrink-0 mt-0.5 ${meta.bg} ${meta.color}`}>
                          <Icon className="w-2.5 h-2.5" />
                          {meta.label}
                        </span>
                        <span className="text-sm text-slate-700 leading-relaxed">{change.text}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="mt-16 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm mb-4">
              GoodStanding.ai ships updates continuously. Follow along or try it for free.
            </p>
            <a
              href="/signup"
              className="inline-block px-6 py-3 bg-[#1B2B4B] text-white text-sm font-bold rounded-xl hover:bg-[#243461] transition-colors"
            >
              Start free →
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
