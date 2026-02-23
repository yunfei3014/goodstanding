import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import {
  sendDeadlineReminder,
  sendOverdueAlert,
  sendWeeklyDigest,
  type UpcomingFiling,
  type OverdueFiling,
} from "@/lib/email"
import { fireWebhooks } from "@/lib/webhook"
import {
  sendSlackMessage,
  buildOverdueBlocks,
  buildUpcomingBlocks,
  buildDigestBlocks,
} from "@/lib/slack"

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

  const isMonday = today.getDay() === 1

  // ── Load all users with email reminders enabled ──────────────────────────

  const { data: prefs } = await supabase
    .from("user_preferences")
    .select(
      "user_id, email_days, email_overdue_alerts, email_weekly_digest, " +
      "slack_webhook_url, slack_overdue_alerts, slack_upcoming_alerts, slack_weekly_digest"
    )
    .or("email_enabled.eq.true,slack_webhook_url.not.is.null")

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
      // Slack alert for upcoming filings
      if (pref.slack_webhook_url && pref.slack_upcoming_alerts) {
        const slackFilings = upcomingToSend.map((f) => ({
          type: f.type, state: f.state, due_date: f.due_date,
          companyName: f.companyName, daysUntilDue: f.daysUntilDue,
        }))
        await sendSlackMessage(
          pref.slack_webhook_url,
          `${upcomingToSend.length} filing${upcomingToSend.length !== 1 ? "s" : ""} coming up`,
          buildUpcomingBlocks(slackFilings)
        )
      }
      // Fire webhooks for upcoming filings
      for (const f of upcomingToSend) {
        await fireWebhooks(supabase, pref.user_id, "filing.upcoming", {
          filingId: f.id,
          type: f.type,
          state: f.state,
          dueDate: f.due_date,
          daysUntilDue: f.daysUntilDue,
          companyName: f.companyName,
          amount: f.amount ?? null,
        })
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
        // Slack alert for overdue filings
        if (pref.slack_webhook_url && pref.slack_overdue_alerts) {
          const slackFilings = overdueToday.map((f) => ({
            type: f.type, state: f.state, due_date: f.due_date,
            companyName: f.companyName, daysOverdue: f.daysOverdue,
          }))
          await sendSlackMessage(
            pref.slack_webhook_url,
            `⚠️ ${overdueToday.length} filing${overdueToday.length !== 1 ? "s" : ""} overdue`,
            buildOverdueBlocks(slackFilings)
          )
        }
        // Fire webhooks for overdue filings
        for (const f of overdueToday) {
          await fireWebhooks(supabase, pref.user_id, "filing.overdue", {
            filingId: f.id,
            type: f.type,
            state: f.state,
            dueDate: f.due_date,
            daysOverdue: f.daysOverdue,
            companyName: f.companyName,
            amount: f.amount ?? null,
          })
        }
      }
    }

    // Weekly digest — send every Monday if enabled
    if (isMonday && pref.email_weekly_digest) {
      // Skip if we already sent reminder/overdue for the same filings today
      // (digest covers upcoming 30 days + all overdue)
      const digestUpcoming: UpcomingFiling[] = []
      for (const f of userFilings) {
        if (f.status !== "pending" || !f.due_date) continue
        const dueDate = new Date(f.due_date)
        dueDate.setHours(0, 0, 0, 0)
        const daysUntilDue = Math.round((dueDate.getTime() - today.getTime()) / 86_400_000)
        if (daysUntilDue >= 0 && daysUntilDue <= 30) {
          digestUpcoming.push({
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
      const digestOverdue: OverdueFiling[] = userFilings
        .filter((f) => f.status === "overdue" && f.due_date)
        .map((f) => {
          const dueDate = new Date(f.due_date!)
          dueDate.setHours(0, 0, 0, 0)
          return {
            id: f.id,
            type: f.type,
            state: f.state,
            due_date: f.due_date!,
            amount: f.amount,
            companyName: companyMap[f.company_id]?.name ?? "Your company",
            daysOverdue: Math.round((today.getTime() - dueDate.getTime()) / 86_400_000),
          }
        })

      if (digestUpcoming.length > 0 || digestOverdue.length > 0) {
        try {
          await sendWeeklyDigest(toEmail, digestUpcoming, digestOverdue)
          emailsSent++
        } catch (err) {
          console.error(`Failed to send weekly digest to ${toEmail}:`, err)
        }
        // Slack weekly digest
        if (pref.slack_webhook_url && pref.slack_weekly_digest) {
          const slackUpcoming = digestUpcoming.map((f) => ({
            type: f.type, state: f.state, due_date: f.due_date,
            companyName: f.companyName, daysUntilDue: f.daysUntilDue,
          }))
          const slackOverdue = digestOverdue.map((f) => ({
            type: f.type, state: f.state, due_date: f.due_date,
            companyName: f.companyName, daysOverdue: f.daysOverdue,
          }))
          await sendSlackMessage(
            pref.slack_webhook_url,
            "Weekly compliance digest",
            buildDigestBlocks(slackUpcoming, slackOverdue)
          )
        }
        // Fire digest webhook
        await fireWebhooks(supabase, pref.user_id, "digest.weekly", {
          upcomingCount: digestUpcoming.length,
          overdueCount: digestOverdue.length,
          upcoming: digestUpcoming.map((f) => ({
            filingId: f.id, type: f.type, state: f.state,
            dueDate: f.due_date, daysUntilDue: f.daysUntilDue, companyName: f.companyName,
          })),
          overdue: digestOverdue.map((f) => ({
            filingId: f.id, type: f.type, state: f.state,
            dueDate: f.due_date, daysOverdue: f.daysOverdue, companyName: f.companyName,
          })),
        })
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
