"use client"

import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/marketing/Navbar"
import Footer from "@/components/marketing/Footer"
import { Shield, Mail, MessageSquare, CheckCircle2 } from "lucide-react"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" })
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const update = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all required fields.")
      return
    }
    setSubmitting(true)
    setError("")
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setSubmitting(false)
    if (res.ok) {
      setSent(true)
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? "Something went wrong. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-24 px-4">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="flex items-center gap-2 justify-center mb-3">
              <div className="w-8 h-8 bg-[#1B2B4B] rounded-xl flex items-center justify-center">
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-bold text-[#1B2B4B] text-base">GoodStanding.ai</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Get in touch</h1>
            <p className="text-slate-500 text-lg">
              Questions about compliance, pricing, or our government liaison service? We respond within one business day.
            </p>
          </div>

          {sent ? (
            <div className="bg-white border border-emerald-200 rounded-3xl p-10 shadow-xl text-center">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Message sent</h2>
              <p className="text-slate-500 mb-6">
                Thanks for reaching out, <strong>{form.name}</strong>. We&apos;ll get back to you at{" "}
                <strong>{form.email}</strong> shortly.
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-[#1B2B4B] text-white text-sm font-bold rounded-xl hover:bg-[#243461] transition-colors"
              >
                Back to home
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={update("name")}
                      placeholder="Alex Chen"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={update("email")}
                      placeholder="alex@startup.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Company <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={update("company")}
                    placeholder="Acme Corp"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={update("message")}
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[#1B2B4B] hover:bg-[#243461] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-70"
                >
                  {submitting ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                  ) : (
                    <><MessageSquare className="w-4 h-4" />Send message</>
                  )}
                </button>
              </form>

              {/* Alt contact */}
              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-3 text-sm text-slate-500">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>Or email us directly at{" "}
                  <a href="mailto:hello@goodstanding.ai" className="text-emerald-600 font-semibold hover:underline">
                    hello@goodstanding.ai
                  </a>
                </span>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
