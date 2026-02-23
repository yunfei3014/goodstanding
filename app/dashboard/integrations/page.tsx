"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import {
  Mail,
  Slack,
  Calendar,
  Link2,
  Zap,
  BookOpen,
  TrendingUp,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  AlertCircle,
  Bell,
  Clock,
  Plus,
  Trash2,
  Code2,
  Eye,
  EyeOff,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type EmailPrefs = {
  enabled: boolean
  days: number[]          // advance-notice days: 7, 14, 30, 60
  overdueAlerts: boolean
  weeklyDigest: boolean
}

type SlackPrefs = {
  connected: boolean
  webhookUrl: string
  channel: string
  overdueAlerts: boolean
  upcomingAlerts: boolean
  weeklyDigest: boolean
}

type IcalPrefs = {
  generated: boolean
  token: string
}

type IntegrationPrefs = {
  email: EmailPrefs
  slack: SlackPrefs
  ical: IcalPrefs
}

const DEFAULT_PREFS: IntegrationPrefs = {
  email: {
    enabled: true,
    days: [7, 30],
    overdueAlerts: true,
    weeklyDigest: false,
  },
  slack: {
    connected: false,
    webhookUrl: "",
    channel: "#compliance",
    overdueAlerts: true,
    upcomingAlerts: true,
    weeklyDigest: false,
  },
  ical: {
    generated: false,
    token: "",
  },
}

// ─── Small helpers ─────────────────────────────────────────────────────────────

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0",
        enabled ? "bg-emerald-500" : "bg-slate-200"
      )}
    >
      <span
        className={cn(
          "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform",
          enabled ? "translate-x-4" : "translate-x-1"
        )}
      />
    </button>
  )
}

function StatusPill({ connected }: { connected: boolean }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full",
      connected
        ? "text-emerald-700 bg-emerald-50"
        : "text-slate-500 bg-slate-100"
    )}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        connected ? "bg-emerald-500" : "bg-slate-400"
      )} />
      {connected ? "Connected" : "Not connected"}
    </span>
  )
}

// ─── Email panel ──────────────────────────────────────────────────────────────

function EmailPanel({
  prefs,
  userEmail,
  onChange,
}: {
  prefs: EmailPrefs
  userEmail: string
  onChange: (p: EmailPrefs) => void
}) {
  const NOTICE_OPTIONS = [
    { days: 7,  label: "7 days before" },
    { days: 14, label: "14 days before" },
    { days: 30, label: "30 days before" },
    { days: 60, label: "60 days before" },
  ]

  function toggleDay(d: number) {
    const next = prefs.days.includes(d)
      ? prefs.days.filter((x) => x !== d)
      : [...prefs.days, d].sort((a, b) => a - b)
    onChange({ ...prefs, days: next })
  }

  return (
    <div className="space-y-5 pt-2">
      {/* Destination */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Send to
        </label>
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
          <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="text-sm text-slate-700 font-medium flex-1 truncate">{userEmail}</span>
          <span className="text-xs text-slate-400">Account email</span>
        </div>
      </div>

      {/* Advance notice */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Remind me
        </label>
        <div className="grid grid-cols-2 gap-2">
          {NOTICE_OPTIONS.map(({ days, label }) => (
            <button
              key={days}
              onClick={() => toggleDay(days)}
              disabled={!prefs.enabled}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm text-left transition-all",
                prefs.days.includes(days)
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold"
                  : "border-slate-200 text-slate-600 hover:border-slate-300",
                !prefs.enabled && "opacity-40 pointer-events-none"
              )}
            >
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              {label}
              {prefs.days.includes(days) && (
                <Check className="w-3.5 h-3.5 ml-auto text-emerald-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Extra toggles */}
      <div className="space-y-3">
        {[
          {
            key: "overdueAlerts" as const,
            label: "Overdue alerts",
            description: "Get notified immediately when a filing becomes overdue",
          },
          {
            key: "weeklyDigest" as const,
            label: "Weekly digest",
            description: "A summary of upcoming deadlines every Monday morning",
          },
        ].map(({ key, label, description }) => (
          <div key={key} className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{description}</p>
            </div>
            <Toggle
              enabled={prefs[key] && prefs.enabled}
              onToggle={() => onChange({ ...prefs, [key]: !prefs[key] })}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Slack panel ──────────────────────────────────────────────────────────────

function SlackPanel({
  prefs,
  onChange,
}: {
  prefs: SlackPrefs
  onChange: (p: SlackPrefs) => void
}) {
  const [inputUrl, setInputUrl] = useState("")
  const [error, setError] = useState("")
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<"ok" | "fail" | null>(null)

  function handleConnect() {
    setError("")
    const trimmed = inputUrl.trim()
    if (!trimmed.startsWith("https://hooks.slack.com/")) {
      setError("Must be a Slack Incoming Webhook URL starting with https://hooks.slack.com/")
      return
    }
    onChange({ ...prefs, connected: true, webhookUrl: trimmed })
    setInputUrl("")
  }

  function handleDisconnect() {
    onChange({ ...DEFAULT_PREFS.slack })
  }

  async function handleTest() {
    if (!prefs.webhookUrl) return
    setTesting(true)
    setTestResult(null)
    try {
      const res = await fetch("/api/slack-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl: prefs.webhookUrl }),
      })
      setTestResult(res.ok ? "ok" : "fail")
    } catch {
      setTestResult("fail")
    }
    setTesting(false)
  }

  if (!prefs.connected) {
    return (
      <div className="space-y-5 pt-2">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600 space-y-2">
          <p className="font-semibold text-slate-800">How to get your Slack webhook URL:</p>
          <ol className="list-decimal list-inside space-y-1 text-xs text-slate-600">
            <li>Go to <span className="font-mono bg-white border border-slate-200 px-1 rounded">api.slack.com/apps</span> and open or create an app</li>
            <li>Under <strong>Features</strong>, select <strong>Incoming Webhooks</strong></li>
            <li>Activate incoming webhooks and click <strong>Add New Webhook to Workspace</strong></li>
            <li>Choose a channel and click <strong>Allow</strong></li>
            <li>Copy the webhook URL and paste it below</li>
          </ol>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Incoming Webhook URL
          </label>
          <input
            type="url"
            value={inputUrl}
            onChange={(e) => { setInputUrl(e.target.value); setError("") }}
            onKeyDown={(e) => e.key === "Enter" && handleConnect()}
            placeholder="https://hooks.slack.com/services/T.../B.../..."
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
          />
          {error && <p className="text-xs text-red-600 mt-1.5 font-medium">{error}</p>}
        </div>
        <button
          onClick={handleConnect}
          className="inline-flex items-center gap-2 bg-[#4A154B] hover:bg-[#3d1040] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          <Slack className="w-4 h-4" />
          Connect Slack
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5 pt-2">
      {/* Connected indicator */}
      <div className="flex items-center gap-3 bg-[#4A154B]/5 border border-[#4A154B]/20 rounded-xl px-4 py-3">
        <Slack className="w-4 h-4 text-[#4A154B] flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800">Slack connected</p>
          <p className="text-xs text-slate-400 font-mono truncate">
            {prefs.webhookUrl.replace(/\/[^/]+$/, "/••••••")}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleTest}
            disabled={testing}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold transition-colors"
          >
            {testing ? "Sending..." : "Test"}
          </button>
          <button
            onClick={handleDisconnect}
            className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
          >
            Disconnect
          </button>
        </div>
      </div>
      {testResult === "ok" && (
        <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />Test message sent to Slack
        </p>
      )}
      {testResult === "fail" && (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1">
          <X className="w-3.5 h-3.5" />Test failed — check the webhook URL
        </p>
      )}

      {/* Alert types */}
      <div className="space-y-3">
        {[
          { key: "overdueAlerts" as const, label: "Overdue alerts", description: "Post immediately when a filing goes overdue" },
          { key: "upcomingAlerts" as const, label: "Upcoming deadlines", description: "Post when deadlines are within your reminder window" },
          { key: "weeklyDigest" as const, label: "Weekly digest", description: "Monday summary of upcoming and overdue filings" },
        ].map(({ key, label, description }) => (
          <div key={key} className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{description}</p>
            </div>
            <Toggle
              enabled={prefs[key]}
              onToggle={() => onChange({ ...prefs, [key]: !prefs[key] })}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── iCal panel ───────────────────────────────────────────────────────────────

function IcalPanel({
  prefs,
  userId,
  onChange,
}: {
  prefs: IcalPrefs
  userId: string
  onChange: (p: IcalPrefs) => void
}) {
  const [copied, setCopied] = useState(false)

  const feedUrl = prefs.generated && prefs.token
    ? `https://goodstanding.ai/api/cal/${userId}/${prefs.token}.ics`
    : null

  function handleGenerate() {
    const token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
    onChange({ generated: true, token })
  }

  function handleCopy() {
    if (!feedUrl) return
    navigator.clipboard.writeText(feedUrl).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleRevoke() {
    onChange({ generated: false, token: "" })
  }

  const gcalUrl = feedUrl
    ? `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(feedUrl)}`
    : null

  return (
    <div className="space-y-4 pt-2">
      <p className="text-sm text-slate-600">
        Subscribe to a live calendar feed of all your filing deadlines. Works with Google Calendar, Apple Calendar, Outlook, and any iCal-compatible app.
      </p>

      {!prefs.generated ? (
        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 bg-[#1B2B4B] hover:bg-[#243461] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Calendar className="w-4 h-4" />
          Generate calendar feed
        </button>
      ) : (
        <div className="space-y-3">
          {/* Feed URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Your calendar feed URL
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-600 font-mono truncate">
                {feedUrl}
              </div>
              <button
                onClick={handleCopy}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all flex-shrink-0",
                  copied
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                )}
              >
                {copied ? <><Check className="w-3.5 h-3.5" />Copied</> : <><Copy className="w-3.5 h-3.5" />Copy</>}
              </button>
            </div>
          </div>

          {/* Quick-add buttons */}
          <div className="flex flex-wrap gap-2">
            {gcalUrl && (
              <a
                href={gcalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Add to Google Calendar
              </a>
            )}
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Calendar className="w-3 h-3" />
              Subscribe in Apple Calendar
            </button>
          </div>

          <div className="pt-1">
            <button
              onClick={handleRevoke}
              className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
            >
              Revoke feed URL
            </button>
            <p className="text-xs text-slate-400 mt-0.5">
              This will invalidate the current URL. You can generate a new one at any time.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Webhook panel ────────────────────────────────────────────────────────────

type WebhookRecord = {
  id: string
  url: string
  events: string[]
  enabled: boolean
  created_at: string
  secret?: string
}

const ALL_EVENTS = [
  { value: "filing.overdue",  label: "Filing overdue",   description: "Fires when a filing status changes to overdue" },
  { value: "filing.upcoming", label: "Filing upcoming",  description: "Fires when a filing is due within your reminder window" },
  { value: "digest.weekly",   label: "Weekly digest",    description: "Fires every Monday with a summary of upcoming filings" },
]

function WebhookPanel() {
  const [webhooks, setWebhooks] = useState<WebhookRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newUrl, setNewUrl] = useState("")
  const [newEvents, setNewEvents] = useState<string[]>(["filing.overdue", "filing.upcoming", "digest.weekly"])
  const [revealedSecrets, setRevealedSecrets] = useState<Set<string>>(new Set())
  const [secrets, setSecrets] = useState<Record<string, string>>({})
  const [error, setError] = useState("")

  useEffect(() => { loadWebhooks() }, [])

  async function loadWebhooks() {
    const res = await fetch("/api/webhooks")
    if (res.ok) {
      const { webhooks: data } = await res.json()
      setWebhooks(data)
    }
    setLoading(false)
  }

  async function handleAdd() {
    setError("")
    if (!newUrl) { setError("Enter a URL"); return }
    setSaving(true)
    const res = await fetch("/api/webhooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: newUrl, events: newEvents }),
    })
    setSaving(false)
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      setError(d.error ?? "Failed to save webhook")
      return
    }
    const { webhook } = await res.json()
    setWebhooks((prev) => [...prev, webhook])
    setSecrets((prev) => ({ ...prev, [webhook.id]: webhook.secret ?? "" }))
    setRevealedSecrets((prev) => new Set(prev).add(webhook.id))
    setNewUrl("")
    setNewEvents(["filing.overdue", "filing.upcoming", "digest.weekly"])
    setAdding(false)
  }

  async function handleToggle(wh: WebhookRecord) {
    await fetch("/api/webhooks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: wh.id, enabled: !wh.enabled }),
    })
    setWebhooks((prev) => prev.map((w) => w.id === wh.id ? { ...w, enabled: !w.enabled } : w))
  }

  async function handleDelete(id: string) {
    await fetch(`/api/webhooks?id=${id}`, { method: "DELETE" })
    setWebhooks((prev) => prev.filter((w) => w.id !== id))
  }

  function toggleEventFilter(value: string) {
    setNewEvents((prev) =>
      prev.includes(value) ? prev.filter((e) => e !== value) : [...prev, value]
    )
  }

  if (loading) {
    return <div className="pt-4 text-xs text-slate-400">Loading...</div>
  }

  return (
    <div className="space-y-5 pt-2">
      <p className="text-sm text-slate-600">
        GoodStanding will POST a signed JSON payload to your URL whenever compliance events occur.
        Use this to trigger alerts in custom systems, update your CRM, or build automations.
      </p>

      {/* Existing webhooks */}
      {webhooks.length > 0 && (
        <div className="space-y-3">
          {webhooks.map((wh) => {
            const revealed = revealedSecrets.has(wh.id)
            const secret = secrets[wh.id] ?? wh.secret ?? ""
            return (
              <div key={wh.id} className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50">
                  <div className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    wh.enabled ? "bg-emerald-400" : "bg-slate-300"
                  )} />
                  <span className="text-xs font-mono text-slate-700 flex-1 truncate">{wh.url}</span>
                  <Toggle enabled={wh.enabled} onToggle={() => handleToggle(wh)} />
                  <button
                    onClick={() => handleDelete(wh.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="px-4 py-3 space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {wh.events.map((ev) => (
                      <span key={ev} className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded">
                        {ev}
                      </span>
                    ))}
                  </div>
                  {secret && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Signing secret:</span>
                      <code className="text-xs font-mono text-slate-700 flex-1 truncate">
                        {revealed ? secret : "••••••••••••••••••••"}
                      </code>
                      <button
                        onClick={() => setRevealedSecrets((prev) => {
                          const next = new Set(prev)
                          if (revealed) next.delete(wh.id); else next.add(wh.id)
                          return next
                        })}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => { navigator.clipboard.writeText(secret).catch(() => {}) }}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add form */}
      {adding ? (
        <div className="border border-slate-200 rounded-xl p-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Endpoint URL (HTTPS required)
            </label>
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://your-app.com/webhooks/goodstanding"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Events to subscribe
            </label>
            <div className="space-y-2">
              {ALL_EVENTS.map(({ value, label, description }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleEventFilter(value)}
                  className={cn(
                    "w-full flex items-start gap-3 px-3 py-2.5 rounded-xl border-2 text-left transition-all",
                    newEvents.includes(value)
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                    newEvents.includes(value) ? "bg-emerald-500 border-emerald-500" : "border-slate-300"
                  )}>
                    {newEvents.includes(value) && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{label}</p>
                    <p className="text-xs text-slate-400">{description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={saving}
              className="flex items-center gap-2 bg-[#1B2B4B] hover:bg-[#243461] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-70"
            >
              {saving ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
              ) : (
                "Add webhook"
              )}
            </button>
            <button
              onClick={() => { setAdding(false); setError(""); setNewUrl("") }}
              className="text-sm text-slate-500 hover:text-slate-700 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : webhooks.length < 5 ? (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add endpoint
        </button>
      ) : (
        <p className="text-xs text-slate-400">Maximum of 5 endpoints reached.</p>
      )}

      {/* Payload example */}
      <div className="bg-slate-900 rounded-xl p-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Example payload</p>
        <pre className="text-xs text-emerald-400 overflow-x-auto leading-relaxed">{`{
  "event": "filing.overdue",
  "timestamp": "2026-03-01T08:00:00.000Z",
  "data": {
    "filingId": "uuid",
    "type": "Delaware Franchise Tax",
    "state": "DE",
    "dueDate": "2026-03-01",
    "companyName": "Acme Corp"
  }
}`}</pre>
      </div>
    </div>
  )
}

// ─── API Key panel ────────────────────────────────────────────────────────────

type ApiKeyMeta = {
  id: string
  name: string
  key_prefix: string
  last_used_at: string | null
  created_at: string
}

function ApiKeyPanel() {
  const [keys, setKeys] = useState<ApiKeyMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => { loadKeys() }, [])

  async function loadKeys() {
    const res = await fetch("/api/keys")
    if (res.ok) {
      const { keys: data } = await res.json()
      setKeys(data ?? [])
    }
    setLoading(false)
  }

  async function handleCreate() {
    setError("")
    if (!name.trim()) { setError("Enter a name for this key"); return }
    setSaving(true)
    const res = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    })
    setSaving(false)
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      setError(d.error ?? "Failed to create key")
      return
    }
    const { key, meta } = await res.json()
    setNewKey(key)
    setKeys((prev) => [meta, ...prev])
    setAdding(false)
    setName("")
  }

  async function handleRevoke(id: string) {
    if (!confirm("Revoke this API key? Any applications using it will lose access immediately.")) return
    await fetch(`/api/keys?id=${id}`, { method: "DELETE" })
    setKeys((prev) => prev.filter((k) => k.id !== id))
  }

  function copyKey() {
    if (!newKey) return
    navigator.clipboard.writeText(newKey).catch(() => {})
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 2500)
  }

  function fmtDate(iso: string | null) {
    if (!iso) return "Never"
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="space-y-4 pt-2">
      {/* New key reveal */}
      {newKey && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-xs font-bold text-emerald-800 mb-2 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            API key created — copy it now, it won't be shown again
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-white border border-emerald-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 truncate">
              {newKey}
            </code>
            <button
              onClick={copyKey}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-emerald-300 bg-white text-xs font-semibold text-emerald-700 hover:bg-emerald-50 flex-shrink-0 transition-colors"
            >
              {copiedKey ? <><Check className="w-3.5 h-3.5" />Copied!</> : <><Copy className="w-3.5 h-3.5" />Copy</>}
            </button>
          </div>
          <button onClick={() => setNewKey(null)} className="text-xs text-emerald-600 hover:text-emerald-800 mt-2 font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {/* Existing keys */}
      {loading ? (
        <p className="text-xs text-slate-400">Loading...</p>
      ) : keys.length > 0 ? (
        <div className="divide-y divide-slate-50">
          {keys.map((k) => (
            <div key={k.id} className="flex items-center justify-between py-3 gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">{k.name}</p>
                <p className="text-xs text-slate-400 font-mono">{k.key_prefix}••••••••••••••••••••••••••••••</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Created {fmtDate(k.created_at)} · Last used {fmtDate(k.last_used_at)}
                </p>
              </div>
              <button
                onClick={() => handleRevoke(k.id)}
                className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 flex-shrink-0 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Revoke
              </button>
            </div>
          ))}
        </div>
      ) : !adding && (
        <p className="text-xs text-slate-400">No API keys yet.</p>
      )}

      {/* Add form */}
      {adding ? (
        <div className="space-y-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Key name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="e.g. CI Pipeline, Zapier, My App"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={saving}
              className="flex items-center gap-2 bg-[#1B2B4B] hover:bg-[#243461] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-70"
            >
              {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating...</> : "Create key"}
            </button>
            <button
              onClick={() => { setAdding(false); setError(""); setName("") }}
              className="text-sm text-slate-500 hover:text-slate-700 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : keys.length < 5 ? (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create API key
        </button>
      ) : (
        <p className="text-xs text-slate-400">Maximum of 5 keys reached.</p>
      )}

      {/* API reference */}
      <div className="bg-slate-900 rounded-xl p-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Example request</p>
        <pre className="text-xs text-emerald-400 overflow-x-auto leading-relaxed">{`curl https://goodstanding.ai/api/v1/companies \\
  -H "Authorization: Bearer gsa_your_key" \\
  -H "Content-Type: application/json"`}</pre>
      </div>

      <p className="text-xs text-slate-400">
        API base URL: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">https://goodstanding.ai/api/v1</code>
        {" "}· Endpoints: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">/companies</code>,{" "}
        <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">/companies/{"{id}"}/filings</code>
      </p>
    </div>
  )
}

// ─── Integration card ──────────────────────────────────────────────────────────

function IntegrationCard({
  icon: Icon,
  iconBg,
  iconColor,
  name,
  description,
  connected,
  enabled,
  comingSoon,
  children,
  onToggle,
}: {
  icon: React.ElementType
  iconBg: string
  iconColor: string
  name: string
  description: string
  connected?: boolean
  enabled?: boolean
  comingSoon?: boolean
  children?: React.ReactNode
  onToggle?: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  const isActive = connected !== undefined ? connected : (enabled ?? false)

  return (
    <div className={cn(
      "bg-white border rounded-2xl shadow-sm overflow-hidden transition-all",
      isActive ? "border-emerald-200" : "border-slate-200"
    )}>
      <div className="flex items-center gap-4 px-6 py-5">
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0", iconBg)}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-slate-900 text-sm">{name}</h3>
            {comingSoon && (
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                Coming soon
              </span>
            )}
            {!comingSoon && connected !== undefined && <StatusPill connected={connected} />}
          </div>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
        {!comingSoon && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {onToggle && (
              <Toggle enabled={isActive} onToggle={onToggle} />
            )}
            {children && (
              <button
                onClick={() => setExpanded((e) => !e)}
                className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
              >
                Configure
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        )}
      </div>

      {expanded && children && (
        <div className="px-6 pb-6 border-t border-slate-100">
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function IntegrationsPage() {
  const [userEmail, setUserEmail] = useState("")
  const [userId, setUserId] = useState("")
  const [prefs, setPrefs] = useState<IntegrationPrefs>(DEFAULT_PREFS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      setUserEmail(user.email ?? "")
      setUserId(user.id)

      // Load from Supabase first; fall back to localStorage for migration
      const { data: dbPrefs } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (dbPrefs) {
        setPrefs({
          email: {
            enabled: dbPrefs.email_enabled,
            days: dbPrefs.email_days ?? [7, 30],
            overdueAlerts: dbPrefs.email_overdue_alerts,
            weeklyDigest: dbPrefs.email_weekly_digest,
          },
          slack: {
            connected: !!dbPrefs.slack_webhook_url,
            webhookUrl: dbPrefs.slack_webhook_url ?? "",
            channel: "#compliance",
            overdueAlerts: dbPrefs.slack_overdue_alerts ?? true,
            upcomingAlerts: dbPrefs.slack_upcoming_alerts ?? true,
            weeklyDigest: dbPrefs.slack_weekly_digest ?? false,
          },
          ical: {
            generated: !!dbPrefs.ical_token,
            token: dbPrefs.ical_token ?? "",
          },
        })
      } else {
        // Migrate from localStorage if present
        try {
          const raw = localStorage.getItem(`gs_integrations_${user.id}`)
          if (raw) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(raw) })
        } catch {}
      }
      setLoading(false)
    }
    load()
  }, [])

  async function save(next: IntegrationPrefs) {
    setPrefs(next)
    // Persist to localStorage for immediate reactivity
    try {
      localStorage.setItem(`gs_integrations_${userId}`, JSON.stringify(next))
    } catch {}
    // Persist to Supabase so the reminder cron can read it
    if (!userId) return
    const supabase = createClient()
    await supabase.from("user_preferences").upsert({
      user_id: userId,
      email_enabled: next.email.enabled,
      email_days: next.email.days,
      email_overdue_alerts: next.email.overdueAlerts,
      email_weekly_digest: next.email.weeklyDigest,
      ical_token: next.ical.token || null,
      slack_webhook_url: next.slack.webhookUrl || null,
      slack_overdue_alerts: next.slack.overdueAlerts,
      slack_upcoming_alerts: next.slack.upcomingAlerts,
      slack_weekly_digest: next.slack.weeklyDigest,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const activeCount = [
    prefs.email.enabled,
    prefs.slack.connected,
    prefs.ical.generated,
  ].filter(Boolean).length

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Integrations</h1>
        <p className="text-slate-500">Connect GoodStanding to the tools your team already uses.</p>
      </div>

      {/* Status bar */}
      {activeCount > 0 && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-6">
          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
          <p className="text-sm text-emerald-800 font-medium">
            {activeCount} integration{activeCount !== 1 ? "s" : ""} active
          </p>
        </div>
      )}

      {/* Notifications section */}
      <div className="mb-8">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Notifications
        </h2>
        <div className="space-y-3">
          <IntegrationCard
            icon={Mail}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            name="Email Reminders"
            description="Get deadline alerts and compliance digests sent to your inbox"
            enabled={prefs.email.enabled}
            onToggle={() => save({ ...prefs, email: { ...prefs.email, enabled: !prefs.email.enabled } })}
          >
            <EmailPanel
              prefs={prefs.email}
              userEmail={userEmail}
              onChange={(email) => save({ ...prefs, email })}
            />
          </IntegrationCard>

          <IntegrationCard
            icon={Bell}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            name="In-App Notifications"
            description="Bell icon alerts in your dashboard for overdue and upcoming filings"
            enabled={true}
            onToggle={() => {}}
          >
            <div className="pt-2">
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                In-app notifications are always on and cannot be disabled.
              </div>
            </div>
          </IntegrationCard>
        </div>
      </div>

      {/* Productivity section */}
      <div className="mb-8">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Productivity
        </h2>
        <div className="space-y-3">
          <IntegrationCard
            icon={Slack}
            iconBg="bg-[#4A154B]/10"
            iconColor="text-[#4A154B]"
            name="Slack"
            description="Post compliance alerts to any Slack channel"
            connected={prefs.slack.connected}
          >
            <SlackPanel
              prefs={prefs.slack}
              onChange={(slack) => save({ ...prefs, slack })}
            />
          </IntegrationCard>

          <IntegrationCard
            icon={Calendar}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            name="Calendar Feed (iCal)"
            description="Subscribe to your filing deadlines in Google Calendar, Apple Calendar, or Outlook"
            connected={prefs.ical.generated}
          >
            <IcalPanel
              prefs={prefs.ical}
              userId={userId}
              onChange={(ical) => save({ ...prefs, ical })}
            />
          </IntegrationCard>
        </div>
      </div>

      {/* Developer / Webhooks section */}
      <div className="mb-8">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Developer
        </h2>
        <div className="space-y-3">
          <IntegrationCard
            icon={Code2}
            iconBg="bg-slate-100"
            iconColor="text-slate-600"
            name="Outgoing Webhooks"
            description="POST real-time compliance events to any HTTPS endpoint. HMAC-SHA256 signed."
            connected={false}
          >
            <WebhookPanel />
          </IntegrationCard>

          <IntegrationCard
            icon={Link2}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
            name="API Access"
            description="Build custom integrations with the GoodStanding REST API"
            connected={false}
          >
            <ApiKeyPanel />
          </IntegrationCard>
        </div>
      </div>

      {/* Coming soon section */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Coming soon
        </h2>
        <div className="space-y-3">
          {[
            {
              icon: Zap,
              iconBg: "bg-orange-50",
              iconColor: "text-orange-500",
              name: "Zapier",
              description: "Automate compliance workflows with 5,000+ apps",
            },
            {
              icon: BookOpen,
              iconBg: "bg-green-50",
              iconColor: "text-green-600",
              name: "QuickBooks",
              description: "Sync filing amounts and tax payments with your books",
            },
            {
              icon: TrendingUp,
              iconBg: "bg-blue-50",
              iconColor: "text-sky-600",
              name: "Xero",
              description: "Connect compliance deadlines to your accounting workflow",
            },
          ].map((item) => (
            <IntegrationCard
              key={item.name}
              icon={item.icon}
              iconBg={item.iconBg}
              iconColor={item.iconColor}
              name={item.name}
              description={item.description}
              comingSoon
            />
          ))}
        </div>
      </div>
    </div>
  )
}
