import { redirect } from "next/navigation"

// /dashboard/companies has no standalone page — the overview IS the companies list.
// Redirect to keep any direct navigations working.
export default function CompaniesIndexPage() {
  redirect("/dashboard")
}
