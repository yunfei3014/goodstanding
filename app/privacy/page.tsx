import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/marketing/Navbar"
import Footer from "@/components/marketing/Footer"
import { Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy — GoodStanding.ai",
  description: "GoodStanding.ai Privacy Policy — how we collect, use, and protect your data.",
}

const LAST_UPDATED = "February 1, 2025"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#1B2B4B] rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#1B2B4B]">Privacy Policy</h1>
            <p className="text-slate-400 text-sm mt-0.5">Last updated {LAST_UPDATED}</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-[15px] leading-relaxed space-y-6">
          <p className="text-slate-600">
            GoodStanding AI, Inc. ("we," "us," or "our") operates the GoodStanding.ai platform. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your information when you use our
            Service. Please read this policy carefully.
          </p>

          <Section title="1. Information We Collect">
            <p>
              <strong>Account information:</strong> Name, email address, password (hashed), and company
              details you provide during registration.
            </p>
            <p>
              <strong>Business information:</strong> Company name, entity type, state of incorporation,
              EIN, formation date, and related compliance data you enter into the Service.
            </p>
            <p>
              <strong>Documents:</strong> Files you upload to the document vault are stored encrypted
              in our cloud storage.
            </p>
            <p>
              <strong>Usage data:</strong> Log files, IP addresses, browser type, pages visited, and
              time spent on pages — collected automatically to improve the Service.
            </p>
            <p>
              <strong>Communications:</strong> Messages you send to our team, including government liaison
              requests, are retained to fulfill the service.
            </p>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Providing and operating the Service</li>
              <li>Filing and tracking compliance obligations on your behalf</li>
              <li>Sending deadline reminders and important compliance notifications</li>
              <li>Responding to your support requests</li>
              <li>Improving and developing new features</li>
              <li>Complying with legal obligations</li>
            </ul>
          </Section>

          <Section title="3. Information Sharing">
            <p>We do not sell your personal information. We share data only as follows:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>
                <strong>Government agencies:</strong> Filing-related information shared with the IRS, state
                agencies, and the Secretary of State as required to provide the Service.
              </li>
              <li>
                <strong>Service providers:</strong> Supabase (database and auth), Anthropic (AI features),
                and Vercel (hosting). Each is bound by data processing agreements.
              </li>
              <li>
                <strong>Legal requirements:</strong> When required by law, court order, or to protect our
                rights and the safety of others.
              </li>
            </ul>
          </Section>

          <Section title="4. Data Security">
            <p>
              We implement industry-standard security measures including encryption in transit (TLS) and
              at rest, row-level security on our database, and access controls. However, no method of
              transmission over the internet is 100% secure.
            </p>
          </Section>

          <Section title="5. Data Retention">
            <p>
              We retain your data for as long as your account is active and for up to 7 years after
              termination to comply with tax and legal record-keeping requirements. You may request
              deletion of your account at any time; some data may be retained where required by law.
            </p>
          </Section>

          <Section title="6. Your Rights">
            <p>Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data in a machine-readable format</li>
              <li>Opt out of marketing communications</li>
            </ul>
            <p>
              To exercise these rights, email{" "}
              <a href="mailto:privacy@goodstanding.ai" className="text-emerald-600 hover:underline">
                privacy@goodstanding.ai
              </a>
              .
            </p>
          </Section>

          <Section title="7. Cookies">
            <p>
              We use cookies and similar technologies for authentication (Supabase auth cookies) and
              analytics. Essential authentication cookies cannot be disabled. You may opt out of
              analytics tracking in your account settings.
            </p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>
              The Service is not directed to individuals under 18 years of age. We do not knowingly
              collect personal information from children.
            </p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes
              via email or a prominent notice in the Service. The date at the top of this policy indicates
              when it was last revised.
            </p>
          </Section>

          <Section title="10. Contact Us">
            <p>
              For privacy-related questions or to exercise your rights, contact us at:{" "}
              <a href="mailto:privacy@goodstanding.ai" className="text-emerald-600 hover:underline">
                privacy@goodstanding.ai
              </a>
              <br />
              GoodStanding AI, Inc. · 2093 Philadelphia Pike, Suite 1234 · Claymont, DE 19703
            </p>
          </Section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex gap-4 text-sm">
          <Link href="/terms" className="text-emerald-600 hover:underline font-semibold">
            Terms of Service →
          </Link>
          <Link href="/" className="text-slate-400 hover:text-slate-600">
            Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-[#1B2B4B] mb-2">{title}</h2>
      <div className="text-slate-600 space-y-2">{children}</div>
    </div>
  )
}
