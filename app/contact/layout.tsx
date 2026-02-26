import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact — GoodStanding.ai",
  description: "Get in touch with the GoodStanding.ai team. We're here to help with compliance questions, IRS notices, and anything your startup needs.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
