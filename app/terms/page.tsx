import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/marketing/Navbar"
import Footer from "@/components/marketing/Footer"
import { Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service — GoodStanding.ai",
  description: "GoodStanding.ai Terms of Service.",
}

const LAST_UPDATED = "February 1, 2025"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#1B2B4B] rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#1B2B4B]">Terms of Service</h1>
            <p className="text-slate-400 text-sm mt-0.5">Last updated {LAST_UPDATED}</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-[15px] leading-relaxed space-y-6">
          <p className="text-slate-600">
            These Terms of Service ("Terms") govern your use of the GoodStanding.ai platform and services
            (the "Service") operated by GoodStanding AI, Inc. ("we," "us," or "our"). By creating an account
            or using the Service, you agree to be bound by these Terms.
          </p>

          <Section title="1. Services Provided">
            <p>
              GoodStanding.ai provides business compliance software and services including entity formation
              assistance, compliance tracking, document storage, and government liaison coordination.
              GoodStanding.ai is not a law firm and does not provide legal advice. Our enrolled agents
              provide tax representation services within the scope of their licensure.
            </p>
          </Section>

          <Section title="2. Account Registration">
            <p>
              You must provide accurate, complete, and current information when creating an account. You are
              responsible for maintaining the confidentiality of your account credentials and for all
              activity that occurs under your account. Notify us immediately at{" "}
              <a href="mailto:support@goodstanding.ai" className="text-emerald-600 hover:underline">
                support@goodstanding.ai
              </a>{" "}
              if you suspect unauthorized access.
            </p>
          </Section>

          <Section title="3. Fees and Payment">
            <p>
              Certain features require a paid subscription. Fees are billed monthly in advance. State filing
              fees and other third-party costs are passed through at cost and are non-refundable once paid
              to the relevant government agency. You may cancel your subscription at any time; access
              continues through the end of the current billing period.
            </p>
          </Section>

          <Section title="4. No Attorney-Client Relationship">
            <p>
              Use of GoodStanding.ai does not create an attorney-client relationship. The information and
              documents provided through the Service are for informational and administrative purposes only.
              For legal advice regarding your specific situation, please consult a licensed attorney in your
              jurisdiction.
            </p>
          </Section>

          <Section title="5. Enrolled Agent Services">
            <p>
              Government liaison services are performed by IRS-licensed Enrolled Agents. These services are
              limited to tax matters and IRS/state tax agency representation. Enrolled Agent representation
              does not constitute legal representation.
            </p>
          </Section>

          <Section title="6. User Responsibilities">
            <p>You agree to:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Provide accurate information about your business</li>
              <li>Respond promptly to requests for information or signatures</li>
              <li>Review all documents before submission</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not use the Service for any unlawful purpose</li>
            </ul>
          </Section>

          <Section title="7. Intellectual Property">
            <p>
              The Service and its contents are owned by GoodStanding AI, Inc. and protected by copyright,
              trademark, and other intellectual property laws. You retain ownership of your company data
              and documents uploaded to the Service.
            </p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>
              To the maximum extent permitted by applicable law, GoodStanding AI, Inc. shall not be liable
              for any indirect, incidental, special, consequential, or punitive damages, including but not
              limited to lost profits or business interruption, arising from your use of the Service.
              Our total liability shall not exceed the fees paid by you in the twelve months preceding
              the claim.
            </p>
          </Section>

          <Section title="9. Disclaimers">
            <p>
              The Service is provided "as is" without warranties of any kind. We do not guarantee that the
              Service will be uninterrupted, error-free, or that filings submitted on your behalf will be
              accepted by government agencies. Government processing times are outside our control.
            </p>
          </Section>

          <Section title="10. Termination">
            <p>
              We may suspend or terminate your account if you violate these Terms or if your account is
              inactive for more than 12 months. Upon termination, you may request an export of your data
              within 30 days.
            </p>
          </Section>

          <Section title="11. Governing Law">
            <p>
              These Terms are governed by the laws of the State of Delaware, without regard to its conflict
              of law provisions. Any disputes shall be resolved in the state or federal courts located in
              Delaware.
            </p>
          </Section>

          <Section title="12. Changes to Terms">
            <p>
              We may update these Terms from time to time. We will notify you of material changes via email
              or a prominent notice in the Service. Continued use after changes take effect constitutes
              acceptance of the updated Terms.
            </p>
          </Section>

          <Section title="13. Contact">
            <p>
              Questions about these Terms? Contact us at{" "}
              <a href="mailto:legal@goodstanding.ai" className="text-emerald-600 hover:underline">
                legal@goodstanding.ai
              </a>
              .
            </p>
          </Section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex gap-4 text-sm">
          <Link href="/privacy" className="text-emerald-600 hover:underline font-semibold">
            Privacy Policy →
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
