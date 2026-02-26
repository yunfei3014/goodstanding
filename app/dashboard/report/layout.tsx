import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compliance Report — GoodStanding.ai",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
