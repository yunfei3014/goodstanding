import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

function supabaseFromCookies() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )
}

/** GET /api/webhooks — list user's configured webhooks */
export async function GET() {
  const supabase = supabaseFromCookies()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data, error } = await supabase
    .from("user_webhooks")
    .select("id, url, events, enabled, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ webhooks: data ?? [] })
}

/** POST /api/webhooks — create or update a webhook */
export async function POST(req: NextRequest) {
  const supabase = supabaseFromCookies()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => null)
  const url: string = body?.url?.trim() ?? ""
  const events: string[] = Array.isArray(body?.events)
    ? body.events
    : ["filing.overdue", "filing.upcoming", "digest.weekly"]
  const secret: string = body?.secret?.trim() ?? ""
  const id: string = body?.id ?? ""

  if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 })
  try { new URL(url) } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
  }
  if (!url.startsWith("https://")) {
    return NextResponse.json({ error: "URL must use HTTPS" }, { status: 400 })
  }

  if (id) {
    // Update existing
    const { data, error } = await supabase
      .from("user_webhooks")
      .update({ url, events, secret: secret || null })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ webhook: data })
  }

  // Enforce max 5 webhooks per user
  const { count } = await supabase
    .from("user_webhooks")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
  if ((count ?? 0) >= 5) {
    return NextResponse.json({ error: "Maximum of 5 webhooks allowed" }, { status: 400 })
  }

  // Auto-generate a signing secret if not provided
  const signingSecret = secret || Array.from(crypto.getRandomValues(new Uint8Array(20)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")

  const { data, error } = await supabase
    .from("user_webhooks")
    .insert({ user_id: user.id, url, events, secret: signingSecret, enabled: true })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ webhook: data }, { status: 201 })
}

/** PATCH /api/webhooks — toggle enabled state */
export async function PATCH(req: NextRequest) {
  const supabase = supabaseFromCookies()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => null)
  const id: string = body?.id ?? ""
  const enabled: boolean = body?.enabled ?? true
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const { error } = await supabase
    .from("user_webhooks")
    .update({ enabled })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

/** DELETE /api/webhooks?id=<id> — remove a webhook */
export async function DELETE(req: NextRequest) {
  const supabase = supabaseFromCookies()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const id = new URL(req.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const { error } = await supabase
    .from("user_webhooks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
