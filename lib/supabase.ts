import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Company = {
  id: string
  user_id: string
  name: string
  entity_type: "llc" | "c_corp" | "s_corp"
  state_of_incorporation: string
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
  uploaded_at: string
  size_kb: number
  url?: string
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
