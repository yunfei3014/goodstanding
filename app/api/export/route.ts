import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * GET /api/export?format=csv|json&type=filings|documents|all
 *
 * Exports the authenticated user's compliance data.
 * Requires an active Supabase session (cookie-based auth).
 */
export async function GET(req: NextRequest) {
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
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { searchParams } = req.nextUrl
  const format = searchParams.get("format") ?? "csv"
  const type   = searchParams.get("type")   ?? "all"

  if (!["csv", "json"].includes(format)) {
    return new NextResponse("Invalid format", { status: 400 })
  }

  // ── Fetch data ─────────────────────────────────────────────────────────────

  const { data: companies } = await supabase
    .from("companies")
    .select("id, name, entity_type, state_of_incorporation, ein, status, formed_at")
    .eq("user_id", user.id)

  if (!companies?.length) {
    const empty = format === "json"
      ? JSON.stringify({ companies: [], filings: [], documents: [] }, null, 2)
      : "No data"
    return new NextResponse(empty, {
      headers: {
        "Content-Type": format === "json" ? "application/json" : "text/csv",
        "Content-Disposition": `attachment; filename="goodstanding-export.${format}"`,
      },
    })
  }

  const companyIds = companies.map((c) => c.id)
  const companyMap = Object.fromEntries(companies.map((c) => [c.id, c.name]))

  const [filingsResult, documentsResult] = await Promise.all([
    (type === "filings" || type === "all")
      ? supabase
          .from("filings")
          .select("id, company_id, type, state, due_date, status, filed_at, amount, notes, created_at")
          .in("company_id", companyIds)
          .order("due_date", { ascending: true })
      : Promise.resolve({ data: [] }),
    (type === "documents" || type === "all")
      ? supabase
          .from("documents")
          .select("id, company_id, name, type, size_kb, uploaded_at")
          .in("company_id", companyIds)
          .order("uploaded_at", { ascending: false })
      : Promise.resolve({ data: [] }),
  ])

  const filings   = filingsResult.data   ?? []
  const documents = documentsResult.data ?? []

  // ── JSON export ────────────────────────────────────────────────────────────

  if (format === "json") {
    const payload = {
      exportedAt: new Date().toISOString(),
      companies,
      filings: filings.map((f) => ({ ...f, company_name: companyMap[f.company_id] })),
      documents: documents.map((d) => ({ ...d, company_name: companyMap[d.company_id] })),
    }
    return new NextResponse(JSON.stringify(payload, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="goodstanding-export-${datestamp()}.json"`,
        "Cache-Control": "no-store",
      },
    })
  }

  // ── CSV export ─────────────────────────────────────────────────────────────

  const sections: string[] = []

  // Companies sheet
  sections.push(buildCsv(
    ["Company", "Entity Type", "State", "EIN", "Status", "Formed"],
    companies.map((c) => [
      c.name,
      c.entity_type,
      c.state_of_incorporation,
      c.ein ?? "",
      c.status,
      c.formed_at ? formatDate(c.formed_at) : "",
    ])
  ))

  if (filings.length > 0) {
    sections.push("\n\nFilings\n")
    sections.push(buildCsv(
      ["Company", "Type", "Jurisdiction", "Due Date", "Status", "Filed Date", "Amount", "Notes"],
      filings.map((f) => [
        companyMap[f.company_id] ?? "",
        f.type,
        f.state,
        f.due_date ? formatDate(f.due_date) : "",
        f.status,
        f.filed_at ? formatDate(f.filed_at) : "",
        f.amount != null ? String(f.amount) : "",
        f.notes ?? "",
      ])
    ))
  }

  if (documents.length > 0) {
    sections.push("\n\nDocuments\n")
    sections.push(buildCsv(
      ["Company", "File Name", "Type", "Size (KB)", "Uploaded"],
      documents.map((d) => [
        companyMap[d.company_id] ?? "",
        d.name,
        d.type,
        d.size_kb != null ? String(d.size_kb) : "",
        d.uploaded_at ? formatDate(d.uploaded_at) : "",
      ])
    ))
  }

  return new NextResponse(sections.join(""), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="goodstanding-export-${datestamp()}.csv"`,
      "Cache-Control": "no-store",
    },
  })
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function csvCell(value: string): string {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}

function buildCsv(headers: string[], rows: string[][]): string {
  const lines = [headers.map(csvCell).join(",")]
  for (const row of rows) {
    lines.push(row.map(csvCell).join(","))
  }
  return lines.join("\r\n")
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  })
}

function datestamp(): string {
  return new Date().toISOString().slice(0, 10)
}
