import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { createClient } from "@supabase/supabase-js"
import type Stripe from "stripe"

/**
 * POST /api/billing/webhook
 * Handles Stripe webhook events to sync subscription status to Supabase.
 *
 * Register this URL in Stripe Dashboard → Webhooks:
 *   https://goodstanding.ai/api/billing/webhook
 *
 * Events handled:
 *   - checkout.session.completed       → activate plan
 *   - customer.subscription.updated    → update plan/status
 *   - customer.subscription.deleted    → downgrade to starter
 */
export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const sig = headersList.get("stripe-signature")

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new NextResponse("Missing signature or webhook secret", { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return new NextResponse("Invalid signature", { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode !== "subscription") break

      const userId = session.metadata?.supabase_user_id
      const plan   = session.metadata?.plan
      const companyId = session.metadata?.company_id

      if (!userId || !plan) break

      if (companyId) {
        // Update specific company plan
        await supabase
          .from("companies")
          .update({ plan })
          .eq("id", companyId)
          .eq("user_id", userId)
      } else {
        // Update all user's companies to the new plan
        await supabase
          .from("companies")
          .update({ plan })
          .eq("user_id", userId)
      }
      break
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.supabase_user_id
      const plan   = sub.metadata?.plan
      if (!userId || !plan) break

      if (sub.status === "active" || sub.status === "trialing") {
        await supabase.from("companies").update({ plan }).eq("user_id", userId)
      } else if (sub.status === "canceled" || sub.status === "unpaid") {
        await supabase.from("companies").update({ plan: "starter" }).eq("user_id", userId)
      }
      break
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.supabase_user_id
      if (!userId) break
      await supabase.from("companies").update({ plan: "starter" }).eq("user_id", userId)
      break
    }
  }

  return new NextResponse("ok", { status: 200 })
}
