import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { cookies } from "next/headers"
import { sendSlackMessage } from "@/lib/slack"

/**
 * POST /api/slack-test
 * Sends a test message to the provided Slack Incoming Webhook URL.
 * Requires an authenticated session to prevent abuse.
 */
export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let webhookUrl: string
  try {
    const body = await req.json()
    webhookUrl = body?.webhookUrl ?? ""
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  if (!webhookUrl.startsWith("https://hooks.slack.com/")) {
    return NextResponse.json({ error: "Invalid webhook URL" }, { status: 400 })
  }

  const ok = await sendSlackMessage(webhookUrl, "✅ GoodStanding.ai is connected to this channel. Compliance alerts will be posted here.", [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "✅ *GoodStanding.ai is connected*\n\nThis channel will receive compliance alerts for overdue filings, upcoming deadlines, and weekly digests.\n\n_You can configure which alerts to receive in your <https://goodstanding.ai/dashboard/integrations|Integrations settings>._",
      },
    },
  ])

  if (!ok) {
    return NextResponse.json({ error: "Failed to send test message" }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
