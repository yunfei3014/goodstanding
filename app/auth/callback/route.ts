import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"
import { generateDefaultFilings } from "@/lib/filings"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // If user signed up with a pending_company in their metadata, create it now
      const { data: { user } } = await supabase.auth.getUser()
      const pending = user?.user_metadata?.pending_company

      if (pending && user) {
        // Check they don't already have a company (idempotency guard)
        const { data: existing } = await supabase
          .from("companies")
          .select("id")
          .eq("user_id", user.id)
          .limit(1)

        if (!existing?.length) {
          const { data: newCompany } = await supabase
            .from("companies")
            .insert({
              user_id: user.id,
              name: pending.name,
              entity_type: pending.entity_type,
              state_of_incorporation: pending.state_of_incorporation,
              plan: pending.plan ?? "launch",
              status: "good_standing",
            })
            .select()
            .single()

          if (newCompany) {
            // Seed default filings
            const defaultFilings = generateDefaultFilings(newCompany)
            if (defaultFilings.length > 0) {
              await supabase.from("filings").insert(defaultFilings)
            }
            // Clear pending_company from metadata
            await supabase.auth.updateUser({ data: { pending_company: null } })
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
