import Link from "next/link"
import { Shield } from "lucide-react"

const footerLinks = {
  Services: [
    { label: "Formation", href: "/services" },
    { label: "Registered Agent", href: "/services" },
    { label: "Compliance Monitoring", href: "/services" },
    { label: "Government Liaison", href: "/government-liaison" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Demo", href: "/demo" },
    { label: "Changelog", href: "/changelog" },
    { label: "Resources", href: "/resources" },
    { label: "FAQ", href: "/faq" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Contact", href: "/contact" },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#0F1829] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-bold text-white text-lg">
                GoodStanding<span className="text-emerald-400">.ai</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              Your startup's co-compliance partner. We handle formation,
              filings, and the government calls nobody else will make.
            </p>
            <p className="text-xs text-slate-600 mt-6">
              GoodStanding.ai is not a law firm and does not provide legal
              advice. Enrolled Agent services available on Growth and Scale
              plans.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600">
            © 2026 GoodStanding.ai. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Enrolled Agent authorized to practice before the IRS.
          </p>
        </div>
      </div>
    </footer>
  )
}
