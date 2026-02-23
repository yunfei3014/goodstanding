import { createServerClient } from "@supabase/ssr"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

function supabaseFromCookies() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          const store = await cookies()
          return store.getAll()
        },
        async setAll(toSet) {
          const store = await cookies()
          toSet.forEach(({ name, value, options }) => store.set(name, value, options))
        },
      },
    }
  )
}

function serviceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

function randomToken() {
  // 40-char hex token
  const arr = new Uint8Array(20)
  crypto.getRandomValues(arr)
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("")
}

/** GET /api/status-token?companyId=xxx — return the current status_token */
export async function GET(req: NextRequest) {
  const supabase = supabaseFromCookies()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const companyId = req.nextUrl.searchParams.get("companyId")
  if (!companyId) return NextResponse.json({ error: "companyId required" }, { status: 400 })

  const { data, error } = await supabase
    .from("companies")
    .select("id, status_token")
    .eq("id", companyId)
    .eq("user_id", user.id)
    .single()

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Backfill if column missing (pre-migration row)
  if (!data.status_token) {
    const token = randomToken()
    const svc = serviceClient()
    await svc.from("companies").update({ status_token: token }).eq("id", companyId)
    return NextResponse.json({ token })
  }

  return NextResponse.json({ token: data.status_token })
}

/** POST /api/status-token { companyId } — rotate the token */
export async function POST(req: NextRequest) {
  const supabase = supabaseFromCookies()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { companyId } = await req.json()
  if (!companyId) return NextResponse.json({ error: "companyId required" }, { status: 400 })

  // Verify ownership
  const { data: existing } = await supabase
    .from("companies")
    .select("id")
    .eq("id", companyId)
    .eq("user_id", user.id)
    .single()

  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const token = randomToken()
  const svc = serviceClient()
  await svc.from("companies").update({ status_token: token }).eq("id", companyId)

  return NextResponse.json({ token })
}
