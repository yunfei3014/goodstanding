import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { validateApiKey } from "@/lib/api-auth"

/**
 * GET /api/v1/companies
 * Returns all companies belonging to the authenticated API key's user.
 *
 * Authorization: Bearer gsa_{key}
 */
export async function GET(req: NextRequest) {
  const userId = await validateApiKey(req.headers.get("authorization"))
  if (!userId) {
    return NextResponse.json({ error: "Invalid or missing API key" }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  const { data, error } = await supabase
    .from("companies")
    .select("id, name, entity_type, state_of_incorporation, status, ein, formed_at, plan, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    object: "list",
    data: data ?? [],
    count: data?.length ?? 0,
  })
}
