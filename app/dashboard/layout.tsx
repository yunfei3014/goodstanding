"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import type { Company } from "@/lib/supabase"
import { generateDefaultFilings } from "@/lib/filings"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/compliance", icon: FileCheck, label: "Compliance" },
  { href: "/dashboard/documents", icon: FolderOpen, label: "Documents" },
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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [user, setUser] = useState<{ email: string; full_name: string; plan: string } | null>(null)

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

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const initials = user?.full_name
    ? user.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?"

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
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
                <Link
                  href="/signup"
                  className="flex items-center gap-2 px-3 py-2.5 text-emerald-400 hover:bg-white/10 transition-colors"
                  onClick={() => setCompanyMenuOpen(false)}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="text-sm">Add company</span>
                </Link>
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
            <button className="relative p-2 text-slate-500 hover:text-slate-700">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <Link href="/signup">
              <button className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                <Plus className="w-3.5 h-3.5" />
                Add company
              </button>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
