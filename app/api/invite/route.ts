import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Resend } from "resend"

let _resend: Resend | null = null
const getResend = () => _resend ?? (_resend = new Resend(process.env.RESEND_API_KEY ?? "MISSING"))
const FROM = "GoodStanding.ai <team@goodstanding.ai>"

/**
 * POST /api/invite
 * Body: { email: string; role: "admin" | "member" | "viewer" }
 *
 * Creates a team_invites row and sends the invitee an email.
 */
export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const email: string | undefined = body?.email?.trim().toLowerCase()
  const role: string | undefined = body?.role

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
  }
  if (!["admin", "member", "viewer"].includes(role ?? "")) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 })
  }

  // Upsert invite row
  const { data: invite, error: dbErr } = await supabase
    .from("team_invites")
    .upsert(
      { owner_id: user.id, email, role, status: "pending", invited_at: new Date().toISOString() },
      { onConflict: "owner_id,email" }
    )
    .select()
    .single()

  if (dbErr) {
    return NextResponse.json({ error: dbErr.message }, { status: 500 })
  }

  const inviteLink = `https://goodstanding.ai/invite/${invite.id}`
  const ownerEmail = user.email ?? "a GoodStanding.ai user"
  const roleLabel = role === "admin" ? "Admin" : role === "member" ? "Member" : "Viewer"

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
      <tr>
        <td style="background:#0F1829;padding:24px 32px;">
          <span style="color:#ffffff;font-size:16px;font-weight:700;">GoodStanding<span style="color:#34d399;">.ai</span></span>
        </td>
      </tr>
      <tr>
        <td style="padding:32px;">
          <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#0f172a;">You've been invited</h1>
          <p style="margin:0 0 24px;font-size:14px;color:#64748b;">
            <strong>${ownerEmail}</strong> has invited you to join their GoodStanding.ai workspace as a <strong>${roleLabel}</strong>.
          </p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px;margin-bottom:24px;">
            <p style="margin:0;font-size:13px;color:#166534;">
              GoodStanding.ai helps startups track compliance deadlines, manage filings, and stay in good standing — all in one place.
            </p>
          </div>
          <a href="${inviteLink}" style="display:inline-block;background:#0F1829;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:10px;margin-bottom:20px;">
            Accept invitation →
          </a>
          <p style="margin:0;font-size:11px;color:#94a3b8;">
            Or copy this link: <a href="${inviteLink}" style="color:#10b981;text-decoration:none;">${inviteLink}</a>
          </p>
        </td>
      </tr>
      <tr>
        <td style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:11px;color:#94a3b8;">
            If you weren't expecting this invitation, you can safely ignore this email.
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`

  try {
    await getResend().emails.send({
      from: FROM,
      to: email,
      subject: `${ownerEmail} invited you to GoodStanding.ai`,
      html,
    })
  } catch (err) {
    console.error("Failed to send invite email:", err)
    // Still return success — the invite row was created and the link works
  }

  return NextResponse.json({ ok: true, inviteId: invite.id, inviteLink })
}

/**
 * DELETE /api/invite?id=<inviteId>
 * Revokes (deletes) an invite owned by the current user.
 */
export async function DELETE(req: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const { error } = await supabase
    .from("team_invites")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
