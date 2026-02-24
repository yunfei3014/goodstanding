import Stripe from "stripe"

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set")
    _stripe = new Stripe(key, { apiVersion: "2026-01-28.clover" })
  }
  return _stripe
}

// Backward-compat alias — only call at request-time, not at module level
export const stripe = new Proxy({} as Stripe, {
  get(_t, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

// ─── Plan → Price ID mapping ──────────────────────────────────────────────────
// Set these in your Stripe dashboard and copy the price IDs here.
// Use environment variables in production to avoid hardcoding.

export const STRIPE_PRICES: Record<string, string> = {
  professional: process.env.STRIPE_PRICE_PROFESSIONAL ?? "price_professional",
  growth:       process.env.STRIPE_PRICE_GROWTH       ?? "price_growth",
  scale:        process.env.STRIPE_PRICE_SCALE        ?? "price_scale",
}

export const PLAN_NAMES: Record<string, string> = {
  starter:      "Starter",
  professional: "Professional",
  growth:       "Growth",
  scale:        "Scale",
}
