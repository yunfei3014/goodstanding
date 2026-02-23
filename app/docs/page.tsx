import type { Metadata } from "next"
import Navbar from "@/components/marketing/Navbar"
import Footer from "@/components/marketing/Footer"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "API Reference — GoodStanding.ai",
  description: "REST API reference for GoodStanding.ai. Manage companies, filings, and compliance data programmatically.",
  openGraph: {
    title: "API Reference — GoodStanding.ai",
    description: "REST API reference for GoodStanding.ai.",
    url: "https://goodstanding.ai/docs",
  },
  twitter: { card: "summary_large_image" },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET:    "bg-emerald-50 text-emerald-700 border-emerald-200",
    POST:   "bg-blue-50   text-blue-700   border-blue-200",
    PATCH:  "bg-amber-50  text-amber-700  border-amber-200",
    DELETE: "bg-red-50    text-red-700    border-red-200",
  }
  return (
    <span className={`inline-flex items-center font-mono text-xs font-bold px-2 py-0.5 rounded border ${colors[method] ?? "bg-slate-100 text-slate-600"}`}>
      {method}
    </span>
  )
}

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  return (
    <div className="bg-[#0f172a] rounded-xl overflow-hidden">
      {lang && (
        <div className="px-4 py-2 border-b border-slate-700">
          <span className="text-xs text-slate-500 font-mono">{lang}</span>
        </div>
      )}
      <pre className="p-4 text-sm text-emerald-400 overflow-x-auto leading-relaxed font-mono whitespace-pre">{code}</pre>
    </div>
  )
}

function Param({ name, type, required, description }: {
  name: string
  type: string
  required?: boolean
  description: string
}) {
  return (
    <div className="py-3 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-2 mb-1">
        <code className="text-sm font-mono font-bold text-slate-800">{name}</code>
        <span className="text-xs font-mono text-slate-400">{type}</span>
        {required && (
          <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">required</span>
        )}
      </div>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  )
}

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return <section id={id} className="scroll-mt-24">{children}</section>
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">

            {/* ── Sidebar nav ─────────────────────────────────────────────── */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Getting started</p>
                  <ul className="space-y-1">
                    {[
                      { href: "#overview",       label: "Overview" },
                      { href: "#authentication", label: "Authentication" },
                      { href: "#errors",         label: "Errors" },
                    ].map(({ href, label }) => (
                      <li key={href}>
                        <a href={href} className="block text-sm text-slate-600 hover:text-emerald-600 py-0.5 transition-colors">
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Endpoints</p>
                  <ul className="space-y-1">
                    {[
                      { href: "#list-companies",  label: "List companies" },
                      { href: "#get-company",     label: "Get company" },
                      { href: "#list-filings",    label: "List filings" },
                      { href: "#patch-filing",    label: "Update filing" },
                    ].map(({ href, label }) => (
                      <li key={href}>
                        <a href={href} className="block text-sm text-slate-600 hover:text-emerald-600 py-0.5 transition-colors">
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Webhooks</p>
                  <ul className="space-y-1">
                    {[
                      { href: "#webhooks-overview",  label: "Overview" },
                      { href: "#webhook-events",     label: "Events" },
                      { href: "#webhook-security",   label: "Verifying signatures" },
                    ].map(({ href, label }) => (
                      <li key={href}>
                        <a href={href} className="block text-sm text-slate-600 hover:text-emerald-600 py-0.5 transition-colors">
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>

            {/* ── Main content ─────────────────────────────────────────────── */}
            <main className="min-w-0 space-y-16">

              {/* Header */}
              <div>
                <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                  v1
                </div>
                <h1 className="text-4xl font-black text-[#1B2B4B] tracking-tight mb-4">
                  API Reference
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl">
                  The GoodStanding REST API lets you read company data, list filings, and update filing status programmatically.
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <Link href="/signup" className="inline-flex items-center gap-2 bg-[#1B2B4B] hover:bg-[#243461] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                    Get an API key
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/dashboard/integrations" className="text-sm text-slate-600 hover:text-slate-900 font-semibold transition-colors">
                    Manage API keys →
                  </Link>
                </div>
              </div>

              {/* Overview */}
              <Section id="overview">
                <h2 className="text-2xl font-bold text-[#1B2B4B] mb-4">Overview</h2>
                <div className="prose prose-slate max-w-none text-slate-600">
                  <p className="text-base mb-4">
                    All API requests go to the base URL:
                  </p>
                  <CodeBlock code="https://goodstanding.ai/api/v1" lang="Base URL" />
                  <p className="text-base mt-4 mb-4">
                    Requests and responses use JSON. All dates are in ISO 8601 format (<code className="text-sm font-mono bg-slate-100 px-1 rounded">YYYY-MM-DD</code> for dates, full ISO strings for timestamps).
                  </p>
                </div>
              </Section>

              {/* Authentication */}
              <Section id="authentication">
                <h2 className="text-2xl font-bold text-[#1B2B4B] mb-2">Authentication</h2>
                <p className="text-slate-600 mb-4">
                  Authenticate using your API key in the <code className="text-sm font-mono bg-slate-100 px-1 rounded">Authorization</code> header.
                  API keys are prefixed with <code className="text-sm font-mono bg-slate-100 px-1 rounded">gsa_</code> and can be created in your{" "}
                  <Link href="/dashboard/integrations" className="text-emerald-600 hover:text-emerald-800 font-medium">Integrations settings</Link>.
                </p>
                <CodeBlock
                  code={`curl https://goodstanding.ai/api/v1/companies \\
  -H "Authorization: Bearer gsa_your_api_key_here"`}
                />
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                  <strong>Keep your API key secret.</strong> Treat it like a password — never commit it to source control or expose it client-side. If compromised, revoke it immediately in your Integrations settings.
                </div>
              </Section>

              {/* Errors */}
              <Section id="errors">
                <h2 className="text-2xl font-bold text-[#1B2B4B] mb-2">Errors</h2>
                <p className="text-slate-600 mb-4">
                  The API uses standard HTTP status codes. Error responses include an <code className="font-mono text-sm bg-slate-100 px-1 rounded">error</code> field with a human-readable message.
                </p>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  {[
                    { code: "200", label: "OK",                  desc: "Request succeeded" },
                    { code: "400", label: "Bad Request",         desc: "Invalid parameters or request body" },
                    { code: "401", label: "Unauthorized",        desc: "Missing or invalid API key" },
                    { code: "404", label: "Not Found",           desc: "Resource not found or doesn't belong to your account" },
                    { code: "500", label: "Internal Server Error", desc: "Something went wrong on our end" },
                  ].map(({ code, label, desc }, i) => (
                    <div key={code} className={`flex items-center gap-4 px-4 py-3 ${i > 0 ? "border-t border-slate-100" : ""}`}>
                      <code className="text-sm font-mono font-bold text-slate-700 w-12">{code}</code>
                      <span className="text-sm font-semibold text-slate-700 w-40">{label}</span>
                      <span className="text-sm text-slate-500">{desc}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <CodeBlock
                    code={`{
  "error": "Company not found"
}`}
                    lang="Error response"
                  />
                </div>
              </Section>

              {/* Divider */}
              <div className="border-t border-slate-100" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest -mt-8">Endpoints</p>

              {/* List companies */}
              <Section id="list-companies">
                <div className="flex items-center gap-3 mb-3">
                  <MethodBadge method="GET" />
                  <code className="text-base font-mono text-slate-800">/api/v1/companies</code>
                </div>
                <h2 className="text-xl font-bold text-[#1B2B4B] mb-2">List companies</h2>
                <p className="text-slate-600 mb-4">
                  Returns all companies belonging to the authenticated user, ordered by creation date.
                </p>
                <CodeBlock
                  code={`curl https://goodstanding.ai/api/v1/companies \\
  -H "Authorization: Bearer gsa_your_api_key"`}
                />
                <h3 className="text-sm font-bold text-slate-700 mt-6 mb-3">Response</h3>
                <CodeBlock
                  code={`{
  "object": "list",
  "count": 2,
  "data": [
    {
      "id": "uuid",
      "name": "Acme Corp",
      "entity_type": "c_corp",
      "state_of_incorporation": "DE",
      "status": "good_standing",
      "ein": "12-3456789",
      "formed_at": "2024-01-15",
      "plan": "professional",
      "created_at": "2024-01-15T10:00:00.000Z"
    }
  ]
}`}
                  lang="JSON"
                />
              </Section>

              {/* Get company */}
              <Section id="get-company">
                <div className="flex items-center gap-3 mb-3">
                  <MethodBadge method="GET" />
                  <code className="text-base font-mono text-slate-800">/api/v1/companies/:id</code>
                </div>
                <h2 className="text-xl font-bold text-[#1B2B4B] mb-2">Get company</h2>
                <p className="text-slate-600 mb-4">
                  Returns a single company by ID. Includes a <code className="font-mono text-sm bg-slate-100 px-1 rounded">filing_counts</code> summary.
                </p>
                <CodeBlock
                  code={`curl https://goodstanding.ai/api/v1/companies/YOUR_COMPANY_ID \\
  -H "Authorization: Bearer gsa_your_api_key"`}
                />
                <h3 className="text-sm font-bold text-slate-700 mt-6 mb-3">Response</h3>
                <CodeBlock
                  code={`{
  "id": "uuid",
  "name": "Acme Corp",
  "entity_type": "c_corp",
  "state_of_incorporation": "DE",
  "status": "good_standing",
  "ein": "12-3456789",
  "formed_at": "2024-01-15",
  "plan": "professional",
  "created_at": "2024-01-15T10:00:00.000Z",
  "filing_counts": {
    "total": 8,
    "overdue": 0,
    "pending": 5,
    "completed": 3
  }
}`}
                  lang="JSON"
                />
              </Section>

              {/* List filings */}
              <Section id="list-filings">
                <div className="flex items-center gap-3 mb-3">
                  <MethodBadge method="GET" />
                  <code className="text-base font-mono text-slate-800">/api/v1/companies/:id/filings</code>
                </div>
                <h2 className="text-xl font-bold text-[#1B2B4B] mb-2">List filings</h2>
                <p className="text-slate-600 mb-4">
                  Returns all filings for a company, ordered by due date. Optionally filter by status.
                </p>
                <h3 className="text-sm font-bold text-slate-700 mb-3">Query parameters</h3>
                <div className="border border-slate-200 rounded-xl px-4 mb-4">
                  <Param
                    name="status"
                    type="string"
                    description={`Filter results by status. One of: pending, overdue, completed, not_required.`}
                  />
                </div>
                <CodeBlock
                  code={`# All filings
curl https://goodstanding.ai/api/v1/companies/YOUR_COMPANY_ID/filings \\
  -H "Authorization: Bearer gsa_your_api_key"

# Only overdue filings
curl "https://goodstanding.ai/api/v1/companies/YOUR_COMPANY_ID/filings?status=overdue" \\
  -H "Authorization: Bearer gsa_your_api_key"`}
                />
                <h3 className="text-sm font-bold text-slate-700 mt-6 mb-3">Response</h3>
                <CodeBlock
                  code={`{
  "object": "list",
  "company": { "id": "uuid", "name": "Acme Corp" },
  "count": 3,
  "data": [
    {
      "id": "uuid",
      "type": "Delaware Franchise Tax",
      "state": "DE",
      "due_date": "2026-03-01",
      "status": "pending",
      "filed_at": null,
      "amount": 400,
      "notes": null,
      "created_at": "2024-01-15T10:00:00.000Z"
    }
  ]
}`}
                  lang="JSON"
                />
              </Section>

              {/* PATCH filing */}
              <Section id="patch-filing">
                <div className="flex items-center gap-3 mb-3">
                  <MethodBadge method="PATCH" />
                  <code className="text-base font-mono text-slate-800">/api/v1/companies/:id/filings/:filingId</code>
                </div>
                <h2 className="text-xl font-bold text-[#1B2B4B] mb-2">Update filing</h2>
                <p className="text-slate-600 mb-4">
                  Update a filing's status, amount, notes, or filed date. When you mark a filing as <code className="font-mono text-sm bg-slate-100 px-1 rounded">completed</code>, the company's good-standing status is automatically recalculated.
                </p>
                <h3 className="text-sm font-bold text-slate-700 mb-3">Request body</h3>
                <div className="border border-slate-200 rounded-xl px-4 mb-4">
                  <Param name="status"   type="string" description={`New filing status. One of: pending, completed, not_required. Cannot set to overdue via API (set automatically by the daily cron).`} />
                  <Param name="amount"   type="number" description="Filing fee or tax amount in USD." />
                  <Param name="filed_at" type="string" description="ISO date (YYYY-MM-DD) when the filing was submitted. Auto-set to today when status is changed to completed if not provided." />
                  <Param name="notes"    type="string" description="Internal notes about this filing. Max 1000 characters." />
                </div>
                <CodeBlock
                  code={`curl -X PATCH https://goodstanding.ai/api/v1/companies/COMPANY_ID/filings/FILING_ID \\
  -H "Authorization: Bearer gsa_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "status": "completed",
    "amount": 400,
    "notes": "Paid via Delaware online portal"
  }'`}
                />
                <h3 className="text-sm font-bold text-slate-700 mt-6 mb-3">Response</h3>
                <p className="text-sm text-slate-600 mb-3">Returns the updated filing object.</p>
                <CodeBlock
                  code={`{
  "id": "uuid",
  "type": "Delaware Franchise Tax",
  "state": "DE",
  "due_date": "2026-03-01",
  "status": "completed",
  "filed_at": "2026-02-15",
  "amount": 400,
  "notes": "Paid via Delaware online portal",
  "created_at": "2024-01-15T10:00:00.000Z"
}`}
                  lang="JSON"
                />
              </Section>

              {/* Divider */}
              <div className="border-t border-slate-100" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest -mt-8">Webhooks</p>

              {/* Webhooks overview */}
              <Section id="webhooks-overview">
                <h2 className="text-2xl font-bold text-[#1B2B4B] mb-2">Webhooks overview</h2>
                <p className="text-slate-600 mb-4">
                  GoodStanding can POST real-time compliance events to any HTTPS endpoint you configure. Configure webhook endpoints in your{" "}
                  <Link href="/dashboard/integrations" className="text-emerald-600 hover:text-emerald-800 font-medium">Integrations settings</Link>.
                </p>
                <p className="text-slate-600 mb-4">
                  All webhook requests include:
                </p>
                <ul className="text-slate-600 space-y-1 mb-4 list-disc list-inside">
                  <li><code className="font-mono text-sm bg-slate-100 px-1 rounded">Content-Type: application/json</code></li>
                  <li><code className="font-mono text-sm bg-slate-100 px-1 rounded">User-Agent: GoodStanding-Webhook/1.0</code></li>
                  <li><code className="font-mono text-sm bg-slate-100 px-1 rounded">X-GoodStanding-Event</code> — the event type</li>
                  <li><code className="font-mono text-sm bg-slate-100 px-1 rounded">X-GoodStanding-Signature</code> — HMAC-SHA256 signature (if signing secret is set)</li>
                </ul>
                <p className="text-slate-600">
                  Your endpoint must respond with a 2xx status code within 8 seconds. Failures are silently absorbed — webhooks are best-effort and not retried.
                </p>
              </Section>

              {/* Webhook events */}
              <Section id="webhook-events">
                <h2 className="text-2xl font-bold text-[#1B2B4B] mb-2">Events</h2>
                <div className="space-y-6">
                  {[
                    {
                      event: "filing.overdue",
                      description: "Fires when a filing's due date passes and it is marked overdue.",
                      payload: `{
  "event": "filing.overdue",
  "timestamp": "2026-03-02T08:00:00.000Z",
  "data": {
    "filingId": "uuid",
    "type": "Delaware Franchise Tax",
    "state": "DE",
    "dueDate": "2026-03-01",
    "daysOverdue": 1,
    "companyName": "Acme Corp",
    "amount": 400
  }
}`,
                    },
                    {
                      event: "filing.upcoming",
                      description: "Fires on days matching your configured reminder schedule (e.g. 7, 14, 30 days before due date).",
                      payload: `{
  "event": "filing.upcoming",
  "timestamp": "2026-02-22T08:00:00.000Z",
  "data": {
    "filingId": "uuid",
    "type": "Delaware Franchise Tax",
    "state": "DE",
    "dueDate": "2026-03-01",
    "daysUntilDue": 7,
    "companyName": "Acme Corp",
    "amount": 400
  }
}`,
                    },
                    {
                      event: "digest.weekly",
                      description: "Fires every Monday with a summary of all upcoming (30 days) and overdue filings.",
                      payload: `{
  "event": "digest.weekly",
  "timestamp": "2026-02-24T08:00:00.000Z",
  "data": {
    "upcomingCount": 2,
    "overdueCount": 0,
    "upcoming": [
      {
        "filingId": "uuid",
        "type": "Delaware Franchise Tax",
        "state": "DE",
        "dueDate": "2026-03-01",
        "daysUntilDue": 5,
        "companyName": "Acme Corp"
      }
    ],
    "overdue": []
  }
}`,
                    },
                  ].map(({ event, description, payload }) => (
                    <div key={event}>
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-sm font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{event}</code>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{description}</p>
                      <CodeBlock code={payload} lang="JSON payload" />
                    </div>
                  ))}
                </div>
              </Section>

              {/* Webhook security */}
              <Section id="webhook-security">
                <h2 className="text-2xl font-bold text-[#1B2B4B] mb-2">Verifying signatures</h2>
                <p className="text-slate-600 mb-4">
                  Each webhook endpoint has a unique signing secret. When set, we compute an HMAC-SHA256 signature over the raw request body and include it in the{" "}
                  <code className="font-mono text-sm bg-slate-100 px-1 rounded">X-GoodStanding-Signature</code> header as{" "}
                  <code className="font-mono text-sm bg-slate-100 px-1 rounded">sha256=&lt;hex-digest&gt;</code>.
                </p>
                <p className="text-slate-600 mb-4">
                  Always verify the signature before processing the event to prevent replay attacks or spoofed requests.
                </p>
                <CodeBlock
                  code={`// Node.js / Edge Runtime example
import { createHmac, timingSafeEqual } from "crypto"

export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const expected = "sha256=" + createHmac("sha256", secret)
    .update(body, "utf8")
    .digest("hex")
  return timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature)
  )
}

// In your handler:
const rawBody = await req.text()
const sig = req.headers.get("X-GoodStanding-Signature") ?? ""
if (!verifyWebhookSignature(rawBody, sig, process.env.WEBHOOK_SECRET!)) {
  return new Response("Invalid signature", { status: 401 })
}
const event = JSON.parse(rawBody)`}
                  lang="TypeScript"
                />
              </Section>

              {/* CTA */}
              <div className="bg-slate-50 rounded-2xl p-10 border border-slate-200 text-center">
                <h2 className="text-2xl font-bold text-[#1B2B4B] mb-3">
                  Ready to integrate?
                </h2>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                  Sign up for free, create an API key in your Integrations settings, and start building.
                </p>
                <Link href="/signup" className="inline-flex items-center gap-2 bg-[#1B2B4B] hover:bg-[#243461] text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors">
                  Get started free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
