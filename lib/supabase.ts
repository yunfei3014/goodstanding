import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser client — use in "use client" components
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Singleton for backward compatibility
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

export type Company = {
  id: string
  user_id: string
  name: string
  entity_type: "llc" | "c_corp" | "s_corp"
  state_of_incorporation: string
  plan: "launch" | "essentials" | "growth" | "scale"
  ein?: string
  status: "good_standing" | "attention_needed" | "action_required"
  formed_at?: string
  created_at: string
}

export type Filing = {
  id: string
  company_id: string
  type: string
  state: string
  due_date: string
  status: "completed" | "pending" | "overdue" | "not_required"
  filed_at?: string
  amount?: number
  notes?: string
}

export type Document = {
  id: string
  company_id: string
  name: string
  type: string
  storage_path: string | null
  size_kb: number | null
  uploaded_at: string
}

export type GovernmentInteraction = {
  id: string
  company_id: string
  agency: string
  type: string
  status: "resolved" | "in_progress" | "scheduled"
  summary: string
  created_at: string
  resolved_at?: string
}
