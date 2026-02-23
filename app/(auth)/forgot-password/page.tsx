"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Mail, CheckCircle2, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

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
        <div className="w-full max-w-sm">
          {sent ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-bold text-[#1B2B4B] mb-2">Check your email</h1>
              <p className="text-slate-500 mb-6">
                We sent a password reset link to <strong>{email}</strong>.
              </p>
              <Link href="/login" className="text-sm text-emerald-600 hover:underline flex items-center justify-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1 mb-6">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
              </Link>
              <h1 className="text-3xl font-bold text-[#1B2B4B] mb-2">Forgot password?</h1>
              <p className="text-slate-500 mb-8">
                Enter your email and we&apos;ll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className="mt-1.5"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#1B2B4B] hover:bg-[#243461] text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
