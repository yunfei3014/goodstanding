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
  workspace: string
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
    workspace: "",
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
  const [connecting, setConnecting] = useState(false)

  async function handleConnect() {
    setConnecting(true)
    await new Promise((r) => setTimeout(r, 1200))
    onChange({
      ...prefs,
      connected: true,
      workspace: "My Workspace",
      channel: "#compliance",
    })
    setConnecting(false)
  }

  function handleDisconnect() {
    onChange({ ...DEFAULT_PREFS.slack, connected: false })
  }

  if (!prefs.connected) {
    return (
      <div className="pt-2 text-center py-6">
        <div className="w-12 h-12 bg-[#4A154B]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Slack className="w-6 h-6 text-[#4A154B]" />
        </div>
        <p className="text-sm text-slate-600 mb-1 font-medium">Connect your Slack workspace</p>
        <p className="text-xs text-slate-400 mb-5">
          Get compliance alerts and deadline reminders in any channel.
        </p>
        <button
          onClick={handleConnect}
          disabled={connecting}
          className="inline-flex items-center gap-2 bg-[#4A154B] hover:bg-[#3d1040] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-70"
        >
          {connecting ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Connecting...</>
          ) : (
            <><Slack className="w-4 h-4" />Connect Slack</>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5 pt-2">
      {/* Connected workspace */}
      <div className="flex items-center gap-3 bg-[#4A154B]/5 border border-[#4A154B]/20 rounded-xl px-4 py-3">
        <Slack className="w-4 h-4 text-[#4A154B] flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800">{prefs.workspace}</p>
          <p className="text-xs text-slate-400">Slack workspace · {prefs.channel}</p>
        </div>
        <button
          onClick={handleDisconnect}
          className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
        >
          Disconnect
        </button>
      </div>

      {/* Channel */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
          Alert channel
        </label>
        <input
          type="text"
          value={prefs.channel}
          onChange={(e) => onChange({ ...prefs, channel: e.target.value })}
          placeholder="#compliance"
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Alert types */}
      <div className="space-y-3">
        {[
          { key: "overdueAlerts" as const, label: "Overdue alerts", description: "Post immediately when a filing goes overdue" },
          { key: "upcomingAlerts" as const, label: "Upcoming deadlines", description: "Post when deadlines are 7 days away" },
          { key: "weeklyDigest" as const, label: "Weekly digest", description: "Monday summary of all upcoming filings" },
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
      if (user) {
        setUserEmail(user.email ?? "")
        setUserId(user.id)
        try {
          const raw = localStorage.getItem(`gs_integrations_${user.id}`)
          if (raw) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(raw) })
        } catch {}
      }
      setLoading(false)
    }
    load()
  }, [])

  function save(next: IntegrationPrefs) {
    setPrefs(next)
    try {
      localStorage.setItem(`gs_integrations_${userId}`, JSON.stringify(next))
    } catch {}
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
            {
              icon: Link2,
              iconBg: "bg-purple-50",
              iconColor: "text-purple-600",
              name: "API Access",
              description: "Build custom integrations with the GoodStanding REST API",
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
