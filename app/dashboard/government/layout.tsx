import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Government Liaison — GoodStanding.ai",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
