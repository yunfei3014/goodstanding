"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import type { Company, Filing } from "@/lib/supabase"
import { generateDefaultFilings } from "@/lib/filings"
import { CompanyContext } from "@/lib/company-context"
import { AddCompanyModal } from "@/components/dashboard/AddCompanyModal"
import {
  Shield,
  LayoutDashboard,
  FileCheck,
  FolderOpen,
  Phone,
  Settings,
  Building2,
  ChevronDown,
  Bell,
  LogOut,
  Plus,
  Menu,
  X,
  CalendarDays,
  AlertCircle,
  XCircle,
  CheckCircle2,
  ArrowRight,
  Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/compliance", icon: FileCheck, label: "Compliance" },
  { href: "/dashboard/documents", icon: FolderOpen, label: "Documents" },
  { href: "/dashboard/calendar", icon: CalendarDays, label: "Calendar" },
  { href: "/dashboard/activity", icon: Activity, label: "Activity" },
  { href: "/dashboard/government", icon: Phone, label: "Government Liaison" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

function StatusDot({ status }: { status: string }) {
  return (
    <div className={cn(
      "w-2 h-2 rounded-full flex-shrink-0",
      status === "good_standing" && "bg-emerald-400",
      status === "attention_needed" && "bg-amber-400",
      status === "action_required" && "bg-red-400",
    )} />
  )
}

function formatDueDate(due: string) {
  const d = new Date(due + "T12:00:00")
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function daysUntil(due: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = new Date(due + "T00:00:00")
  return Math.round((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function NotificationPanel({
  filings,
  companies,
  onClose,
}: {
  filings: Filing[]
  companies: Company[]
  onClose: () => void
}) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().slice(0, 10)
  const in7 = new Date(today); in7.setDate(in7.getDate() + 7)
  const in7Str = in7.toISOString().slice(0, 10)
  const in30 = new Date(today); in30.setDate(in30.getDate() + 30)
  const in30Str = in30.toISOString().slice(0, 10)

  const overdue = filings.filter((f) => f.status === "overdue")
  const thisWeek = filings.filter(
    (f) => f.status === "pending" && f.due_date >= todayStr && f.due_date <= in7Str
  )
  const upcoming = filings.filter(
    (f) => f.status === "pending" && f.due_date > in7Str && f.due_date <= in30Str
  )

  const companyName = (id: string) => companies.find((c) => c.id === id)?.name ?? ""
  const total = overdue.length + thisWeek.length + upcoming.length

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-600" />
          <h3 className="font-bold text-slate-900">Notifications</h3>
          {total > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
              {total}
            </span>
          )}
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {total === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-slate-700">All clear</p>
              <p className="text-sm text-slate-400 mt-0.5">No upcoming deadlines in the next 30 days.</p>
            </div>
          </div>
        ) : (
          <div>
            {/* Overdue */}
            {overdue.length > 0 && (
              <div>
                <div className="flex items-center gap-2 px-5 pt-4 pb-2">
                  <XCircle className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Overdue</span>
                </div>
                {overdue.map((f) => (
                  <div key={f.id} className="flex items-start gap-3 px-5 py-3 hover:bg-red-50/50 transition-colors">
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <XCircle className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{f.type}</p>
                      <p className="text-xs text-slate-400">
                        {companies.length > 1 && <span className="text-slate-500 font-medium">{companyName(f.company_id)} · </span>}
                        {f.state}
                        {f.due_date && <span className="text-red-500 font-semibold"> · Due {formatDueDate(f.due_date)}</span>}
                      </p>
                    </div>
                    {f.amount && (
                      <span className="text-xs text-slate-400 flex-shrink-0">${f.amount.toLocaleString()}</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Due this week */}
            {thisWeek.length > 0 && (
              <div>
                <div className="flex items-center gap-2 px-5 pt-4 pb-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">Due this week</span>
                </div>
                {thisWeek.map((f) => {
                  const days = daysUntil(f.due_date)
                  return (
                    <div key={f.id} className="flex items-start gap-3 px-5 py-3 hover:bg-amber-50/50 transition-colors">
                      <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{f.type}</p>
                        <p className="text-xs text-slate-400">
                          {companies.length > 1 && <span className="text-slate-500 font-medium">{companyName(f.company_id)} · </span>}
                          {f.state}
                          <span className="text-amber-600 font-semibold">
                            {" · "}{days === 0 ? "Due today" : days === 1 ? "Due tomorrow" : `Due in ${days} days`}
                          </span>
                        </p>
                      </div>
                      <span className="text-xs text-slate-400 flex-shrink-0">{formatDueDate(f.due_date)}</span>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Coming up (8–30 days) */}
            {upcoming.length > 0 && (
              <div>
                <div className="flex items-center gap-2 px-5 pt-4 pb-2">
                  <CalendarDays className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Coming up</span>
                </div>
                {upcoming.map((f) => (
                  <div key={f.id} className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CalendarDays className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{f.type}</p>
                      <p className="text-xs text-slate-400">
                        {companies.length > 1 && <span className="text-slate-500 font-medium">{companyName(f.company_id)} · </span>}
                        {f.state}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400 flex-shrink-0">{formatDueDate(f.due_date)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 px-5 py-3">
        <Link
          href="/dashboard/compliance"
          onClick={onClose}
          className="flex items-center justify-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          View all filings
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [addCompanyOpen, setAddCompanyOpen] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [filings, setFilings] = useState<Filing[]>([])
  const [user, setUser] = useState<{ email: string; full_name: string; plan: string } | null>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  // Listen for settings page "Add company" event
  useEffect(() => {
    const handler = () => setAddCompanyOpen(true)
    window.addEventListener("open-add-company", handler)
    return () => window.removeEventListener("open-add-company", handler)
  }, [])

  // Close notification panel on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    if (notifOpen) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [notifOpen])

  // Close notification panel on navigation
  useEffect(() => {
    setNotifOpen(false)
  }, [pathname])

  useEffect(() => {
    const supabase = createClient()

    async function loadData() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push("/login")
        return
      }

      setUser({
        email: authUser.email ?? "",
        full_name: authUser.user_metadata?.full_name ?? authUser.email ?? "",
        plan: "launch",
      })

      // Check for pending company setup (created during signup before email confirmation)
      const pendingCompany = authUser.user_metadata?.pending_company
      const { data: existingCompanies } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: true })

      if ((!existingCompanies || existingCompanies.length === 0) && pendingCompany) {
        // First login after email confirmation — create the company now
        const { data: newCompany } = await supabase
          .from("companies")
          .insert({
            user_id: authUser.id,
            name: pendingCompany.name,
            entity_type: pendingCompany.entity_type,
            state_of_incorporation: pendingCompany.state_of_incorporation,
            plan: pendingCompany.plan,
            status: "good_standing",
          })
          .select()
          .single()

        // Clear pending metadata
        await supabase.auth.updateUser({ data: { pending_company: null } })

        if (newCompany) {
          // Seed default compliance filings for new company
          const defaultFilings = generateDefaultFilings(newCompany)
          if (defaultFilings.length > 0) {
            await supabase.from("filings").insert(defaultFilings)
          }
          setCompanies([newCompany])
          setSelectedCompany(newCompany)
          setUser(prev => prev ? { ...prev, plan: newCompany.plan } : prev)
          // Force page components to re-fetch now that company + filings are in DB
          router.refresh()
        }
      } else if (existingCompanies && existingCompanies.length > 0) {
        setCompanies(existingCompanies)
        setSelectedCompany(existingCompanies[0])
        setUser(prev => prev ? { ...prev, plan: existingCompanies[0].plan } : prev)

        // Seed filings for any company that has none yet
        const { data: existingFilings } = await supabase
          .from("filings")
          .select("id")
          .limit(1)
        if (!existingFilings || existingFilings.length === 0) {
          const allFilings = existingCompanies.flatMap((c: Company) => generateDefaultFilings(c))
          if (allFilings.length > 0) {
            await supabase.from("filings").insert(allFilings)
            router.refresh()
          }
        }
      }
    }

    loadData()
  }, [router])

  // Load filings for notification panel whenever companies load
  useEffect(() => {
    if (companies.length === 0) return
    const supabase = createClient()
    supabase
      .from("filings")
      .select("*")
      .in("company_id", companies.map((c) => c.id))
      .neq("status", "completed")
      .order("due_date", { ascending: true })
      .then(({ data }) => setFilings(data ?? []))
  }, [companies])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const initials = user?.full_name
    ? user.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?"

  // Badge: count of overdue + due within 7 days
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const in7 = new Date(today); in7.setDate(in7.getDate() + 7)
  const todayStr = today.toISOString().slice(0, 10)
  const in7Str = in7.toISOString().slice(0, 10)
  const urgentCount = filings.filter(
    (f) => f.status === "overdue" || (f.status === "pending" && f.due_date >= todayStr && f.due_date <= in7Str)
  ).length

  function handleCompanyAdded(company: Company) {
    setCompanies((prev) => [...prev, company])
    setSelectedCompany(company)
    setAddCompanyOpen(false)
    // Refresh notification filings list
    const supabase = createClient()
    supabase
      .from("filings")
      .select("*")
      .in("company_id", [...companies.map((c) => c.id), company.id])
      .neq("status", "completed")
      .order("due_date", { ascending: true })
      .then(({ data }) => setFilings(data ?? []))
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {addCompanyOpen && (
        <AddCompanyModal
          onClose={() => setAddCompanyOpen(false)}
          onAdded={handleCompanyAdded}
        />
      )}
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-[#0F1829] flex flex-col transition-transform duration-200 lg:static lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/10">
          <div className="w-7 h-7 bg-emerald-500/10 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="font-bold text-white text-base">
            GoodStanding<span className="text-emerald-400">.ai</span>
          </span>
        </div>

        {/* Company selector */}
        <div className="px-3 py-3 border-b border-white/10">
          <button
            onClick={() => setCompanyMenuOpen(!companyMenuOpen)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="w-7 h-7 bg-[#1B2B4B] rounded-md flex items-center justify-center flex-shrink-0">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {selectedCompany?.name ?? "Loading..."}
              </p>
              <p className="text-white/40 text-xs">Switch company</p>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-white/40 transition-transform", companyMenuOpen && "rotate-180")} />
          </button>

          {companyMenuOpen && (
            <div className="mt-1 bg-[#1B2B4B] rounded-lg border border-white/10 overflow-hidden">
              {companies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => {
                    setSelectedCompany(company)
                    setCompanyMenuOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 transition-colors",
                    selectedCompany?.id === company.id && "bg-white/5"
                  )}
                >
                  <StatusDot status={company.status} />
                  <span className="text-white/80 text-sm">{company.name}</span>
                </button>
              ))}
              <div className="border-t border-white/10">
                <button
                  onClick={() => { setCompanyMenuOpen(false); setAddCompanyOpen(true) }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-emerald-400 hover:bg-white/10 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="text-sm">Add company</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white/90 hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-4 h-4", active ? "text-emerald-400" : "text-white/40")} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="px-3 pb-4 border-t border-white/10 pt-3">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-bold text-sm flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user?.full_name ?? "Loading..."}
              </p>
              <p className="text-white/40 text-xs capitalize">{user?.plan ?? "launch"} plan</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-white/40 hover:text-white/70 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
          <button
            className="lg:hidden p-2 text-slate-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="hidden lg:block">
            <h1 className="text-sm font-semibold text-slate-900">
              {navItems.find((n) => n.href === pathname)?.label || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Notification bell */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                {urgentCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                    {urgentCount > 9 ? "9+" : urgentCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <NotificationPanel
                  filings={filings}
                  companies={companies}
                  onClose={() => setNotifOpen(false)}
                />
              )}
            </div>

            <button
              onClick={() => setAddCompanyOpen(true)}
              className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add company
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <CompanyContext.Provider value={{ companies, selectedCompany }}>
            {children}
          </CompanyContext.Provider>
        </main>
      </div>
    </div>
  )
}
