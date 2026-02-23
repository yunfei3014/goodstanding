"use client"

import { useState, useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase"
import { useCompany } from "@/lib/company-context"
import type { Filing } from "@/lib/supabase"
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

function statusChipClass(status: string) {
  if (status === "completed") return "bg-emerald-100 text-emerald-700 border-emerald-200"
  if (status === "overdue")   return "bg-red-100 text-red-700 border-red-200"
  return "bg-amber-100 text-amber-700 border-amber-200"
}

function StatusIcon({ status }: { status: string }) {
  if (status === "completed") return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
  if (status === "overdue")   return <XCircle className="w-3.5 h-3.5 text-red-500" />
  return <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
}

function statusLabel(status: string) {
  if (status === "completed") return "Filed"
  if (status === "overdue")   return "Overdue"
  return "Pending"
}

function statusLabelClass(status: string) {
  if (status === "completed") return "text-emerald-600"
  if (status === "overdue")   return "text-red-600"
  return "text-amber-600"
}

export default function CalendarPage() {
  const { selectedCompany } = useCompany()
  const [filings, setFilings] = useState<Filing[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedCompany) return
    const supabase = createClient()
    async function load(companyId: string) {
      setLoading(true)
      const { data } = await supabase
        .from("filings")
        .select("*")
        .eq("company_id", companyId)
        .order("due_date", { ascending: true })
      setFilings(data ?? [])
      setLoading(false)
    }
    load(selectedCompany.id)
  }, [selectedCompany])

  // Build the 42-cell calendar grid
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDayOfWeek = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    const cells: { date: string; day: number; isCurrentMonth: boolean }[] = []

    // Trailing days from prev month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i
      const pm = month === 0 ? 11 : month - 1
      const py = month === 0 ? year - 1 : year
      cells.push({
        date: `${py}-${String(pm + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
        day: d,
        isCurrentMonth: false,
      })
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        date: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
        day: d,
        isCurrentMonth: true,
      })
    }

    // Leading days of next month to fill 42 slots
    const remaining = 42 - cells.length
    for (let d = 1; d <= remaining; d++) {
      const nm = month === 11 ? 0 : month + 1
      const ny = month === 11 ? year + 1 : year
      cells.push({
        date: `${ny}-${String(nm + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
        day: d,
        isCurrentMonth: false,
      })
    }

    return cells
  }, [currentMonth])

  // Index filings by YYYY-MM-DD
  const filingsByDate = useMemo(() => {
    const map: Record<string, Filing[]> = {}
    for (const filing of filings) {
      if (!filing.due_date) continue
      const key = filing.due_date.slice(0, 10)
      if (!map[key]) map[key] = []
      map[key].push(filing)
    }
    return map
  }, [filings])

  const today = new Date().toISOString().slice(0, 10)
  const selectedFilings = selectedDate ? (filingsByDate[selectedDate] ?? []) : []

  const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`
  const monthFilings = filings.filter((f) => f.due_date?.startsWith(monthKey))

  if (!selectedCompany) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <CalendarDays className="w-10 h-10 text-slate-300" />
        <p className="text-slate-400 text-sm">Select a company to view its compliance calendar.</p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Compliance Calendar</h1>
        <p className="text-slate-500 text-sm">
          {selectedCompany.name} · All filing deadlines at a glance
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Calendar panel */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Month navigation */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <button
              onClick={() => setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-slate-900 text-lg">
              {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            <button
              onClick={() => setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
            {DAY_HEADERS.map((d) => (
              <div key={d} className="py-2.5 text-center text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-7">
              {calendarDays.map(({ date, day, isCurrentMonth }) => {
                const dayFilings = filingsByDate[date] ?? []
                const isToday = date === today
                const isSelected = date === selectedDate
                const hasFilings = dayFilings.length > 0

                return (
                  <div
                    key={date}
                    onClick={() => setSelectedDate(isSelected ? null : date)}
                    className={cn(
                      "min-h-[88px] p-2 border-b border-r border-slate-100 cursor-pointer transition-colors",
                      !isCurrentMonth && "bg-slate-50/60",
                      isCurrentMonth && !isSelected && "hover:bg-slate-50",
                      isSelected && "bg-emerald-50 hover:bg-emerald-50 ring-1 ring-inset ring-emerald-200",
                    )}
                  >
                    <div className="mb-1.5">
                      <span className={cn(
                        "text-sm w-6 h-6 flex items-center justify-center rounded-full font-medium",
                        !isCurrentMonth && "text-slate-300",
                        isCurrentMonth && !isToday && "text-slate-700",
                        isToday && "bg-[#1B2B4B] text-white font-bold",
                      )}>
                        {day}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      {dayFilings.slice(0, 2).map((filing) => (
                        <div
                          key={filing.id}
                          className={cn(
                            "text-xs px-1.5 py-0.5 rounded border truncate leading-tight",
                            statusChipClass(filing.status)
                          )}
                          title={filing.type}
                        >
                          {filing.type}
                        </div>
                      ))}
                      {dayFilings.length > 2 && (
                        <div className="text-xs text-slate-400 pl-1 font-medium">
                          +{dayFilings.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className="xl:w-72 space-y-4">
          {/* Legend */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-semibold text-slate-900 text-sm mb-3">Legend</h3>
            <div className="space-y-2">
              {[
                { chip: "bg-amber-100 border-amber-200", label: "Pending" },
                { chip: "bg-red-100 border-red-200",    label: "Overdue" },
                { chip: "bg-emerald-100 border-emerald-200", label: "Filed" },
              ].map(({ chip, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className={cn("w-4 h-3 rounded border", chip)} />
                  <span className="text-sm text-slate-600">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Month summary */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-semibold text-slate-900 text-sm mb-3">
              {MONTHS[currentMonth.getMonth()]} summary
            </h3>
            <div className="space-y-2.5">
              {[
                { label: "Total filings", value: monthFilings.length, cls: "text-slate-900" },
                { label: "Pending",  value: monthFilings.filter((f) => f.status === "pending").length,   cls: "text-amber-700" },
                { label: "Overdue",  value: monthFilings.filter((f) => f.status === "overdue").length,   cls: "text-red-700" },
                { label: "Filed",    value: monthFilings.filter((f) => f.status === "completed").length, cls: "text-emerald-700" },
              ].map(({ label, value, cls }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">{label}</span>
                  <span className={cn("text-sm font-bold", cls)}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected date detail */}
          {selectedDate ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-semibold text-slate-900 text-sm mb-3">
                {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              {selectedFilings.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No filings due this day.</p>
              ) : (
                <div className="space-y-3">
                  {selectedFilings.map((filing) => (
                    <div key={filing.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50">
                      <div className={cn("flex items-center gap-1.5 mb-1 text-xs font-semibold", statusLabelClass(filing.status))}>
                        <StatusIcon status={filing.status} />
                        {statusLabel(filing.status)}
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{filing.type}</p>
                      <p className="text-xs text-slate-400">{filing.state}</p>
                      {filing.amount && (
                        <p className="text-xs text-slate-500 mt-1">${filing.amount.toLocaleString()}</p>
                      )}
                      {filing.notes && (
                        <p className="text-xs text-slate-400 mt-1 italic">{filing.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-slate-200 p-6 text-center">
              <CalendarDays className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">
                Click any day to view filings due on that date.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
