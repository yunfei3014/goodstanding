"use client"

import Link from "next/link"
import { CheckCircle2, Circle, ChevronRight, X, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export type ChecklistItem = {
  id: string
  label: string
  description: string
  done: boolean
  href: string
  cta: string
}

export function SetupChecklist({
  companyId,
  items,
  onDismiss,
}: {
  companyId: string
  items: ChecklistItem[]
  onDismiss: () => void
}) {
  const doneCount = items.filter((i) => i.done).length
  const total = items.length
  const allDone = doneCount === total
  const pct = Math.round((doneCount / total) * 100)

  if (allDone) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-5 flex items-center gap-4 mb-6">
        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-emerald-900">Setup complete!</p>
          <p className="text-sm text-emerald-700 mt-0.5">
            Your company profile is fully set up and all compliance items are in order.
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100 rounded-lg transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#1B2B4B] rounded-xl flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Finish setting up your company</h3>
            <p className="text-xs text-slate-400 mt-0.5">{doneCount} of {total} steps complete</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Progress pill */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-500">{pct}%</span>
          </div>
          <button
            onClick={onDismiss}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Checklist items */}
      <div className="divide-y divide-slate-50">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-4 px-6 py-4 transition-colors",
              item.done ? "opacity-60" : "hover:bg-slate-50/60"
            )}
          >
            {/* Step number / checkmark */}
            <div className="flex-shrink-0">
              {item.done ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center">
                  <span className="text-xs font-bold text-slate-400">{i + 1}</span>
                </div>
              )}
            </div>

            {/* Label + description */}
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm font-semibold",
                item.done ? "text-slate-400 line-through" : "text-slate-900"
              )}>
                {item.label}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
            </div>

            {/* CTA */}
            {!item.done && (
              <Link
                href={item.href}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
              >
                {item.cta}
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
            {item.done && (
              <span className="text-xs font-semibold text-emerald-600 flex-shrink-0">Done ✓</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
