"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Lock, CheckCircle2 } from "lucide-react"

function ResetPasswordContent() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError("Passwords don't match.")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    setLoading(true)
    setError("")
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setDone(true)
      setTimeout(() => router.push("/dashboard"), 2000)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#1B2B4B] mb-2">Password updated</h1>
          <p className="text-slate-500">Taking you to your dashboard...</p>
        </div>
      </div>
    )
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
          <h1 className="text-3xl font-bold text-[#1B2B4B] mb-2">Set new password</h1>
          <p className="text-slate-500 mb-8">Choose a strong password for your account.</p>

          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <Label htmlFor="password" className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> New password
              </Label>
              <Input
                id="password"
                type="password"
                className="mt-1.5"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirm" className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Confirm password
              </Label>
              <Input
                id="confirm"
                type="password"
                className="mt-1.5"
                placeholder="Repeat your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
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
                  Updating...
                </span>
              ) : (
                "Update password"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
