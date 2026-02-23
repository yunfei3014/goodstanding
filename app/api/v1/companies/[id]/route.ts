import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { validateApiKey } from "@/lib/api-auth"

type Props = { params: Promise<{ id: string }> }

/**
 * GET /api/v1/companies/{id}
 * Returns a single company (must be owned by the API key's user).
 * Includes filing summary counts.
 *
 * Authorization: Bearer gsa_{key}
 */
export async function GET(req: NextRequest, { params }: Props) {
  const userId = await validateApiKey(req.headers.get("authorization"))
  if (!userId) {
    return NextResponse.json({ error: "Invalid or missing API key" }, { status: 401 })
  }

  const { id: companyId } = await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  const { data: company, error } = await supabase
    .from("companies")
    .select("id, name, entity_type, state_of_incorporation, status, ein, formed_at, plan, created_at")
    .eq("id", companyId)
    .eq("user_id", userId)
    .single()

  if (error || !company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 })
  }

  // Include filing counts
  const { data: filings } = await supabase
    .from("filings")
    .select("status")
    .eq("company_id", companyId)
    .neq("status", "not_required")

  const all = filings ?? []
  const filingCounts = {
    total:     all.length,
    overdue:   all.filter((f) => f.status === "overdue").length,
    pending:   all.filter((f) => f.status === "pending").length,
    completed: all.filter((f) => f.status === "completed").length,
  }

  return NextResponse.json({ ...company, filing_counts: filingCounts })
}
