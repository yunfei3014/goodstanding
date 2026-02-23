"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import {
  Users,
  UserPlus,
  Mail,
  Crown,
  Shield,
  Eye,
  Trash2,
  X,
  Check,
  Loader2,
  ChevronDown,
  Clock,
  Copy,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Role = "admin" | "member" | "viewer"

type Invite = {
  id: string
  email: string
  role: Role
  invitedAt: string
  status: "pending" | "accepted"
}

const ROLE_META: Record<Role, {
  label: string
  icon: React.ElementType
  color: string
  bg: string
  description: string
  capabilities: string[]
}> = {
  admin: {
    label: "Admin",
    icon: Shield,
    color: "text-blue-700",
    bg: "bg-blue-50",
    description: "Full access except billing",
    capabilities: [
      "Add & edit companies",
      "Manage filings and documents",
      "Invite and remove members",
      "Access all reports",
    ],
  },
  member: {
    label: "Member",
    icon: Users,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    description: "Can edit most data",
    capabilities: [
      "Add & edit filings and documents",
      "Log government interactions",
      "View all companies",
      "Cannot invite members",
    ],
  },
  viewer: {
    label: "Viewer",
    icon: Eye,
    color: "text-slate-600",
    bg: "bg-slate-100",
    description: "Read-only access",
    capabilities: [
      "View filings, documents, calendar",
      "View government interactions",
      "Download reports",
      "Cannot make any changes",
    ],
  },
}

function RoleBadge({ role }: { role: Role | "owner" }) {
  if (role === "owner") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
        <Crown className="w-3 h-3" />
        Owner
      </span>
    )
  }
  const meta = ROLE_META[role]
  const Icon = meta.icon
  return (
    <span className={cn(
      "inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full",
      meta.color, meta.bg
    )}>
      <Icon className="w-3 h-3" />
      {meta.label}
    </span>
  )
}

function RoleSelect({
  value,
  onChange,
}: {
  value: Role
  onChange: (r: Role) => void
}) {
  const [open, setOpen] = useState(false)
  const meta = ROLE_META[value]
  const Icon = meta.icon

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors",
          meta.color, meta.bg, "border-transparent hover:border-current/20"
        )}
      >
        <Icon className="w-3 h-3" />
        {meta.label}
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden">
          {(["admin", "member", "viewer"] as Role[]).map((r) => {
            const m = ROLE_META[r]
            const RIcon = m.icon
            return (
              <button
                key={r}
                onClick={() => { onChange(r); setOpen(false) }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-50 transition-colors text-left",
                  r === value && "bg-slate-50"
                )}
              >
                <RIcon className={cn("w-3.5 h-3.5", m.color)} />
                <div>
                  <p className="text-xs font-semibold text-slate-800">{m.label}</p>
                  <p className="text-xs text-slate-400">{m.description}</p>
                </div>
                {r === value && <Check className="w-3.5 h-3.5 text-emerald-500 ml-auto flex-shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function InviteModal({
  onClose,
  onInvite,
}: {
  onClose: () => void
  onInvite: (email: string, role: Role) => void
}) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<Role>("member")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")

  function validate(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  }

  async function handleSend() {
    if (!validate(email)) {
      setError("Please enter a valid email address.")
      return
    }
    setSending(true)
    // Simulate a brief send delay
    await new Promise((r) => setTimeout(r, 600))
    setSending(false)
    onInvite(email.trim().toLowerCase(), role)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#1B2B4B]">Invite team member</h2>
            <p className="text-slate-500 text-sm mt-0.5">They'll receive an email with a link to join.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                autoFocus
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError("") }}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
            <div className="grid grid-cols-3 gap-2">
              {(["admin", "member", "viewer"] as Role[]).map((r) => {
                const meta = ROLE_META[r]
                const RIcon = meta.icon
                return (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 text-center transition-all",
                      role === r
                        ? "border-[#1B2B4B] bg-[#1B2B4B]/5"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <RIcon className={cn("w-4 h-4", role === r ? "text-[#1B2B4B]" : meta.color)} />
                    <span className={cn(
                      "text-xs font-semibold",
                      role === r ? "text-[#1B2B4B]" : "text-slate-600"
                    )}>
                      {meta.label}
                    </span>
                    <span className="text-xs text-slate-400 leading-tight">{meta.description}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Selected role capabilities */}
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-600 mb-2">
              {ROLE_META[role].label} can:
            </p>
            <ul className="space-y-1.5">
              {ROLE_META[role].capabilities.map((cap) => (
                <li key={cap} className="flex items-center gap-2 text-xs text-slate-600">
                  <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                  {cap}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!email || sending}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B2B4B] hover:bg-[#243461] text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {sending ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Sending...</>
            ) : (
              <><Mail className="w-4 h-4" />Send invite</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function initials(email: string) {
  return email.slice(0, 2).toUpperCase()
}

const AVATAR_COLORS = [
  "bg-blue-500", "bg-emerald-500", "bg-purple-500",
  "bg-amber-500", "bg-rose-500", "bg-cyan-500",
]

function avatarColor(email: string) {
  let hash = 0
  for (const c of email) hash = (hash * 31 + c.charCodeAt(0)) % AVATAR_COLORS.length
  return AVATAR_COLORS[hash]
}

export default function TeamPage() {
  const [ownerEmail, setOwnerEmail] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [userId, setUserId] = useState("")
  const [invites, setInvites] = useState<Invite[]>([])
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setOwnerEmail(user.email ?? "")
        setOwnerName(user.user_metadata?.full_name ?? user.email ?? "")
        setUserId(user.id)
        // Load invites from localStorage keyed by user ID
        try {
          const raw = localStorage.getItem(`gs_team_invites_${user.id}`)
          if (raw) setInvites(JSON.parse(raw))
        } catch {}
      }
      setLoading(false)
    }
    load()
  }, [])

  function saveInvites(next: Invite[]) {
    setInvites(next)
    try {
      localStorage.setItem(`gs_team_invites_${userId}`, JSON.stringify(next))
    } catch {}
  }

  function handleInvite(email: string, role: Role) {
    const exists = invites.some((i) => i.email === email)
    if (exists) return
    const next: Invite[] = [
      ...invites,
      {
        id: crypto.randomUUID(),
        email,
        role,
        invitedAt: new Date().toISOString(),
        status: "pending",
      },
    ]
    saveInvites(next)
  }

  function handleRemove(id: string) {
    saveInvites(invites.filter((i) => i.id !== id))
    setRemovingId(null)
  }

  function handleChangeRole(id: string, role: Role) {
    saveInvites(invites.map((i) => (i.id === id ? { ...i, role } : i)))
  }

  function handleCopyLink(id: string) {
    navigator.clipboard.writeText(`https://goodstanding.ai/invite/${id}`).catch(() => {})
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const pendingInvites = invites.filter((i) => i.status === "pending")
  const acceptedInvites = invites.filter((i) => i.status === "accepted")

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      {showInviteModal && (
        <InviteModal
          onClose={() => setShowInviteModal(false)}
          onInvite={handleInvite}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Team</h1>
          <p className="text-slate-500">Manage who has access to your GoodStanding workspace.</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 bg-[#1B2B4B] hover:bg-[#243461] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Invite member
        </button>
      </div>

      {/* Role legend */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {(["admin", "member", "viewer"] as Role[]).map((role) => {
          const meta = ROLE_META[role]
          const Icon = meta.icon
          return (
            <div key={role} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", meta.bg)}>
                  <Icon className={cn("w-3.5 h-3.5", meta.color)} />
                </div>
                <span className="text-sm font-bold text-slate-800">{meta.label}</span>
              </div>
              <p className="text-xs text-slate-500 mb-2">{meta.description}</p>
              <ul className="space-y-1">
                {meta.capabilities.map((cap) => (
                  <li key={cap} className="flex items-start gap-1.5 text-xs text-slate-500">
                    <Check className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {cap}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* Active members */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            Members
            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {1 + acceptedInvites.length}
            </span>
          </h2>
        </div>

        {/* Owner row */}
        <div className="flex items-center gap-4 px-6 py-4">
          <div className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0",
            avatarColor(ownerEmail)
          )}>
            {initials(ownerEmail)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{ownerName}</p>
            <p className="text-xs text-slate-400 truncate">{ownerEmail}</p>
          </div>
          <RoleBadge role="owner" />
        </div>

        {acceptedInvites.map((invite) => (
          <div key={invite.id} className="flex items-center gap-4 px-6 py-4 border-t border-slate-50">
            <div className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0",
              avatarColor(invite.email)
            )}>
              {initials(invite.email)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{invite.email}</p>
              <p className="text-xs text-slate-400">Joined {timeAgo(invite.invitedAt)}</p>
            </div>
            <RoleSelect
              value={invite.role}
              onChange={(r) => handleChangeRole(invite.id, r)}
            />
            {removingId === invite.id ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRemove(invite.id)}
                  className="text-xs text-red-600 font-semibold hover:underline"
                >
                  Remove?
                </button>
                <button
                  onClick={() => setRemovingId(null)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setRemovingId(invite.id)}
                className="text-slate-300 hover:text-red-400 transition-colors"
                title="Remove member"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Pending invites */}
      {pendingInvites.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Pending invites
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                {pendingInvites.length}
              </span>
            </h2>
          </div>
          <div className="divide-y divide-slate-50">
            {pendingInvites.map((invite) => (
              <div key={invite.id} className="flex items-center gap-4 px-6 py-4">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{invite.email}</p>
                  <p className="text-xs text-slate-400">
                    Invited {timeAgo(invite.invitedAt)} · Awaiting acceptance
                  </p>
                </div>
                <RoleSelect
                  value={invite.role}
                  onChange={(r) => handleChangeRole(invite.id, r)}
                />
                <button
                  onClick={() => handleCopyLink(invite.id)}
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all",
                    copiedId === invite.id
                      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                      : "text-slate-500 bg-slate-50 border-slate-200 hover:border-slate-300"
                  )}
                  title="Copy invite link"
                >
                  {copiedId === invite.id ? (
                    <><Check className="w-3 h-3" />Copied</>
                  ) : (
                    <><Copy className="w-3 h-3" />Copy link</>
                  )}
                </button>
                {removingId === invite.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRemove(invite.id)}
                      className="text-xs text-red-600 font-semibold hover:underline"
                    >
                      Revoke?
                    </button>
                    <button
                      onClick={() => setRemovingId(null)}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setRemovingId(invite.id)}
                    className="text-slate-300 hover:text-red-400 transition-colors"
                    title="Revoke invite"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty invite state */}
      {invites.length === 0 && (
        <div className="border border-dashed border-slate-200 rounded-2xl p-10 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-slate-700 mb-1">No teammates yet</p>
          <p className="text-xs text-slate-400 mb-4">
            Invite your lawyer, accountant, or co-founder to collaborate.
          </p>
          <button
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center gap-2 bg-[#1B2B4B] hover:bg-[#243461] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Invite your first teammate
          </button>
        </div>
      )}
    </div>
  )
}
