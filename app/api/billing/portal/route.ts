import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { stripe } from "@/lib/stripe"

/**
 * POST /api/billing/portal
 * Creates a Stripe Customer Portal session for managing subscriptions.
 */
export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const origin = req.headers.get("origin") ?? "https://goodstanding.ai"

  // Look up the customer by email
  const customers = await stripe.customers.list({ email: user.email, limit: 1 })
  const customer = customers.data[0]

  if (!customer) {
    return NextResponse.json({ error: "No billing account found. Please subscribe first." }, { status: 404 })
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: `${origin}/dashboard/billing`,
  })

  return NextResponse.json({ url: session.url })
}
