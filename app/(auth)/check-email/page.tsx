"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Shield, Mail } from "lucide-react"

function CheckEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") ?? "your email"

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex items-center px-6 h-16 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#1B2B4B] rounded-lg flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="font-bold text-[#1B2B4B] text-base">
            GoodStanding<span className="text-emerald-500">.ai</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-14 h-14 bg-[#1B2B4B]/5 rounded-full flex items-center justify-center mx-auto mb-5">
            <Mail className="w-7 h-7 text-[#1B2B4B]" />
          </div>
          <h1 className="text-3xl font-bold text-[#1B2B4B] mb-3">Check your email</h1>
          <p className="text-slate-500 mb-2">
            We sent a confirmation link to
          </p>
          <p className="font-semibold text-[#1B2B4B] mb-6">{email}</p>
          <p className="text-sm text-slate-400 mb-8">
            Click the link in the email to confirm your account and access your dashboard.
            The link expires in 24 hours.
          </p>

          <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Didn&apos;t get it?
            </p>
            <ul className="text-sm text-slate-500 space-y-1">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure you typed your email correctly</li>
              <li>
                •{" "}
                <Link href="/signup" className="text-emerald-600 hover:underline">
                  Try signing up again
                </Link>
              </li>
            </ul>
          </div>

          <p className="text-sm text-slate-400 mt-6">
            Already confirmed?{" "}
            <Link href="/login" className="text-emerald-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <CheckEmailContent />
    </Suspense>
  )
}
