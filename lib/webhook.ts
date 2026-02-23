import { createClient } from "@supabase/supabase-js"

export type WebhookEvent =
  | "filing.overdue"
  | "filing.upcoming"
  | "digest.weekly"

export interface WebhookPayload {
  event: WebhookEvent
  timestamp: string
  data: Record<string, unknown>
}

/**
 * Fire all configured webhooks for a user and event type.
 * Failures are silently absorbed — webhooks are best-effort.
 */
export async function fireWebhooks(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  event: WebhookEvent,
  data: Record<string, unknown>
): Promise<void> {
  const { data: webhooks } = await supabase
    .from("user_webhooks")
    .select("id, url, secret")
    .eq("user_id", userId)
    .eq("enabled", true)
    .contains("events", [event])

  if (!webhooks?.length) return

  const payload: WebhookPayload = {
    event,
    timestamp: new Date().toISOString(),
    data,
  }
  const body = JSON.stringify(payload)

  await Promise.allSettled(
    webhooks.map(async (wh: { id: string; url: string; secret: string | null }) => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "User-Agent": "GoodStanding-Webhook/1.0",
        "X-GoodStanding-Event": event,
      }

      if (wh.secret) {
        const encoder = new TextEncoder()
        const keyData = encoder.encode(wh.secret)
        const msgData = encoder.encode(body)
        const cryptoKey = await crypto.subtle.importKey(
          "raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
        )
        const sig = await crypto.subtle.sign("HMAC", cryptoKey, msgData)
        const sigHex = Array.from(new Uint8Array(sig))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")
        headers["X-GoodStanding-Signature"] = `sha256=${sigHex}`
      }

      try {
        return await fetch(wh.url, {
          method: "POST",
          headers,
          body,
          signal: AbortSignal.timeout(8000),
        })
      } catch {
        // Silently absorb timeouts and network errors
      }
    })
  )
}
