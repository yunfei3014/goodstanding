"use client"

import { createContext, useContext } from "react"
import type { Company } from "./supabase"

type CompanyContextValue = {
  companies: Company[]
  selectedCompany: Company | null
}

export const CompanyContext = createContext<CompanyContextValue>({
  companies: [],
  selectedCompany: null,
})

export function useCompany() {
  return useContext(CompanyContext)
}
