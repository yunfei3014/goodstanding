import type { Company } from "./supabase"

type FilingInsert = {
  company_id: string
  type: string
  state: string
  due_date: string
  status: "pending" | "overdue" | "completed"
  amount?: number
  notes?: string
  filed_at?: string
}

// Annual report due date by state (current year)
const ANNUAL_REPORT_DATES: Record<string, string> = {
  AL: "04-01", AK: "02-01", AZ: "05-15", AR: "05-01",
  CA: "04-15", CO: "04-01", CT: "03-31", DE: "03-01",
  FL: "05-01", GA: "04-01", HI: "03-31", ID: "11-30",
  IL: "08-01", IN: "03-15", IA: "04-01", KS: "04-15",
  KY: "06-30", LA: "07-01", ME: "06-01", MD: "04-15",
  MA: "11-01", MI: "05-15", MN: "12-31", MS: "04-01",
  MO: "08-31", MT: "04-15", NE: "04-01", NV: "01-31",
  NH: "04-01", NJ: "11-01", NM: "03-15", NY: "03-01",
  NC: "04-15", ND: "08-01", OH: "03-31", OK: "07-01",
  OR: "06-30", PA: "04-15", RI: "11-01", SC: "03-31",
  SD: "03-01", TN: "04-01", TX: "05-15", UT: "03-15",
  VT: "03-15", VA: "10-31", WA: "06-01", WV: "07-01",
  WI: "03-31", WY: "01-01",
}

// Annual report / franchise tax amounts by state
const ANNUAL_REPORT_AMOUNTS: Record<string, Partial<Record<Company["entity_type"] | "default", number>>> = {
  DE: { c_corp: 450, s_corp: 450, llc: 300, default: 450 },
  CA: { c_corp: 800, s_corp: 800, llc: 800, default: 800 },
  NY: { c_corp: 9, s_corp: 9, llc: 9, default: 9 },
  NV: { c_corp: 350, s_corp: 350, llc: 200, default: 350 },
  TX: { c_corp: 0, s_corp: 0, llc: 0, default: 0 },
  FL: { c_corp: 138.75, s_corp: 138.75, llc: 138.75, default: 138.75 },
  WA: { c_corp: 60, s_corp: 60, llc: 60, default: 60 },
  CO: { c_corp: 10, s_corp: 10, llc: 10, default: 10 },
  WY: { c_corp: 52, s_corp: 52, llc: 52, default: 52 },
}

function annualReportDue(state: string): string {
  const year = new Date().getFullYear()
  const mmdd = ANNUAL_REPORT_DATES[state] ?? "04-15"
  return `${year}-${mmdd}`
}

function annualReportAmount(state: string, entityType: Company["entity_type"]): number | undefined {
  const stateAmounts = ANNUAL_REPORT_AMOUNTS[state]
  if (!stateAmounts) return undefined
  return stateAmounts[entityType] ?? stateAmounts.default
}

function filingStatus(dueDate: string): "pending" | "overdue" {
  return new Date(dueDate) < new Date() ? "overdue" : "pending"
}

function annualReportLabel(state: string, entityType: Company["entity_type"]): string {
  if (state === "DE" && entityType === "llc") return "Delaware LLC Annual Tax"
  if (state === "DE") return "Delaware Franchise Tax"
  if (state === "CA" && entityType === "llc") return "CA LLC Franchise Tax"
  if (state === "TX") return "Texas Public Information Report"
  return `${state} Annual Report`
}

export function generateDefaultFilings(company: Company): FilingInsert[] {
  const { id, state_of_incorporation: state, entity_type, created_at } = company
  const year = new Date().getFullYear()
  const filings: FilingInsert[] = []
  const formationDate = created_at.split("T")[0]

  // 1. Formation filing — always completed
  filings.push({
    company_id: id,
    type: entity_type === "llc" ? "Articles of Organization" : "Articles of Incorporation",
    state,
    due_date: formationDate,
    status: "completed",
    filed_at: formationDate,
    notes: "Initial formation filing with the state.",
  })

  // 2. Annual report / franchise tax
  const arDue = annualReportDue(state)
  const arAmount = annualReportAmount(state, entity_type)
  filings.push({
    company_id: id,
    type: annualReportLabel(state, entity_type),
    state,
    due_date: arDue,
    status: filingStatus(arDue),
    ...(arAmount !== undefined ? { amount: arAmount } : {}),
  })

  // 3. Federal tax return
  let fedType: string
  let fedDue: string

  if (entity_type === "c_corp") {
    fedType = "Federal Corporate Tax Return (Form 1120)"
    fedDue = `${year}-04-15`
  } else if (entity_type === "s_corp") {
    fedType = "Federal S-Corp Tax Return (Form 1120-S)"
    fedDue = `${year}-03-15`
  } else {
    fedType = "Federal Partnership Return (Form 1065)"
    fedDue = `${year}-03-15`
  }

  filings.push({
    company_id: id,
    type: fedType,
    state: "Federal",
    due_date: fedDue,
    status: filingStatus(fedDue),
  })

  // 4. CA Statement of Information (new CA entities file within 90 days of formation)
  if (state === "CA") {
    const soiDue = new Date()
    soiDue.setDate(soiDue.getDate() + 60)
    filings.push({
      company_id: id,
      type: "CA Statement of Information",
      state: "CA",
      due_date: soiDue.toISOString().split("T")[0],
      status: "pending",
      amount: 25,
      notes: "Required within 90 days of formation, then biennially.",
    })
  }

  // 5. NY Biennial Statement (NY entities)
  if (state === "NY") {
    const nySoi = new Date()
    nySoi.setMonth(nySoi.getMonth() + 1)
    nySoi.setDate(1)
    filings.push({
      company_id: id,
      type: "NY Biennial Statement",
      state: "NY",
      due_date: `${year}-${String(nySoi.getMonth() + 1).padStart(2, "0")}-01`,
      status: "pending",
      amount: 9,
    })
  }

  return filings
}
