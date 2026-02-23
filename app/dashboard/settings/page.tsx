"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield, CreditCard, Bell, Building2, Users } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Settings</h1>
        <p className="text-slate-500">Manage your account, companies, and billing.</p>
      </div>

      {/* Plan */}
      <div className="bg-[#1B2B4B] rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-emerald-400" />
              <p className="text-white font-bold">Growth plan</p>
              <Badge variant="green">Active</Badge>
            </div>
            <p className="text-slate-400 text-sm">$249/month · Registered agent (3 states) · 2 gov't liaison calls/month</p>
          </div>
          <div className="text-right">
            <p className="text-white font-bold">$249</p>
            <p className="text-slate-400 text-xs">per month</p>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm">
            Upgrade to Scale
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 text-sm">
            Manage billing
          </Button>
        </div>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-4">
        <div className="flex items-center gap-2 mb-5">
          <Users className="w-4 h-4 text-slate-500" />
          <h2 className="font-bold text-slate-900">Account</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" defaultValue="Fei" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" defaultValue="M." className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="fei@goodstanding.ai" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="phone">Phone (for urgent notices)</Label>
            <Input id="phone" type="tel" placeholder="+1 (415) 555-0000" className="mt-1.5" />
          </div>
          <Button className="bg-[#1B2B4B] hover:bg-[#243461] text-white">
            Save changes
          </Button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-4">
        <div className="flex items-center gap-2 mb-5">
          <Bell className="w-4 h-4 text-slate-500" />
          <h2 className="font-bold text-slate-900">Notifications</h2>
        </div>
        <div className="space-y-4">
          {[
            { label: "Filing deadline reminders", desc: "30 days, 7 days, and 1 day before", enabled: true },
            { label: "Government notices received", desc: "When new mail arrives at your registered agent", enabled: true },
            { label: "Government liaison updates", desc: "When your EA completes a call or resolves an issue", enabled: true },
            { label: "Good standing alerts", desc: "If any entity loses good standing", enabled: true },
            { label: "Monthly compliance summary", desc: "Monthly digest of your compliance status", enabled: false },
          ].map((item, i) => (
            <div key={i} className="flex items-start justify-between py-3 border-b border-slate-50 last:border-0">
              <div>
                <p className="font-medium text-slate-900 text-sm">{item.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
              </div>
              <button
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 mt-0.5 ${
                  item.enabled ? "bg-emerald-500" : "bg-slate-200"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    item.enabled ? "translate-x-4" : "translate-x-1"
                  }`}
                />
              </button>
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
          <Button size="sm" className="bg-[#1B2B4B] text-white hover:bg-[#243461] text-xs">
            + Add company
          </Button>
        </div>
        <div className="space-y-3">
          {[
            { name: "Prism AI, Inc.", type: "Delaware C-Corp", status: "good_standing", plan: "Growth" },
            { name: "Beacon Health, LLC", type: "Wyoming LLC", status: "attention_needed", plan: "Essentials" },
          ].map((company, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
              <div>
                <p className="font-medium text-slate-900 text-sm">{company.name}</p>
                <p className="text-xs text-slate-400">{company.type} · {company.plan}</p>
              </div>
              <Badge variant={company.status === "good_standing" ? "green" : "yellow"}>
                {company.status === "good_standing" ? "Good Standing" : "Action Needed"}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
