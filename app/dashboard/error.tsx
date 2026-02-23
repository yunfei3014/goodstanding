"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RotateCcw, Home } from "lucide-react"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-5">
        <AlertTriangle className="w-6 h-6 text-amber-500" />
      </div>
      <h2 className="text-lg font-bold text-slate-900 mb-2">Something went wrong</h2>
      <p className="text-sm text-slate-500 mb-1 max-w-xs">
        An unexpected error occurred loading this page. Your data is safe.
      </p>
      {error.digest && (
        <p className="text-xs text-slate-400 font-mono mb-6">Error: {error.digest}</p>
      )}
      {!error.digest && <div className="mb-6" />}
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B2B4B] text-white text-sm font-semibold rounded-xl hover:bg-[#243461] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Try again
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          Dashboard home
        </Link>
      </div>
    </div>
  )
}
