import { createClient } from "@supabase/supabase-js"

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input))
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("")
}

/**
 * Validates a GoodStanding.ai API key from the Authorization header.
 * Returns the user_id if the key is valid, or null otherwise.
 * Updates last_used_at on success (best-effort).
 */
export async function validateApiKey(authHeader: string | null): Promise<string | null> {
  if (!authHeader?.startsWith("Bearer gsa_")) return null
  const key = authHeader.slice("Bearer ".length)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) return null

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  })

  const hash = await sha256Hex(key)

  const { data } = await supabase
    .from("api_keys")
    .select("id, user_id")
    .eq("key_hash", hash)
    .single()

  if (!data) return null

  // Update last_used_at (best-effort)
  supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", data.id)
    .then(() => {})

  return data.user_id as string
}
