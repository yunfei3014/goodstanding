import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import {
  sendDeadlineReminder,
  sendOverdueAlert,
  type UpcomingFiling,
  type OverdueFiling,
} from "@/lib/email"

/**
 * GET /api/cron/send-reminders
 * Daily cron (8 AM UTC) — emails users about upcoming and overdue filings
 * based on their saved notification preferences.
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization")
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    return new NextResponse("Server configuration error", { status: 500 })
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // ── Load all users with email reminders enabled ──────────────────────────

  const { data: prefs } = await supabase
    .from("user_preferences")
    .select("user_id, email_days, email_overdue_alerts")
    .eq("email_enabled", true)

  if (!prefs?.length) {
    return NextResponse.json({ ok: true, emailsSent: 0, runAt: new Date().toISOString() })
  }

  // ── Load auth users (email addresses) via service role ──────────────────

  const userIds = prefs.map((p) => p.user_id)
  const { data: authUsers } = await supabase.auth.admin.listUsers()
  const emailMap: Record<string, string> = {}
  for (const u of authUsers?.users ?? []) {
    if (userIds.includes(u.id) && u.email) {
      emailMap[u.id] = u.email
    }
  }

  // ── Load all companies for these users ───────────────────────────────────

  const { data: companies } = await supabase
    .from("companies")
    .select("id, name, user_id")
    .in("user_id", userIds)

  if (!companies?.length) {
    return NextResponse.json({ ok: true, emailsSent: 0, runAt: new Date().toISOString() })
  }

  const companyIds = companies.map((c) => c.id)
  const companyMap = Object.fromEntries(companies.map((c) => [c.id, c]))

  // ── Load pending filings ─────────────────────────────────────────────────

  const { data: filings } = await supabase
    .from("filings")
    .select("id, company_id, type, state, due_date, status, amount")
    .in("company_id", companyIds)
    .in("status", ["pending", "overdue"])
    .not("due_date", "is", null)

  if (!filings?.length) {
    return NextResponse.json({ ok: true, emailsSent: 0, runAt: new Date().toISOString() })
  }

  // ── Send emails per user ─────────────────────────────────────────────────

  let emailsSent = 0

  for (const pref of prefs) {
    const toEmail = emailMap[pref.user_id]
    if (!toEmail) continue

    const userCompanyIds = companies
      .filter((c) => c.user_id === pref.user_id)
      .map((c) => c.id)

    const userFilings = filings.filter((f) => userCompanyIds.includes(f.company_id))
    if (!userFilings.length) continue

    // Upcoming reminders
    const upcomingToSend: UpcomingFiling[] = []
    for (const f of userFilings) {
      if (f.status !== "pending" || !f.due_date) continue
      const dueDate = new Date(f.due_date)
      dueDate.setHours(0, 0, 0, 0)
      const daysUntilDue = Math.round((dueDate.getTime() - today.getTime()) / 86_400_000)
      if ((pref.email_days as number[]).includes(daysUntilDue)) {
        upcomingToSend.push({
          id: f.id,
          type: f.type,
          state: f.state,
          due_date: f.due_date,
          amount: f.amount,
          companyName: companyMap[f.company_id]?.name ?? "Your company",
          daysUntilDue,
        })
      }
    }

    if (upcomingToSend.length > 0) {
      try {
        await sendDeadlineReminder(toEmail, upcomingToSend)
        emailsSent++
      } catch (err) {
        console.error(`Failed to send reminder to ${toEmail}:`, err)
      }
    }

    // Overdue alerts (only send on the day they become overdue, i.e. daysOverdue === 0)
    if (pref.email_overdue_alerts) {
      const overdueToday: OverdueFiling[] = []
      for (const f of userFilings) {
        if (f.status !== "overdue" || !f.due_date) continue
        const dueDate = new Date(f.due_date)
        dueDate.setHours(0, 0, 0, 0)
        const daysOverdue = Math.round((today.getTime() - dueDate.getTime()) / 86_400_000)
        // Only alert on the exact day it became overdue (daysOverdue === 0 or 1 after cron runs)
        if (daysOverdue <= 1) {
          overdueToday.push({
            id: f.id,
            type: f.type,
            state: f.state,
            due_date: f.due_date,
            amount: f.amount,
            companyName: companyMap[f.company_id]?.name ?? "Your company",
            daysOverdue,
          })
        }
      }
      if (overdueToday.length > 0) {
        try {
          await sendOverdueAlert(toEmail, overdueToday)
          emailsSent++
        } catch (err) {
          console.error(`Failed to send overdue alert to ${toEmail}:`, err)
        }
      }
    }
  }

  return NextResponse.json({
    ok: true,
    emailsSent,
    usersChecked: prefs.length,
    runAt: new Date().toISOString(),
  })
}
