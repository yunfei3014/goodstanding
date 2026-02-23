import { createServerClient } from "@supabase/ssr"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input))
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("")
}

function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes)
  crypto.getRandomValues(arr)
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("")
}

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

/** GET /api/keys — list API keys (prefix + metadata only, never the full key) */
export async function GET() {
  const supabase = supabaseFromCookies()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data, error } = await supabase
    .from("api_keys")
    .select("id, name, key_prefix, last_used_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ keys: data ?? [] })
}

/** POST /api/keys — create a new API key */
export async function POST(req: NextRequest) {
  const supabase = supabaseFromCookies()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { name } = await req.json().catch(() => ({}))
  if (!name?.trim()) return NextResponse.json({ error: "name is required" }, { status: 400 })

  // Enforce max 5 keys per user
  const { count } = await supabase
    .from("api_keys")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
  if ((count ?? 0) >= 5) {
    return NextResponse.json({ error: "Maximum of 5 API keys allowed" }, { status: 400 })
  }

  // Generate key: gsa_{40 hex chars}
  const rawKey = `gsa_${randomHex(20)}`
  const keyPrefix = rawKey.slice(0, 12)   // "gsa_" + 8 hex chars
  const keyHash = await sha256Hex(rawKey)

  const svc = serviceClient()
  const { data, error } = await svc
    .from("api_keys")
    .insert({ user_id: user.id, name: name.trim(), key_prefix: keyPrefix, key_hash: keyHash })
    .select("id, name, key_prefix, created_at")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Return the full key ONCE — it cannot be retrieved again
  return NextResponse.json({ key: rawKey, meta: data }, { status: 201 })
}

/** DELETE /api/keys?id=xxx — revoke a key */
export async function DELETE(req: NextRequest) {
  const supabase = supabaseFromCookies()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const { error } = await supabase
    .from("api_keys")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
