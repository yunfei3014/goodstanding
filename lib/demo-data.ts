// Demo data for the dashboard — pre-populated so it looks real on day 1

export const demoCompanies = [
  {
    id: "comp-1",
    name: "Prism AI, Inc.",
    entity_type: "c_corp",
    state_of_incorporation: "Delaware",
    ein: "88-1234567",
    status: "good_standing",
    formed_at: "2024-08-15",
    states_registered: ["Delaware", "California"],
    plan: "Growth",
  },
  {
    id: "comp-2",
    name: "Beacon Health, LLC",
    entity_type: "llc",
    state_of_incorporation: "Wyoming",
    ein: "92-7654321",
    status: "attention_needed",
    formed_at: "2024-11-02",
    states_registered: ["Wyoming"],
    plan: "Essentials",
  },
]

export const demoFilings = [
  // Prism AI
  {
    id: "f1",
    company_id: "comp-1",
    type: "Annual Report",
    state: "Delaware",
    due_date: "2026-03-01",
    status: "completed",
    filed_at: "2026-01-14",
    amount: 50,
  },
  {
    id: "f2",
    company_id: "comp-1",
    type: "Franchise Tax",
    state: "Delaware",
    due_date: "2026-06-01",
    status: "pending",
    amount: 400,
  },
  {
    id: "f3",
    company_id: "comp-1",
    type: "Statement of Information",
    state: "California",
    due_date: "2026-08-15",
    status: "pending",
    amount: 25,
  },
  // Beacon Health
  {
    id: "f4",
    company_id: "comp-2",
    type: "Annual Report",
    state: "Wyoming",
    due_date: "2026-04-15",
    status: "pending",
    amount: 62,
  },
  {
    id: "f5",
    company_id: "comp-2",
    type: "Foreign Qualification",
    state: "California",
    due_date: "2026-03-01",
    status: "overdue",
    notes: "Company has employees in California. Registration required.",
  },
]

export const demoDocuments = [
  {
    id: "d1",
    company_id: "comp-1",
    name: "Certificate of Incorporation",
    type: "Formation",
    uploaded_at: "2024-08-15",
    size_kb: 284,
  },
  {
    id: "d2",
    company_id: "comp-1",
    name: "EIN Assignment Letter",
    type: "Tax",
    uploaded_at: "2024-08-18",
    size_kb: 142,
  },
  {
    id: "d3",
    company_id: "comp-1",
    name: "Bylaws",
    type: "Formation",
    uploaded_at: "2024-08-15",
    size_kb: 512,
  },
  {
    id: "d4",
    company_id: "comp-1",
    name: "Delaware Annual Report 2025",
    type: "Filing",
    uploaded_at: "2026-01-14",
    size_kb: 98,
  },
  {
    id: "d5",
    company_id: "comp-2",
    name: "Articles of Organization",
    type: "Formation",
    uploaded_at: "2024-11-02",
    size_kb: 198,
  },
  {
    id: "d6",
    company_id: "comp-2",
    name: "Operating Agreement",
    type: "Formation",
    uploaded_at: "2024-11-02",
    size_kb: 867,
  },
]

export const demoInteractions = [
  {
    id: "g1",
    company_id: "comp-1",
    agency: "IRS",
    type: "CP2000 Notice Resolution",
    status: "resolved",
    summary:
      "IRS sent CP2000 proposing additional tax of $1,240 for tax year 2023. Our EA called the Practitioner Priority Service line, identified a math error on the original return, and submitted a formal response. IRS confirmed no adjustment needed.",
    created_at: "2025-12-04",
    resolved_at: "2025-12-11",
  },
  {
    id: "g2",
    company_id: "comp-1",
    agency: "Delaware Division of Corporations",
    type: "Good Standing Certificate Request",
    status: "resolved",
    summary:
      "Expedited good standing certificate ordered for investor due diligence. Received within 24 hours. Uploaded to document vault.",
    created_at: "2026-01-09",
    resolved_at: "2026-01-10",
  },
]
