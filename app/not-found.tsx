import Link from "next/link"
import { Shield, ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-12">
          <div className="w-7 h-7 bg-[#1B2B4B] rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="font-bold text-[#1B2B4B] text-base">
            GoodStanding<span className="text-emerald-500">.ai</span>
          </span>
        </Link>

        {/* 404 */}
        <div className="mb-6">
          <p className="text-8xl font-black text-slate-100 select-none leading-none mb-2">404</p>
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto -mt-4">
            <Search className="w-6 h-6 text-slate-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-3">Page not found</h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
          This page doesn&apos;t exist or may have moved. Check the URL or head back to your dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#1B2B4B] text-white text-sm font-semibold hover:bg-[#243461] transition-colors"
          >
            Go to dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
