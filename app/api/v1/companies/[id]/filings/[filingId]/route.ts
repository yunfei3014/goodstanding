import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { validateApiKey } from "@/lib/api-auth"

type Props = { params: Promise<{ id: string; filingId: string }> }

const VALID_STATUSES = ["pending", "completed", "not_required"]

/**
 * PATCH /api/v1/companies/{id}/filings/{filingId}
 * Update a filing's status, amount, notes, or filed_at date.
 *
 * Authorization: Bearer gsa_{key}
 *
 * Body (all fields optional):
 *   status:    "pending" | "completed" | "not_required"
 *   filed_at:  ISO date string (set automatically when status → completed)
 *   amount:    number (filing fee or tax amount in USD)
 *   notes:     string
 */
export async function PATCH(req: NextRequest, { params }: Props) {
  const userId = await validateApiKey(req.headers.get("authorization"))
  if (!userId) {
    return NextResponse.json({ error: "Invalid or missing API key" }, { status: 401 })
  }

  const { id: companyId, filingId } = await params

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  // Verify company ownership
  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("id", companyId)
    .eq("user_id", userId)
    .single()

  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 })
  }

  // Verify the filing belongs to this company
  const { data: existing } = await supabase
    .from("filings")
    .select("id, status")
    .eq("id", filingId)
    .eq("company_id", companyId)
    .single()

  if (!existing) {
    return NextResponse.json({ error: "Filing not found" }, { status: 404 })
  }

  // Build the update payload from allowed fields
  const update: Record<string, unknown> = {}

  if (body.status !== undefined) {
    if (!VALID_STATUSES.includes(body.status as string)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      )
    }
    update.status = body.status
    // Auto-set filed_at when marking completed
    if (body.status === "completed" && existing.status !== "completed") {
      update.filed_at = update.filed_at ?? new Date().toISOString().split("T")[0]
    }
  }

  if (body.filed_at !== undefined) {
    update.filed_at = body.filed_at
  }

  if (body.amount !== undefined) {
    if (typeof body.amount !== "number" || body.amount < 0) {
      return NextResponse.json({ error: "amount must be a non-negative number" }, { status: 400 })
    }
    update.amount = body.amount
  }

  if (body.notes !== undefined) {
    if (typeof body.notes !== "string" || body.notes.length > 1000) {
      return NextResponse.json({ error: "notes must be a string (max 1000 chars)" }, { status: 400 })
    }
    update.notes = body.notes
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
  }

  const { data: updated, error } = await supabase
    .from("filings")
    .update(update)
    .eq("id", filingId)
    .select("id, type, state, due_date, status, filed_at, amount, notes, created_at")
    .single()

  if (error || !updated) {
    return NextResponse.json({ error: error?.message ?? "Update failed" }, { status: 500 })
  }

  // Re-sync company status if filing status changed
  if (update.status) {
    const { data: allFilings } = await supabase
      .from("filings")
      .select("status")
      .eq("company_id", companyId)

    const overdueCount = (allFilings ?? []).filter((f) => f.status === "overdue").length
    const newCompanyStatus =
      overdueCount >= 3 ? "action_required"
      : overdueCount >= 1 ? "attention_needed"
      : "good_standing"

    await supabase
      .from("companies")
      .update({ status: newCompanyStatus })
      .eq("id", companyId)
  }

  return NextResponse.json(updated)
}
