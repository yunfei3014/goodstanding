import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { validateApiKey } from "@/lib/api-auth"

type Props = { params: Promise<{ id: string }> }

/**
 * GET /api/v1/companies/{id}/filings
 * Returns all filings for the given company (must be owned by the API key's user).
 *
 * Authorization: Bearer gsa_{key}
 * Query params:
 *   ?status=pending|overdue|completed (optional filter)
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

  // Verify ownership
  const { data: company } = await supabase
    .from("companies")
    .select("id, name")
    .eq("id", companyId)
    .eq("user_id", userId)
    .single()

  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 })
  }

  const status = req.nextUrl.searchParams.get("status")
  const validStatuses = ["pending", "overdue", "completed", "not_required"]

  let query = supabase
    .from("filings")
    .select("id, type, state, due_date, status, filed_at, amount, notes, created_at")
    .eq("company_id", companyId)
    .order("due_date", { ascending: true })

  if (status && validStatuses.includes(status)) {
    query = query.eq("status", status)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    object: "list",
    company: { id: company.id, name: company.name },
    data: data ?? [],
    count: data?.length ?? 0,
  })
}
