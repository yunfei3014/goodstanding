import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
  typescript: true,
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
