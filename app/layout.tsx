import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GoodStanding.ai — Startup Compliance, Automated",
  description:
    "GoodStanding.ai keeps your startup in good standing. We handle formation, filings, and the thing nobody else will do — calling the government on your behalf.",
  openGraph: {
    title: "GoodStanding.ai — Startup Compliance, Automated",
    description:
      "Formation, filings, and government liaison for startups. Enrolled Agent licensed. Free to form.",
    url: "https://goodstanding.ai",
    siteName: "GoodStanding.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GoodStanding.ai — Startup Compliance, Automated",
    description: "We form, we file, we call the government.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
