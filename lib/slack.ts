type SlackBlock = Record<string, unknown>

/**
 * Send a message to a Slack Incoming Webhook URL.
 * Returns true on success, false on any failure (best-effort).
 */
export async function sendSlackMessage(
  webhookUrl: string,
  text: string,
  blocks?: SlackBlock[]
): Promise<boolean> {
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blocks ? { text, blocks } : { text }),
      signal: AbortSignal.timeout(8000),
    })
    return res.ok
  } catch {
    return false
  }
}

// ─── Block builders ───────────────────────────────────────────────────────────

type OverdueFiling = {
  type: string
  state: string
  due_date: string
  companyName: string
  daysOverdue: number
}

type UpcomingFiling = {
  type: string
  state: string
  due_date: string
  companyName: string
  daysUntilDue: number
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function buildOverdueBlocks(filings: OverdueFiling[]): SlackBlock[] {
  const count = filings.length
  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `⚠️ ${count} filing${count !== 1 ? "s" : ""} overdue`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "The following filings are past due. Penalties may apply.",
      },
    },
    {
      type: "divider",
    },
    ...filings.slice(0, 5).map<SlackBlock>((f) => ({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${f.type}* — ${f.companyName}\n${f.state} · Due ${fmt(f.due_date)} · *${f.daysOverdue}d overdue*`,
      },
    })),
    ...(filings.length > 5
      ? [{ type: "section", text: { type: "mrkdwn", text: `_…and ${filings.length - 5} more_` } }]
      : []),
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "Resolve overdue filings" },
          url: "https://goodstanding.ai/dashboard/compliance",
          style: "danger",
        },
      ],
    },
  ]
}

export function buildUpcomingBlocks(filings: UpcomingFiling[]): SlackBlock[] {
  const count = filings.length
  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `📋 ${count} filing${count !== 1 ? "s" : ""} coming up`,
      },
    },
    {
      type: "divider",
    },
    ...filings.slice(0, 5).map<SlackBlock>((f) => ({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${f.type}* — ${f.companyName}\n${f.state} · Due ${fmt(f.due_date)} · Due in *${f.daysUntilDue} days*`,
      },
    })),
    ...(filings.length > 5
      ? [{ type: "section", text: { type: "mrkdwn", text: `_…and ${filings.length - 5} more_` } }]
      : []),
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "View compliance dashboard" },
          url: "https://goodstanding.ai/dashboard/compliance",
        },
      ],
    },
  ]
}

export function buildDigestBlocks(
  upcoming: UpcomingFiling[],
  overdue: OverdueFiling[]
): SlackBlock[] {
  const blocks: SlackBlock[] = [
    {
      type: "header",
      text: { type: "plain_text", text: "📊 Weekly compliance digest" },
    },
  ]

  if (overdue.length > 0) {
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `*Overdue (${overdue.length})*` },
    })
    overdue.slice(0, 4).forEach((f) => {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `• *${f.type}* — ${f.companyName} · ${f.state} · ${f.daysOverdue}d overdue`,
        },
      })
    })
    if (overdue.length > 4) {
      blocks.push({ type: "section", text: { type: "mrkdwn", text: `_…and ${overdue.length - 4} more overdue_` } })
    }
  }

  if (upcoming.length > 0) {
    if (overdue.length > 0) blocks.push({ type: "divider" })
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `*Coming up (${upcoming.length})*` },
    })
    upcoming.slice(0, 5).forEach((f) => {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `• *${f.type}* — ${f.companyName} · ${f.state} · Due in ${f.daysUntilDue}d`,
        },
      })
    })
    if (upcoming.length > 5) {
      blocks.push({ type: "section", text: { type: "mrkdwn", text: `_…and ${upcoming.length - 5} more upcoming_` } })
    }
  }

  blocks.push({ type: "divider" })
  blocks.push({
    type: "actions",
    elements: [
      {
        type: "button",
        text: { type: "plain_text", text: "Open compliance dashboard" },
        url: "https://goodstanding.ai/dashboard/compliance",
      },
    ],
  })

  return blocks
}
