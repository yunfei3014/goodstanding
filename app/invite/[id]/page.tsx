import { createClient } from "@supabase/supabase-js"
import Link from "next/link"
import { Shield, CheckCircle2, XCircle, Users } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Accept invitation — GoodStanding.ai",
  description: "You've been invited to join a GoodStanding.ai workspace.",
}

type Props = { params: Promise<{ id: string }> }

export default async function InvitePage({ params }: Props) {
  const { id } = await params

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) return <ErrorPage message="Server configuration error." />

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  })

  // Look up the invite
  const { data: invite } = await supabase
    .from("team_invites")
    .select("id, email, role, status, owner_id")
    .eq("id", id)
    .single()

  if (!invite) return <ErrorPage message="This invitation link is invalid or has expired." />
  if (invite.status === "accepted") return <AlreadyAccepted />

  // Look up the workspace owner's email
  const { data: authUser } = await supabase.auth.admin.getUserById(invite.owner_id)
  const ownerEmail = authUser?.user?.email ?? "a GoodStanding.ai user"

  const roleLabel = invite.role === "admin" ? "Admin"
    : invite.role === "member" ? "Member"
    : "Viewer"

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 bg-[#1B2B4B] rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="font-bold text-[#1B2B4B] text-lg tracking-tight">
              GoodStanding<span className="text-emerald-500">.ai</span>
            </span>
          </Link>
        </div>

        {/* Invite card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Users className="w-7 h-7 text-emerald-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">You've been invited</h1>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            <strong className="text-slate-700">{ownerEmail}</strong> has invited you to join their{" "}
            GoodStanding.ai workspace as a{" "}
            <span className="inline-flex items-center gap-1 font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg text-xs">
              {roleLabel}
            </span>
          </p>

          <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-left space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">What you'll have access to</p>
            {invite.role === "admin" && (
              <>
                <p className="text-sm text-slate-600">• Add &amp; edit companies and filings</p>
                <p className="text-sm text-slate-600">• Manage documents and government liaison</p>
                <p className="text-sm text-slate-600">• Invite and remove team members</p>
                <p className="text-sm text-slate-600">• Access all compliance reports</p>
              </>
            )}
            {invite.role === "member" && (
              <>
                <p className="text-sm text-slate-600">• View all companies and filings</p>
                <p className="text-sm text-slate-600">• Add and edit filings and documents</p>
                <p className="text-sm text-slate-600">• Log government interactions</p>
              </>
            )}
            {invite.role === "viewer" && (
              <>
                <p className="text-sm text-slate-600">• View filings, documents, and calendar</p>
                <p className="text-sm text-slate-600">• View government interactions</p>
                <p className="text-sm text-slate-600">• Download compliance reports</p>
              </>
            )}
          </div>

          {/* CTA — send to signup with invite context */}
          <Link
            href={`/signup?invite=${id}&email=${encodeURIComponent(invite.email)}`}
            className="block w-full py-3 px-6 bg-[#1B2B4B] hover:bg-[#243461] text-white text-sm font-bold rounded-xl transition-colors text-center mb-3"
          >
            Accept invitation →
          </Link>
          <p className="text-xs text-slate-400">
            Already have an account?{" "}
            <Link href={`/login?invite=${id}`} className="text-emerald-600 font-semibold hover:underline">
              Sign in to accept
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Invitation sent to {invite.email}. If this wasn&apos;t you, you can safely ignore this page.
        </p>
      </div>
    </div>
  )
}

function ErrorPage({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
        <XCircle className="w-7 h-7 text-red-400" />
      </div>
      <h1 className="text-xl font-bold text-slate-900 mb-2">Invalid invitation</h1>
      <p className="text-slate-500 text-sm max-w-xs mb-6">{message}</p>
      <Link href="/" className="text-sm font-semibold text-emerald-600 hover:underline">
        Go to GoodStanding.ai →
      </Link>
    </div>
  )
}

function AlreadyAccepted() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
        <CheckCircle2 className="w-7 h-7 text-emerald-500" />
      </div>
      <h1 className="text-xl font-bold text-slate-900 mb-2">Already accepted</h1>
      <p className="text-slate-500 text-sm max-w-xs mb-6">
        This invitation has already been accepted.
      </p>
      <Link
        href="/dashboard"
        className="inline-block px-5 py-2.5 bg-[#1B2B4B] text-white text-sm font-semibold rounded-xl hover:bg-[#243461] transition-colors"
      >
        Go to dashboard →
      </Link>
    </div>
  )
}
