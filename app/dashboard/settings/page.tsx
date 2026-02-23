"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase"
import type { Company } from "@/lib/supabase"
import { Shield, Bell, Building2, Users, KeyRound, CheckCircle2, Link } from "lucide-react"

const PLAN_LABELS: Record<string, { label: string; price: string; features: string }> = {
  launch:     { label: "Launch",     price: "$49/mo",  features: "Registered agent (1 state) · Annual report filing" },
  essentials: { label: "Essentials", price: "$99/mo",  features: "Registered agent (2 states) · Annual reports · EIN filing" },
  growth:     { label: "Growth",     price: "$249/mo", features: "Registered agent (3 states) · 2 gov't liaison calls/month" },
  scale:      { label: "Scale",      price: "$499/mo", features: "Registered agent (unlimited) · Unlimited liaison calls" },
}

const NEXT_PLAN: Record<string, string> = {
  launch: "essentials", essentials: "growth", growth: "scale",
}

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 mt-0.5 ${
        enabled ? "bg-emerald-500" : "bg-slate-200"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-4" : "translate-x-1"
        }`}
      />
    </button>
  )
}

export default function SettingsPage() {
  const [user, setUser] = useState<{ id: string; email: string; full_name: string } | null>(null)
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  // Account form
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState("")

  // Password form
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState("")

  // Notifications
  const [notifications, setNotifications] = useState([
    { key: "filing_reminders",  label: "Filing deadline reminders",      desc: "30 days, 7 days, and 1 day before",                           enabled: true },
    { key: "gov_notices",       label: "Government notices received",     desc: "When new mail arrives at your registered agent",              enabled: true },
    { key: "liaison_updates",   label: "Government liaison updates",      desc: "When your EA completes a call or resolves an issue",          enabled: true },
    { key: "standing_alerts",   label: "Good standing alerts",            desc: "If any entity loses good standing",                           enabled: true },
    { key: "monthly_summary",   label: "Monthly compliance summary",      desc: "Monthly digest of your compliance status",                    enabled: false },
  ])

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        setUser({ id: authUser.id, email: authUser.email ?? "", full_name: authUser.user_metadata?.full_name ?? "" })
        setFullName(authUser.user_metadata?.full_name ?? "")
        setEmail(authUser.email ?? "")
      }
      const { data: companiesData } = await supabase.from("companies").select("*").order("created_at", { ascending: true })
      setCompanies(companiesData ?? [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleSaveAccount() {
    if (!user) return
    setSaving(true)
    setSaveMsg("")
    const supabase = createClient()
    const updates: Record<string, unknown> = { data: { full_name: fullName } }
    if (email !== user.email) updates.email = email
    const { error } = await supabase.auth.updateUser(updates)
    setSaving(false)
    setSaveMsg(error ? `Error: ${error.message}` : "Saved!")
    setTimeout(() => setSaveMsg(""), 3000)
  }

  async function handleChangePassword() {
    if (newPassword !== confirmPassword) {
      setPasswordMsg("Passwords don't match.")
      return
    }
    if (newPassword.length < 8) {
      setPasswordMsg("Password must be at least 8 characters.")
      return
    }
    setPasswordSaving(true)
    setPasswordMsg("")
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPasswordSaving(false)
    if (error) {
      setPasswordMsg(`Error: ${error.message}`)
    } else {
      setPasswordMsg("Password updated!")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => setPasswordMsg(""), 3000)
    }
  }

  const plan = companies[0]?.plan ?? "launch"
  const planInfo = PLAN_LABELS[plan] ?? PLAN_LABELS.launch
  const nextPlan = NEXT_PLAN[plan]
  const nextPlanInfo = nextPlan ? PLAN_LABELS[nextPlan] : null

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Settings</h1>
        <p className="text-slate-500">Manage your account, companies, and billing.</p>
      </div>

      {/* Plan banner */}
      <div className="bg-[#1B2B4B] rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-emerald-400" />
              <p className="text-white font-bold">{planInfo.label} plan</p>
              <Badge variant="green">Active</Badge>
            </div>
            <p className="text-slate-400 text-sm">{planInfo.price} · {planInfo.features}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-white font-bold">{planInfo.price.split("/")[0]}</p>
            <p className="text-slate-400 text-xs">per month</p>
          </div>
        </div>
        {nextPlanInfo && (
          <div className="mt-4 flex gap-3">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm">
              Upgrade to {PLAN_LABELS[nextPlan!].label}
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 text-sm">
              Manage billing
            </Button>
          </div>
        )}
      </div>

      {/* Account */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-4">
        <div className="flex items-center gap-2 mb-5">
          <Users className="w-4 h-4 text-slate-500" />
          <h2 className="font-bold text-slate-900">Account</h2>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="bg-[#1B2B4B] hover:bg-[#243461] text-white"
              onClick={handleSaveAccount}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save changes"}
            </Button>
            {saveMsg && (
              <span className={`text-sm flex items-center gap-1 ${saveMsg.startsWith("Error") ? "text-red-600" : "text-emerald-600"}`}>
                {!saveMsg.startsWith("Error") && <CheckCircle2 className="w-3.5 h-3.5" />}
                {saveMsg}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-4">
        <div className="flex items-center gap-2 mb-5">
          <KeyRound className="w-4 h-4 text-slate-500" />
          <h2 className="font-bold text-slate-900">Change password</h2>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="bg-[#1B2B4B] hover:bg-[#243461] text-white"
              onClick={handleChangePassword}
              disabled={passwordSaving || !newPassword}
            >
              {passwordSaving ? "Updating..." : "Update password"}
            </Button>
            {passwordMsg && (
              <span className={`text-sm flex items-center gap-1 ${passwordMsg.startsWith("Error") || passwordMsg.includes("don't") || passwordMsg.includes("least") ? "text-red-600" : "text-emerald-600"}`}>
                {!passwordMsg.startsWith("Error") && !passwordMsg.includes("don't") && !passwordMsg.includes("least") && <CheckCircle2 className="w-3.5 h-3.5" />}
                {passwordMsg}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-4">
        <div className="flex items-center gap-2 mb-5">
          <Bell className="w-4 h-4 text-slate-500" />
          <h2 className="font-bold text-slate-900">Notifications</h2>
        </div>
        <div className="space-y-1">
          {notifications.map((item) => (
            <div key={item.key} className="flex items-start justify-between py-3 border-b border-slate-50 last:border-0">
              <div>
                <p className="font-medium text-slate-900 text-sm">{item.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
              </div>
              <Toggle
                enabled={item.enabled}
                onToggle={() =>
                  setNotifications((prev) =>
                    prev.map((n) => n.key === item.key ? { ...n, enabled: !n.enabled } : n)
                  )
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Companies */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-500" />
            <h2 className="font-bold text-slate-900">Companies</h2>
          </div>
          <a href="/signup">
            <Button size="sm" className="bg-[#1B2B4B] text-white hover:bg-[#243461] text-xs">
              + Add company
            </Button>
          </a>
        </div>
        {companies.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">No companies yet.</p>
        ) : (
          <div className="space-y-1">
            {companies.map((company) => (
              <div key={company.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                <div>
                  <p className="font-medium text-slate-900 text-sm">{company.name}</p>
                  <p className="text-xs text-slate-400">
                    {company.entity_type === "c_corp" ? "C-Corporation" : company.entity_type === "s_corp" ? "S-Corporation" : "LLC"}
                    {" · "}{company.state_of_incorporation}
                    {" · "}{PLAN_LABELS[company.plan]?.label ?? company.plan} plan
                  </p>
                </div>
                <Badge variant={company.status === "good_standing" ? "green" : company.status === "attention_needed" ? "yellow" : "red"}>
                  {company.status === "good_standing" ? "Good Standing" : company.status === "attention_needed" ? "Action Needed" : "Critical"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
