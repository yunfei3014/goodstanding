import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/**
 * GET /api/cal/[userId]/[token].ics
 * Returns an iCal feed of pending and overdue filings for the user.
 * The token provides basic URL obscurity (stored client-side).
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  const { pathname } = req.nextUrl

  // Extract filename — expected to be [token].ics
  const filename = pathname.split("/").pop() ?? ""
  if (!filename.endsWith(".ics") || !userId) {
    return new NextResponse("Not found", { status: 404 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    return new NextResponse("Server configuration error", { status: 500 })
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  })

  // Get all companies for this user
  const { data: companies } = await supabase
    .from("companies")
    .select("id, name")
    .eq("user_id", userId)

  if (!companies?.length) {
    return new NextResponse(buildEmptyCalendar(), {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": "attachment; filename=goodstanding.ics",
        "Cache-Control": "no-cache, no-store",
      },
    })
  }

  // Get pending and overdue filings
  const { data: filings } = await supabase
    .from("filings")
    .select("*")
    .in("company_id", companies.map((c) => c.id))
    .in("status", ["pending", "overdue"])
    .not("due_date", "is", null)
    .order("due_date", { ascending: true })

  const companyMap = Object.fromEntries(companies.map((c) => [c.id, c.name]))
  const ical = buildCalendar(filings ?? [], companyMap)

  return new NextResponse(ical, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="goodstanding-compliance.ics"',
      "Cache-Control": "no-cache, no-store",
      "X-WR-CALNAME": "GoodStanding Compliance",
    },
  })
}

// ─── iCal helpers ─────────────────────────────────────────────────────────────

function icalDate(dateStr: string): string {
  // YYYY-MM-DD → 20260301 (DATE-only value)
  return dateStr.replace(/-/g, "")
}

function escape(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n")
}

function buildCalendar(
  filings: Array<{
    id: string
    type: string
    state: string
    due_date: string | null
    status: string
    amount?: number | null
    notes?: string | null
    company_id: string
  }>,
  companyMap: Record<string, string>
): string {
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"

  const events = filings
    .filter((f) => f.due_date)
    .map((f) => {
      const companyName = companyMap[f.company_id] ?? "Company"
      const summary = escape(`[${f.status === "overdue" ? "OVERDUE" : "DUE"}] ${f.type} — ${companyName}`)
      const description = escape(
        [
          `Type: ${f.type}`,
          `Jurisdiction: ${f.state}`,
          `Status: ${f.status}`,
          f.amount ? `Amount: $${f.amount}` : null,
          f.notes ? `Notes: ${f.notes}` : null,
          `\nManage at https://goodstanding.ai/dashboard/compliance`,
        ]
          .filter(Boolean)
          .join("\\n")
      )
      const date = icalDate(f.due_date!)
      const uid = `${f.id}@goodstanding.ai`

      return [
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${now}`,
        `DTSTART;VALUE=DATE:${date}`,
        `DTEND;VALUE=DATE:${date}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        f.status === "overdue"
          ? "PRIORITY:1"
          : "PRIORITY:5",
        "END:VEVENT",
      ].join("\r\n")
    })

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//GoodStanding.ai//Compliance Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:GoodStanding Compliance",
    "X-WR-CALDESC:Filing deadlines from GoodStanding.ai",
    "X-WR-TIMEZONE:America/New_York",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n")
}

function buildEmptyCalendar(): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//GoodStanding.ai//Compliance Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:GoodStanding Compliance",
    "END:VCALENDAR",
  ].join("\r\n")
}
