import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * POST /api/contact
 * Body: { name: string; email: string; company?: string; message: string }
 *
 * Sends an email to the team and a confirmation to the sender.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const name: string    = body?.name?.trim() ?? ""
  const email: string   = body?.email?.trim().toLowerCase() ?? ""
  const company: string = body?.company?.trim() ?? ""
  const message: string = body?.message?.trim() ?? ""

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
  }
  if (message.length > 2000) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 })
  }

  const teamHtml = `<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
<p><strong>Message:</strong></p>
<p style="white-space:pre-wrap;background:#f8fafc;padding:12px;border-radius:8px;">${message.replace(/</g, "&lt;")}</p>`

  const confirmHtml = `<!DOCTYPE html>
<html lang="en">
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;padding:32px 16px;margin:0;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
  <div style="background:#0F1829;padding:24px 32px;">
    <span style="color:#fff;font-size:16px;font-weight:700;">GoodStanding<span style="color:#34d399;">.ai</span></span>
  </div>
  <div style="padding:32px;">
    <h2 style="margin:0 0 8px;font-size:18px;font-weight:800;color:#0f172a;">We got your message, ${name}.</h2>
    <p style="margin:0 0 16px;font-size:14px;color:#64748b;">
      Thanks for reaching out. We typically respond within one business day.
    </p>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:#475569;white-space:pre-wrap;">${message.replace(/</g, "&lt;")}</p>
    </div>
    <a href="https://goodstanding.ai" style="display:inline-block;background:#0F1829;color:#fff;font-size:13px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:10px;">
      Visit GoodStanding.ai →
    </a>
  </div>
</div>
</body>
</html>`

  try {
    await Promise.all([
      resend.emails.send({
        from: "GoodStanding.ai <hello@goodstanding.ai>",
        to: "hello@goodstanding.ai",
        replyTo: email,
        subject: `Contact: ${name}${company ? ` (${company})` : ""}`,
        html: teamHtml,
      }),
      resend.emails.send({
        from: "GoodStanding.ai <hello@goodstanding.ai>",
        to: email,
        subject: "We received your message — GoodStanding.ai",
        html: confirmHtml,
      }),
    ])
  } catch (err) {
    console.error("Failed to send contact email:", err)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
