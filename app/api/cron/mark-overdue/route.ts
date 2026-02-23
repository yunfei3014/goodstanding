import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/**
 * Daily cron: marks all pending filings whose due_date < today as "overdue",
 * then re-syncs each affected company's status field.
 *
 * Vercel passes Authorization: Bearer <CRON_SECRET> automatically.
 * Set CRON_SECRET in Vercel project environment variables.
 */
export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Missing Supabase credentials" }, { status: 500 })
  }

  // Use service role client to bypass RLS
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  })

  const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD

  // 1. Mark all pending filings with due_date < today as overdue
  const { data: updatedFilings, error: updateError } = await supabase
    .from("filings")
    .update({ status: "overdue" })
    .eq("status", "pending")
    .lt("due_date", today)
    .select("company_id")

  if (updateError) {
    console.error("[cron/mark-overdue] filing update error:", updateError)
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  const markedCount = updatedFilings?.length ?? 0
  const affectedCompanyIds = [...new Set((updatedFilings ?? []).map((f) => f.company_id))]

  // 2. Re-sync company status for each affected company
  let companiesUpdated = 0
  for (const companyId of affectedCompanyIds) {
    const { data: companyFilings } = await supabase
      .from("filings")
      .select("status")
      .eq("company_id", companyId)

    const overdueCount = (companyFilings ?? []).filter((f) => f.status === "overdue").length
    const newStatus =
      overdueCount >= 3 ? "action_required"
      : overdueCount >= 1 ? "attention_needed"
      : "good_standing"

    const { error: companyUpdateError } = await supabase
      .from("companies")
      .update({ status: newStatus })
      .eq("id", companyId)

    if (!companyUpdateError) companiesUpdated++
  }

  console.log(
    `[cron/mark-overdue] done: ${markedCount} filings marked overdue, ${companiesUpdated} companies updated`
  )

  return NextResponse.json({
    ok: true,
    markedOverdue: markedCount,
    companiesUpdated,
    runAt: new Date().toISOString(),
  })
}
