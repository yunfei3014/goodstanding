import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Documents — GoodStanding.ai",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
