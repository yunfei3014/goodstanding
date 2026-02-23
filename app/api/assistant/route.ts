import { NextRequest } from "next/server"

export const runtime = "edge"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

type CompanyContext = {
  name: string
  entityType: string
  state: string
  plan: string
  ein?: string
  formedAt?: string
  totalFilings: number
  overdueFilings: number
  pendingFilings: number
  completedFilings: number
  overdueTypes: string[]
  upcomingTypes: string[]
}

function buildSystemPrompt(ctx: CompanyContext | null): string {
  const base = `You are an expert compliance assistant for GoodStanding.ai, a business compliance management platform. You help founders and business owners stay on top of their state and federal compliance obligations.

You have deep expertise in:
- LLC, C-Corp, and S-Corp compliance requirements
- State annual reports and fees
- Federal filings (BOI reports, EIN maintenance, 1099s)
- Tax filing deadlines (quarterly estimated taxes, payroll taxes, sales tax)
- Registered agent requirements
- Foreign qualification
- Business license renewals

Your responses should be:
- Clear and actionable, not legalese
- Specific to the user's entity type and state when relevant
- Concise — 2–4 short paragraphs max
- Always note when something requires a licensed attorney or CPA
- Never give specific legal or tax advice — give general guidance and recommend professionals for specifics`

  if (!ctx) return base

  const entityLabel =
    ctx.entityType === "c_corp" ? "C-Corporation"
    : ctx.entityType === "s_corp" ? "S-Corporation"
    : "LLC"

  const statusNote =
    ctx.overdueFilings >= 3
      ? "⚠️ CRITICAL: This company has 3+ overdue filings and is at risk of losing good standing."
      : ctx.overdueFilings > 0
      ? `⚠️ ATTENTION: This company has ${ctx.overdueFilings} overdue filing${ctx.overdueFilings > 1 ? "s" : ""}.`
      : "✅ This company is in good standing with no overdue filings."

  return `${base}

---

COMPANY CONTEXT (always use this when relevant):
- Company: ${ctx.name}
- Entity type: ${entityLabel}
- State of incorporation: ${ctx.state}
- Plan: ${ctx.plan}
- EIN: ${ctx.ein ?? "not set"}
- Formed: ${ctx.formedAt ?? "not set"}

COMPLIANCE STATUS:
${statusNote}
- Total filings tracked: ${ctx.totalFilings}
- Completed/filed: ${ctx.completedFilings}
- Pending: ${ctx.pendingFilings}
- Overdue: ${ctx.overdueFilings}
${ctx.overdueTypes.length > 0 ? `- Overdue items: ${ctx.overdueTypes.join(", ")}` : ""}
${ctx.upcomingTypes.length > 0 ? `- Upcoming items: ${ctx.upcomingTypes.join(", ")}` : ""}

When the user asks about their specific company, use this context to give personalized, relevant answers.`
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }

  let messages: ChatMessage[]
  let companyContext: CompanyContext | null

  try {
    const body = await req.json()
    messages = body.messages ?? []
    companyContext = body.companyContext ?? null
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  if (!messages.length) {
    return new Response(JSON.stringify({ error: "No messages provided." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      stream: true,
      system: buildSystemPrompt(companyContext),
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  })

  if (!anthropicRes.ok) {
    const errText = await anthropicRes.text()
    return new Response(
      JSON.stringify({ error: `Anthropic API error: ${anthropicRes.status} ${errText}` }),
      { status: anthropicRes.status, headers: { "Content-Type": "application/json" } }
    )
  }

  // Pass the SSE stream directly through
  return new Response(anthropicRes.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  })
}
