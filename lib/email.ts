import { Resend } from "resend"

let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY ?? "MISSING")
  return _resend
}
const FROM = "GoodStanding.ai <reminders@goodstanding.ai>"
const DASHBOARD_URL = "https://goodstanding.ai/dashboard/compliance"

// ─── Types ────────────────────────────────────────────────────────────────────

export type UpcomingFiling = {
  id: string
  type: string
  state: string
  due_date: string
  amount?: number | null
  companyName: string
  daysUntilDue: number
}

export type OverdueFiling = {
  id: string
  type: string
  state: string
  due_date: string
  amount?: number | null
  companyName: string
  daysOverdue: number
}

// ─── Shared HTML fragments ────────────────────────────────────────────────────

function emailWrapper(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>GoodStanding.ai</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
      <!-- Header -->
      <tr>
        <td style="background:#0F1829;padding:24px 32px;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:#1e3a5f;border-radius:8px;padding:6px 8px;margin-right:10px;">
                <span style="color:#34d399;font-size:14px;font-weight:bold;">✦</span>
              </td>
              <td style="padding-left:10px;">
                <span style="color:#ffffff;font-size:16px;font-weight:700;letter-spacing:-0.3px;">GoodStanding<span style="color:#34d399;">.ai</span></span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Body -->
      <tr><td style="padding:32px;">${content}</td></tr>
      <!-- Footer -->
      <tr>
        <td style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.5;">
            You're receiving this because you enabled email reminders in
            <a href="${DASHBOARD_URL}" style="color:#10b981;text-decoration:none;">GoodStanding.ai</a>.
            Manage your preferences in
            <a href="https://goodstanding.ai/dashboard/integrations" style="color:#10b981;text-decoration:none;">Integrations settings</a>.
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`
}

function filingRow(f: UpcomingFiling | OverdueFiling, isOverdue: boolean) {
  const bgColor = isOverdue ? "#fef2f2" : "#f0fdf4"
  const borderColor = isOverdue ? "#fecaca" : "#bbf7d0"
  const labelColor = isOverdue ? "#dc2626" : "#059669"
  const label = isOverdue
    ? `${(f as OverdueFiling).daysOverdue}d overdue`
    : `Due in ${(f as UpcomingFiling).daysUntilDue}d`

  return `
<tr>
  <td style="padding:8px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${bgColor};border:1px solid ${borderColor};border-radius:10px;padding:14px 16px;">
      <tr>
        <td>
          <p style="margin:0 0 2px;font-size:13px;font-weight:700;color:#1e293b;">${f.type} — ${f.companyName}</p>
          <p style="margin:0;font-size:12px;color:#64748b;">${f.state} · Due ${new Date(f.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}${f.amount ? ` · $${f.amount.toLocaleString()}` : ""}</p>
        </td>
        <td align="right">
          <span style="font-size:11px;font-weight:700;color:${labelColor};white-space:nowrap;">${label}</span>
        </td>
      </tr>
    </table>
  </td>
</tr>`
}

// ─── Send deadline reminder ───────────────────────────────────────────────────

export async function sendDeadlineReminder(to: string, filings: UpcomingFiling[]) {
  if (filings.length === 0) return

  const count = filings.length
  const subject = count === 1
    ? `Reminder: ${filings[0].type} due in ${filings[0].daysUntilDue} days — ${filings[0].companyName}`
    : `${count} compliance deadlines coming up`

  const rows = filings.map((f) => filingRow(f, false)).join("")

  const content = `
<h1 style="margin:0 0 6px;font-size:22px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">
  Upcoming filing${count !== 1 ? "s" : ""}
</h1>
<p style="margin:0 0 24px;font-size:14px;color:#64748b;">
  You have ${count} compliance deadline${count !== 1 ? "s" : ""} coming up. Stay ahead of the deadline to avoid penalties.
</p>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
  ${rows}
</table>
<a href="${DASHBOARD_URL}" style="display:inline-block;background:#0F1829;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:10px;">
  View compliance dashboard →
</a>`

  return getResend().emails.send({ from: FROM, to, subject, html: emailWrapper(content) })
}

// ─── Send overdue alert ───────────────────────────────────────────────────────

export async function sendOverdueAlert(to: string, filings: OverdueFiling[]) {
  if (filings.length === 0) return

  const count = filings.length
  const subject = count === 1
    ? `Action required: ${filings[0].type} is overdue — ${filings[0].companyName}`
    : `${count} filings are now overdue`

  const rows = filings.map((f) => filingRow(f, true)).join("")

  const content = `
<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:14px 16px;margin-bottom:24px;">
  <p style="margin:0;font-size:13px;font-weight:700;color:#dc2626;">⚠ Immediate action required</p>
  <p style="margin:4px 0 0;font-size:12px;color:#b91c1c;">Overdue filings may incur penalties, late fees, or jeopardize your good standing status.</p>
</div>
<h1 style="margin:0 0 6px;font-size:22px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">
  ${count} filing${count !== 1 ? "s" : ""} overdue
</h1>
<p style="margin:0 0 24px;font-size:14px;color:#64748b;">
  The following filing${count !== 1 ? "s are" : " is"} past due. Resolve ${count !== 1 ? "them" : "it"} as soon as possible.
</p>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
  ${rows}
</table>
<a href="${DASHBOARD_URL}" style="display:inline-block;background:#dc2626;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:10px;">
  Resolve overdue filings →
</a>`

  return getResend().emails.send({ from: FROM, to, subject, html: emailWrapper(content) })
}

// ─── Send weekly digest ───────────────────────────────────────────────────────

export async function sendWeeklyDigest(
  to: string,
  upcoming: UpcomingFiling[],
  overdue: OverdueFiling[]
) {
  if (upcoming.length === 0 && overdue.length === 0) return

  const subject = "Your weekly compliance digest"

  const overdueBlock = overdue.length > 0 ? `
<p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#dc2626;text-transform:uppercase;letter-spacing:0.5px;">Overdue (${overdue.length})</p>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
  ${overdue.map((f) => filingRow(f, true)).join("")}
</table>` : ""

  const upcomingBlock = upcoming.length > 0 ? `
<p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#059669;text-transform:uppercase;letter-spacing:0.5px;">Coming up (${upcoming.length})</p>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
  ${upcoming.map((f) => filingRow(f, false)).join("")}
</table>` : ""

  const content = `
<h1 style="margin:0 0 6px;font-size:22px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">
  Weekly compliance summary
</h1>
<p style="margin:0 0 24px;font-size:14px;color:#64748b;">
  Here's your compliance snapshot for the week.
</p>
${overdueBlock}
${upcomingBlock}
<a href="${DASHBOARD_URL}" style="display:inline-block;background:#0F1829;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:10px;">
  Open compliance dashboard →
</a>`

  return getResend().emails.send({ from: FROM, to, subject, html: emailWrapper(content) })
}

// ─── Welcome email ────────────────────────────────────────────────────────────

export function sendWelcomeEmail(to: string, firstName: string, companyName: string) {
  const name = firstName || "there"
  const steps = [
    ["Your compliance calendar is live", "Annual report, franchise tax, and BOI filing deadlines are pre-loaded and tracked automatically."],
    ["We'll remind you before deadlines", "Email alerts 60, 30, and 7 days before each filing. Configure in Integrations settings."],
    ["Upload your formation documents", "Store your Certificate of Incorporation, EIN letter, and operating agreement in the document vault."],
    ["Request a government liaison call", "Got an IRS notice or state letter? Our Enrolled Agents handle it. Go to the Government Liaison tab."],
  ]

  const stepsHtml = steps.map(([title, desc]) => `
<tr>
  <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
    <table cellpadding="0" cellspacing="0"><tr>
      <td style="padding-right:12px;vertical-align:top;padding-top:2px;">
        <span style="display:inline-block;width:20px;height:20px;background:#ecfdf5;border-radius:50%;text-align:center;line-height:20px;font-size:11px;color:#10b981;font-weight:bold;">✓</span>
      </td>
      <td>
        <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#0f172a;">${title}</p>
        <p style="margin:0;font-size:13px;color:#64748b;">${desc}</p>
      </td>
    </tr></table>
  </td>
</tr>`).join("")

  const content = `
<h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">
  Welcome to GoodStanding.ai, ${name}. 🎉
</h1>
<p style="margin:0 0 20px;font-size:14px;color:#64748b;line-height:1.6;">
  <strong>${companyName}</strong> is now in your compliance dashboard. Here's what happens next:
</p>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
  ${stepsHtml}
</table>
<a href="https://goodstanding.ai/dashboard" style="display:inline-block;background:#0F1829;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:10px;margin-bottom:20px;">
  Go to your dashboard →
</a>
<p style="margin:20px 0 0;font-size:13px;color:#94a3b8;">
  Questions? Reply to this email or visit
  <a href="https://goodstanding.ai/contact" style="color:#10b981;">goodstanding.ai/contact</a>.
</p>`

  return getResend().emails.send({
    from: "GoodStanding.ai <hello@goodstanding.ai>",
    to,
    subject: `Welcome to GoodStanding.ai — ${companyName} is live`,
    html: emailWrapper(content),
  })
}
