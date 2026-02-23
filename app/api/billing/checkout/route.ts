import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { stripe, STRIPE_PRICES } from "@/lib/stripe"

/**
 * POST /api/billing/checkout
 * Body: { plan: "professional" | "growth" | "scale"; companyId?: string }
 *
 * Creates a Stripe Checkout session and returns the URL.
 * Attaches the Supabase user ID as metadata so the webhook can update the plan.
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

  const body = await req.json().catch(() => null)
  const plan: string | undefined = body?.plan
  const companyId: string | undefined = body?.companyId

  if (!plan || !STRIPE_PRICES[plan]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
  }

  const priceId = STRIPE_PRICES[plan]
  const origin = req.headers.get("origin") ?? "https://goodstanding.ai"

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user.email,
    metadata: {
      supabase_user_id: user.id,
      plan,
      ...(companyId ? { company_id: companyId } : {}),
    },
    subscription_data: {
      metadata: {
        supabase_user_id: user.id,
        plan,
        ...(companyId ? { company_id: companyId } : {}),
      },
    },
    success_url: `${origin}/dashboard/billing?success=1`,
    cancel_url: `${origin}/dashboard/billing?canceled=1`,
  })

  return NextResponse.json({ url: session.url })
}
