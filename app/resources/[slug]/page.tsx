import { notFound } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/marketing/Navbar"
import Footer from "@/components/marketing/Footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, ArrowRight, CheckCircle2, AlertCircle, Shield } from "lucide-react"

// ─── Article content ─────────────────────────────────────────────────────────

type Article = {
  slug: string
  title: string
  description: string
  category: string
  readTime: string
  publishedAt: string
  content: React.ReactNode
}

const articles: Record<string, Article> = {
  "delaware-c-corp-formation": {
    slug: "delaware-c-corp-formation",
    title: "How to Form a Delaware C-Corp for Your Startup",
    description:
      "Delaware is the default for VC-backed startups. Here's why, and exactly what you need to do — entity type, authorized shares, registered agent, EIN — in the right order.",
    category: "Formation",
    readTime: "8 min read",
    publishedAt: "January 2026",
    content: (
      <>
        <p>Delaware is home to more than 65% of Fortune 500 companies and the overwhelming majority of VC-backed startups — not because of any tax advantage, but because of legal certainty. Delaware's Court of Chancery is a specialized business court with 200+ years of corporate law precedent. Investors, lawyers, and acquirers all know how Delaware works. That predictability has compounding value over a company's life.</p>

        <h2>Why Delaware, and why a C-Corp?</h2>
        <p>VCs can't invest in LLCs — most institutional funds are structured as pass-through entities themselves and can't hold LLC interests without creating tax complexity for their LPs. C-Corps also make it straightforward to issue preferred stock, set up option pools for employees, and eventually go public or get acquired. If you plan to raise institutional capital, form a C-Corp in Delaware.</p>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 my-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-800 mb-1">When to use a different entity</p>
              <p className="text-emerald-700 text-sm">If you're building a lifestyle business, solo consulting practice, or bootstrapped company with no intention of raising VC funding, a Wyoming LLC may be simpler and cheaper to maintain. C-Corps have ongoing compliance costs that LLCs don't.</p>
            </div>
          </div>
        </div>

        <h2>The authorized shares question</h2>
        <p>Delaware charges franchise tax based on the number of authorized shares your charter specifies. The default calculation (Authorized Shares Method) can generate frightening bills — a startup authorizing 10 million shares might see a $85,000+ tax bill. Don't panic. You can use the Assumed Par Value Capital Method, which typically results in a $400 minimum for early-stage companies. Your accountant should file using this method every year.</p>
        <p>Standard practice: authorize 10,000,000 shares of common stock with a par value of $0.00001 per share in your initial Certificate of Incorporation. This gives you room to issue founder shares (typically 7–9M total), set up an option pool (1–2M shares), and have flexibility for future financings.</p>

        <h2>Step-by-step formation process</h2>
        <ol>
          <li><strong>Choose a registered agent in Delaware.</strong> You're required to have one. GoodStanding.ai provides registered agent service in all 50 states. Alternatively, services like Cogency Global or Corporation Service Company are used by large companies. Expect $50–150/year.</li>
          <li><strong>File your Certificate of Incorporation.</strong> This is the founding document of your corporation. It specifies your company name, authorized shares, par value, and registered agent. Delaware Division of Corporations charges $89 for standard filing (1-day processing). Rush options available for $100–150 more.</li>
          <li><strong>Adopt bylaws.</strong> Bylaws govern how your corporation operates — board composition, meeting procedures, officer roles, voting thresholds. Standard seed-stage startup bylaws are straightforward; many founders use templates, then customize.</li>
          <li><strong>Hold an organizational meeting.</strong> Even if it's just a written consent in lieu of meeting (more common), document: election of initial directors, approval of bylaws, officer appointments, initial share issuances.</li>
          <li><strong>Issue founder shares.</strong> Founders typically receive common stock subject to a 4-year vesting schedule with a 1-year cliff. File an 83(b) election within 30 days of receiving restricted stock — this election often saves founders significant taxes at acquisition and is one of the most time-sensitive compliance obligations you'll face.</li>
          <li><strong>Apply for an EIN.</strong> Your Employer Identification Number is your company's federal tax ID. Apply via the IRS website (takes 15 minutes) or have your formation service do it. You need this before opening a business bank account.</li>
          <li><strong>Open a business bank account.</strong> Mercury, Brex, and SVB Startup Banking are popular with startups. You'll need your EIN and Certificate of Incorporation.</li>
          <li><strong>Register in your home state if different from Delaware.</strong> If your company operates in California, New York, or any other state, you likely need to foreign-qualify there. See our guide on foreign qualification.</li>
        </ol>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 my-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 mb-1">Don't miss the 83(b) deadline</p>
              <p className="text-amber-700 text-sm">The 83(b) election must be filed with the IRS within 30 days of receiving restricted stock. Miss it and you may owe taxes on the fair market value of unvested shares when they vest — which at acquisition could be millions of dollars of ordinary income rather than capital gains. Set a calendar reminder the day you issue founder shares.</p>
            </div>
          </div>
        </div>

        <h2>Ongoing Delaware compliance</h2>
        <p>After formation, you have recurring obligations:</p>
        <ul>
          <li><strong>Delaware Franchise Tax:</strong> Due March 1 each year. Use the Assumed Par Value Method. Minimum $400 for most early-stage startups.</li>
          <li><strong>Registered Agent:</strong> Required year-round. Maintain current registered agent to ensure you receive legal notices.</li>
          <li><strong>Annual Report:</strong> Filed alongside the franchise tax. Discloses officers, directors, and registered agent.</li>
          <li><strong>Corporate minutes:</strong> Document board and shareholder decisions. Important for maintaining corporate veil protection.</li>
          <li><strong>BOI Report (new in 2024):</strong> Most small companies must file a Beneficial Ownership Information report with FinCEN. See our BOI guide.</li>
        </ul>

        <h2>Common mistakes to avoid</h2>
        <ul>
          <li>Authorizing millions of shares with no par value — triggers maximum Delaware franchise tax</li>
          <li>Not filing 83(b) elections within 30 days</li>
          <li>Ignoring Delaware franchise tax until you get a late notice (25% penalty)</li>
          <li>Operating in California for months before foreign-qualifying</li>
          <li>Using a personal address as your registered agent (becomes public record)</li>
        </ul>
      </>
    ),
  },

  "irs-notice-startup": {
    slug: "irs-notice-startup",
    title: "What to Do When the IRS Sends Your Startup a Letter",
    description:
      "Don't panic. Most IRS notices are routine. Here's how to read what the IRS sent you, what it actually means, what the deadline is, and what happens if you ignore it.",
    category: "Government Liaison",
    readTime: "6 min read",
    publishedAt: "January 2026",
    content: (
      <>
        <p>The IRS sends approximately 200 million notices and letters per year. Most of them are routine — a balance due notice, a request to verify information, a math correction on your return. Getting a letter doesn't mean you're in trouble. But it does mean there's a deadline, and missing it almost always makes things worse.</p>

        <h2>The first thing to do: read the notice number</h2>
        <p>Every IRS notice has a number in the upper right corner (e.g., CP2000, LT11, Notice 1450). This tells you exactly what the IRS wants. Common ones startups receive:</p>
        <ul>
          <li><strong>CP2000:</strong> IRS received income information that doesn't match your return. Doesn't mean you owe it — often a timing or reporting difference.</li>
          <li><strong>CP501/CP503/CP504:</strong> Balance due notices, escalating in urgency. CP504 is a "Final Notice" that can lead to levy.</li>
          <li><strong>LT11 / LT1058:</strong> Notice of Intent to Levy. This is serious. You have 30 days to respond before the IRS can seize assets.</li>
          <li><strong>4549:</strong> Income Tax Examination Changes — result of an audit.</li>
          <li><strong>CP575/147C:</strong> EIN confirmation letters. Not a problem — just keep them for your records.</li>
        </ul>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 my-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 mb-1">The IRS deadline is real</p>
              <p className="text-amber-700 text-sm">Every notice has a response date. Miss it and your options narrow: penalties accrue, the IRS may levy, and you lose certain appeal rights. When in doubt, call the number on the notice before the deadline — even if you can't resolve it that day, calling can pause certain timelines.</p>
            </div>
          </div>
        </div>

        <h2>What most startup IRS notices are actually about</h2>
        <p>For early-stage startups, the most common scenarios:</p>
        <ol>
          <li><strong>You filed late or didn't file.</strong> If you have employees or significant revenue, you may have payroll tax filing obligations you missed. The IRS will generate substitute returns and penalties. Respond quickly — first-time penalty abatement is available if you've been otherwise compliant.</li>
          <li><strong>EIN-related issues.</strong> The IRS may flag that your EIN doesn't match the business name on file, or that you haven't filed expected returns for your EIN. This sometimes happens when founders change company names after incorporation.</li>
          <li><strong>1099 or W-2 mismatch.</strong> If you paid contractors or employees and there are mismatches between what you reported and what they reported, the IRS will ask about the difference.</li>
          <li><strong>Balance due.</strong> You may owe estimated taxes, payroll taxes, or excise taxes. The notice will specify which and how much.</li>
        </ol>

        <h2>When to handle it yourself vs. get help</h2>
        <p>Handle it yourself if: the notice is informational (EIN confirmation, address update request), the issue is clearly a math error in your favor, or the notice says "no action required."</p>
        <p>Get professional help if: the notice involves a proposed change to your tax return (CP2000), there's a balance due over $1,000, it's an audit notice, or it involves any kind of levy or lien threat. An Enrolled Agent can represent you before the IRS — GoodStanding.ai has EA-credentialed staff who can call the IRS directly on your behalf.</p>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 my-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-800 mb-1">What an Enrolled Agent can do</p>
              <p className="text-blue-700 text-sm">Only Enrolled Agents, CPAs, and tax attorneys can represent taxpayers before all levels of the IRS. An EA can call the IRS Practitioner Priority Service (a faster line than the public), pull your transcripts, respond to CP2000 notices on your behalf, and negotiate payment plans. Most startup compliance services don't have EA credentials — GoodStanding.ai does.</p>
            </div>
          </div>
        </div>

        <h2>What happens if you ignore it</h2>
        <p>The IRS doesn't give up. Ignored notices escalate: proposed assessments become final assessments, which become tax liens on your business property and credit, which can become levies on your bank accounts. If the IRS places a federal tax lien, it becomes public record and can affect your ability to get loans, close financings, or sell the company. Don't ignore IRS notices — even if you disagree with them, respond within the deadline.</p>

        <h2>Practical next steps</h2>
        <ol>
          <li>Find the notice number and look it up at irs.gov/notices</li>
          <li>Note the response deadline (usually on the first page)</li>
          <li>Gather any documents the notice references (prior returns, 1099s, bank statements)</li>
          <li>If the amount is correct, pay it or set up a payment plan before the deadline</li>
          <li>If you dispute it, respond in writing within the deadline with supporting documentation</li>
          <li>For anything complex, engage an EA or tax professional before the deadline, not after</li>
        </ol>
      </>
    ),
  },

  "california-foreign-qualification": {
    slug: "california-foreign-qualification",
    title: "Do You Need to Foreign-Qualify in California?",
    description:
      "If your startup is incorporated in Delaware but you have employees, an office, or significant sales in California — you almost certainly need to foreign-qualify. Here's how.",
    category: "Compliance",
    readTime: "5 min read",
    publishedAt: "January 2026",
    content: (
      <>
        <p>The vast majority of VC-backed startups are incorporated in Delaware but operate out of California. This creates a requirement that many founders overlook: foreign qualification. If your Delaware C-Corp is "doing business" in California, it must register with the California Secretary of State and comply with California corporate law.</p>

        <h2>What counts as "doing business" in California?</h2>
        <p>California uses a broad definition. You're doing business in California if any of the following are true:</p>
        <ul>
          <li>You have one or more employees in California (including W-2 employees and many contractors)</li>
          <li>You have a physical office, co-working space, or even just a mailing address in California</li>
          <li>You have sales to California customers that exceed $610,000/year OR exceed 25% of total sales</li>
          <li>The majority of your paid-in capital is attributable to California</li>
          <li>Your annual payroll in California exceeds $61,040 (or 25% of total payroll)</li>
        </ul>
        <p>Most Series A+ startups based in the Bay Area or LA easily clear these thresholds. But even pre-revenue startups with California-based employees are typically required to foreign-qualify.</p>

        <h2>What foreign qualification involves</h2>
        <p>To foreign-qualify in California, you file a <strong>Statement and Designation by Foreign Corporation</strong> (Form S&DC-S/N) with the California Secretary of State. You'll need:</p>
        <ul>
          <li>A Certificate of Good Standing from Delaware (dated within 6 months)</li>
          <li>A California registered agent (can be the same service as your Delaware RA)</li>
          <li>Filing fee: $100</li>
        </ul>
        <p>After foreign-qualifying, you'll owe California's <strong>minimum franchise tax of $800/year</strong>, due even if you have no revenue. This is often the first California tax bill founders receive and it surprises people — you can't avoid it once you're foreign-qualified or "doing business" in California.</p>

        <h2>The California Franchise Tax Board vs. the Secretary of State</h2>
        <p>These are two different agencies. The Secretary of State handles your foreign qualification registration. The Franchise Tax Board handles your California taxes (the $800 minimum + income taxes). You need to deal with both:</p>
        <ul>
          <li><strong>Secretary of State:</strong> File Statement of Information (Form SI-350) annually, $25 fee</li>
          <li><strong>Franchise Tax Board:</strong> File California Form 100 (C-Corp) or 100S (S-Corp) annually, pay minimum $800 franchise tax</li>
        </ul>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 my-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 mb-1">Penalties for not registering</p>
              <p className="text-amber-700 text-sm">If you're doing business in California without being registered, the California FTB can assess taxes, penalties, and interest retroactively. More practically, an unregistered foreign entity cannot sue in California courts — which could be a problem in contract disputes or fundraising. Register proactively; don't wait for the FTB to find you.</p>
            </div>
          </div>
        </div>

        <h2>Other states to watch</h2>
        <p>California gets the most attention because of the $800 minimum and the size of the tech ecosystem, but the same logic applies to other states where you have nexus:</p>
        <ul>
          <li><strong>New York:</strong> Biennial statement, $9 fee, but also New York City corporate taxes if you're operating in NYC</li>
          <li><strong>Texas:</strong> Franchise tax based on revenue (0.375% for most companies), due May 15</li>
          <li><strong>Washington:</strong> Business & Occupation Tax, separate from income tax</li>
        </ul>

        <h2>How to stay compliant across multiple states</h2>
        <p>As you hire employees in more states, your compliance obligations multiply. Each new state may require: foreign qualification, a registered agent, state income tax registration, payroll tax registration, and sometimes sales tax registration. GoodStanding.ai tracks your foreign qualifications alongside your Delaware obligations — so you get one dashboard for everything, not spreadsheets and calendar reminders across a dozen states.</p>
      </>
    ),
  },

  "startup-compliance-checklist": {
    slug: "startup-compliance-checklist",
    title: "Startup Compliance Checklist: Pre-Seed to Series A",
    description:
      "The complete compliance checklist from incorporation through your Series A. Annual reports, franchise tax, registered agent, foreign qualifications, board minutes — everything organized by stage.",
    category: "Compliance",
    readTime: "10 min read",
    publishedAt: "February 2026",
    content: (
      <>
        <p>Compliance obligations stack up fast as your startup grows. What starts with a single Delaware filing quickly expands to multi-state registrations, tax filings in three jurisdictions, payroll tax accounts, and investor-driven diligence requirements. Here's every compliance item organized by the stage when it typically becomes relevant.</p>

        <h2>At formation (Day 0)</h2>
        <ul>
          <li>Certificate of Incorporation filed with Delaware Secretary of State</li>
          <li>Bylaws adopted</li>
          <li>Organizational meeting (or written consent) documenting initial directors, officers, share issuances</li>
          <li>83(b) elections filed for all restricted stock grants (within 30 days — no exceptions)</li>
          <li>EIN obtained from IRS</li>
          <li>Registered agent in Delaware engaged</li>
          <li>Business bank account opened</li>
          <li>Intellectual property assignment agreements signed by all founders</li>
        </ul>

        <h2>First 90 days</h2>
        <ul>
          <li>Foreign qualification in home state (if different from Delaware)</li>
          <li>State payroll tax account set up if you have employees</li>
          <li>Initial board consent documenting key decisions (stock option plan, banking authority)</li>
          <li>BOI Report filed with FinCEN (within 90 days of formation for entities formed after Jan 1, 2024)</li>
          <li>Business licenses obtained if required by your city/county</li>
        </ul>

        <h2>Ongoing annual obligations</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Filing</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Deadline</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                ["Delaware Franchise Tax + Annual Report", "March 1", "$400 minimum"],
                ["Federal corporate tax return (Form 1120)", "April 15 (Oct 15 with extension)", "Varies"],
                ["California Franchise Tax minimum", "April 15", "$800 minimum"],
                ["California Statement of Information", "Within 90 days of fiscal year end", "$25"],
                ["Q1 Estimated taxes", "April 15", "Varies"],
                ["Q2 Estimated taxes", "June 15", "Varies"],
                ["Q3 Estimated taxes", "September 15", "Varies"],
                ["Q4 Estimated taxes", "January 15", "Varies"],
                ["W-2s issued to employees", "January 31", "N/A"],
                ["1099-NECs issued to contractors", "January 31", "N/A"],
              ].map(([filing, deadline, cost], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}>
                  <td className="py-3 px-4 text-slate-800">{filing}</td>
                  <td className="py-3 px-4 text-slate-600">{deadline}</td>
                  <td className="py-3 px-4 text-slate-600">{cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Fundraising diligence requirements (Pre-Seed to Seed)</h2>
        <p>When you raise your first institutional round, investors will request a diligence package. Standard items:</p>
        <ul>
          <li>Certificate of Incorporation and all amendments</li>
          <li>Bylaws (current version)</li>
          <li>All board and stockholder consents (formation through current)</li>
          <li>Cap table (fully-diluted, PDF and CSV)</li>
          <li>All stock agreements (founder purchase agreements, option agreements, side letters)</li>
          <li>83(b) election confirmations for all restricted stock</li>
          <li>Good standing certificates from Delaware and any states where you're foreign-qualified</li>
          <li>IP assignment agreements for all founders and key employees</li>
          <li>Material contracts (customer agreements, vendor agreements, leases)</li>
        </ul>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 my-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-800 mb-1">GoodStanding.ai keeps this organized</p>
              <p className="text-blue-700 text-sm">Your GoodStanding.ai dashboard tracks all of these obligations, stores your formation documents, and generates a one-page compliance summary you can share with investors. When diligence comes, you're ready in minutes instead of days.</p>
            </div>
          </div>
        </div>

        <h2>Series A and beyond</h2>
        <ul>
          <li>409A valuation (required before any option grants; typically annually or after material financing events)</li>
          <li>Board meeting minutes (quarterly minimum for Series A+ companies)</li>
          <li>Audited financial statements (required by most Series A investors)</li>
          <li>Foreign qualifications in all states with material operations</li>
          <li>SOC 2 or other compliance certifications if selling to enterprise customers</li>
          <li>State tax registrations in all employee states</li>
        </ul>
      </>
    ),
  },

  "good-standing-explained": {
    slug: "good-standing-explained",
    title: "Good Standing: What It Is and Why Your Startup Can't Afford to Lose It",
    description:
      "\"Good standing\" is a legal status your company must maintain to operate, raise capital, and sign contracts. Here's what it means, how you lose it, and how we prevent that.",
    category: "Foundation",
    readTime: "5 min read",
    publishedAt: "February 2026",
    content: (
      <>
        <p>"Good standing" isn't a vague concept — it's a specific legal status that your corporation or LLC either has or doesn't. When you're in good standing, the state where you're incorporated recognizes you as an active, compliant entity with the right to operate. When you're not, you're in a kind of legal limbo that can halt fundraising, invalidate contracts, and sometimes expose founders to personal liability.</p>

        <h2>How you get out of good standing</h2>
        <p>Most states revoke good standing for one of a few reasons:</p>
        <ul>
          <li><strong>Not filing your annual report.</strong> Every state requires corporations to file periodic reports — usually annually. Delaware requires a franchise tax payment and annual report every March 1. Missing this for two consecutive years triggers administrative dissolution.</li>
          <li><strong>Not paying franchise tax.</strong> Unpaid franchise taxes accrue penalties and interest, and eventually the state will void your charter.</li>
          <li><strong>Losing your registered agent.</strong> If your registered agent resigns or becomes non-compliant and you don't replace them, the state may void your good standing.</li>
          <li><strong>Not foreign-qualifying in states where you operate.</strong> You can be in good standing in Delaware but not authorized to do business in California — which has similar consequences in that state.</li>
        </ul>

        <h2>What happens when you lose it</h2>
        <p>The consequences aren't theoretical:</p>
        <ul>
          <li><strong>You can't sign enforceable contracts.</strong> In most states, an entity that's been administratively dissolved can't enter into contracts that would be enforceable in court.</li>
          <li><strong>You can't raise capital.</strong> Investors request good standing certificates during diligence. A gap here can delay or kill a round.</li>
          <li><strong>You may lose your company name.</strong> Once your entity is dissolved, another company can register with your name in that state.</li>
          <li><strong>Personal liability exposure.</strong> Courts sometimes pierce the corporate veil of dissolved entities, exposing founders to personal liability for company obligations.</li>
          <li><strong>Reinstatement is possible but expensive.</strong> You can typically reinstate a dissolved entity, but you'll owe all back taxes, penalties, and interest. In some states, this can total thousands of dollars for a one-year lapse.</li>
        </ul>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 my-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-800 mb-1">Prevention is trivial compared to reinstatement</p>
              <p className="text-emerald-700 text-sm">Delaware's annual franchise tax is $400 minimum. Missing it accumulates $200 in late penalties plus 1.5% monthly interest. By the time you deal with it years later, you might owe $800–1,500 to restore good standing — plus the time and legal fees to reinstate. GoodStanding.ai prevents this by tracking all filings and reminding you (and filing them for you on paid plans).</p>
            </div>
          </div>
        </div>

        <h2>How to check your good standing status</h2>
        <p>You can check your Delaware good standing at <strong>icis.corp.delaware.gov</strong>. For other states, search "[state name] entity search" + "good standing." Your GoodStanding.ai dashboard shows your status in real time and alerts you before it changes.</p>

        <h2>How GoodStanding.ai keeps you compliant</h2>
        <p>We track every filing deadline for your entity in every state where you're registered. We send you alerts at 60, 30, and 7 days before each deadline. On paid plans, we file annual reports on your behalf — you never have to remember a due date. Our Enrolled Agents are available to resolve any issues that come up, including IRS notices and state tax inquiries.</p>
      </>
    ),
  },

  "international-founder-us-entity": {
    slug: "international-founder-us-entity",
    title: "How to Form a US Company as an International Founder",
    description:
      "Chinese founders, Indian founders, Canadian founders — the process is different when you don't have a US SSN. Here's exactly how to form a US entity, get an EIN, and open a bank account.",
    category: "International",
    readTime: "9 min read",
    publishedAt: "February 2026",
    content: (
      <>
        <p>Thousands of non-US founders form US companies every year — from pre-seed teams in Singapore to Series A companies in Canada that want US entities for their VC rounds. The process is absolutely doable, but there are a few key differences when you don't have a US Social Security Number.</p>

        <h2>Why form a US entity as an international founder?</h2>
        <p>Most US-based VCs strongly prefer (and some require) investing in US entities. Delaware C-Corps are the standard. Having a US entity also makes it easier to:</p>
        <ul>
          <li>Open a US business bank account</li>
          <li>Accept US customer payments without currency conversion friction</li>
          <li>Hire US employees legally</li>
          <li>Process US payroll</li>
          <li>Sign contracts with US counterparties</li>
        </ul>

        <h2>Forming the entity (same as US founders)</h2>
        <p>The good news: forming a Delaware C-Corp doesn't require a US address, SSN, or citizenship. You just need to file the Certificate of Incorporation (which requires only a company name, authorized shares, and a Delaware registered agent) and pay the ~$89 state filing fee. GoodStanding.ai can handle this for you entirely online.</p>

        <h2>Getting an EIN without an SSN</h2>
        <p>This is the part that trips up most international founders. An EIN (Employer Identification Number) is required for everything: opening a bank account, filing taxes, hiring employees. Normally you apply online via IRS.gov — but that application requires a US SSN or ITIN for the "responsible party."</p>
        <p>If you don't have a US SSN or ITIN, you have two options:</p>
        <ol>
          <li><strong>Apply by phone or fax (Form SS-4).</strong> International applicants can apply by calling the IRS International Applicants line at +1-267-941-1099. This requires completing Form SS-4 and typically takes 15–45 minutes on the phone. Processing time: same-day if you call, 4–6 weeks by fax.</li>
          <li><strong>Have a US-based third party apply on your behalf.</strong> If you have a US-registered agent, legal counsel, or a service like GoodStanding.ai, they can apply for the EIN as a "third-party designee" — which doesn't require your SSN. This is often the fastest path.</li>
        </ol>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 my-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-800 mb-1">The ITIN option</p>
              <p className="text-blue-700 text-sm">An Individual Taxpayer Identification Number (ITIN) is a tax processing number issued to non-US persons who need to file US taxes. If you'll be a US taxpayer (which you will be if you own shares in a US C-Corp), you may eventually need one. But you don't need it to get an EIN — the phone method works without it.</p>
            </div>
          </div>
        </div>

        <h2>Opening a US bank account</h2>
        <p>This used to require a physical US presence. Today, several banks and fintech services work with international founders:</p>
        <ul>
          <li><strong>Mercury:</strong> Fully online, no US address required during application, widely used by YC and other accelerator companies. Requires EIN and Certificate of Incorporation.</li>
          <li><strong>Relay:</strong> Similar to Mercury, good for teams with multiple users.</li>
          <li><strong>Brex:</strong> Works well for venture-backed companies; requires some revenue or VC backing for the best products.</li>
          <li><strong>Traditional banks (Chase, BofA):</strong> Typically require an in-person visit to a US branch. Possible but requires a US trip.</li>
        </ul>

        <h2>BOI Report considerations for international founders</h2>
        <p>The Beneficial Ownership Information (BOI) report, required since January 2024 for most US companies, asks about "beneficial owners" — anyone who owns 25%+ or exercises substantial control over the company. International founders must include their information. You'll need a passport (or other government ID) rather than a US driver's license, which is fine — the FinCEN system accepts foreign passports.</p>

        <h2>Tax implications to think about early</h2>
        <p>International founders who own US C-Corp shares may have tax obligations in both the US and their home country. The US-China tax treaty, US-India tax treaty, and others affect how income and capital gains are treated. Work with a tax advisor who has international experience before you take significant investment or revenue — the structure you choose early can have multi-million dollar consequences at exit.</p>
      </>
    ),
  },

  "enrolled-agent-explainer": {
    slug: "enrolled-agent-explainer",
    title: "What Is an Enrolled Agent? (And Why Your Compliance Provider Probably Doesn't Have One)",
    description:
      "The Enrolled Agent credential is the highest IRS designation — unlimited authority to represent taxpayers. Most startup compliance services don't have it. Here's why it matters.",
    category: "Government Liaison",
    readTime: "4 min read",
    publishedAt: "February 2026",
    content: (
      <>
        <p>When you're dealing with the IRS, there's a critical difference between someone who can advise you on what to do and someone who can actually act on your behalf. Only three categories of practitioners have unlimited authority to represent taxpayers before all levels of the IRS: tax attorneys, CPAs, and Enrolled Agents. Most startup compliance services — the ones that do annual reports and registered agent maintenance — don't have any of these credentials.</p>

        <h2>What Enrolled Agents can do</h2>
        <p>An EA's authority is granted by the federal government (not the states, like CPA licenses) and covers every level of the IRS:</p>
        <ul>
          <li><strong>Represent you in IRS audits</strong> — including audits of your business, your individual returns, and employment tax audits</li>
          <li><strong>Call the IRS Practitioner Priority Service</strong> — a direct line available only to credentialed practitioners, bypassing the standard hold times that can exceed 2 hours</li>
          <li><strong>File Form 2848 (Power of Attorney)</strong> — giving them legal authority to speak with the IRS on your behalf, access your transcripts, and receive IRS communications</li>
          <li><strong>Negotiate installment agreements and offers in compromise</strong></li>
          <li><strong>Respond to CP2000 notices, audit reports, and appeals</strong></li>
          <li><strong>Represent you in IRS Collections hearings</strong></li>
        </ul>

        <h2>Why most compliance services can't help you here</h2>
        <p>The major startup compliance providers — Stripe Atlas, Clerky, LegalZoom, Northwest Registered Agent — are excellent at what they do: entity formation, registered agent, annual reports. But none of them employ Enrolled Agents. When you get an IRS notice, their advice stops at "you should contact a tax professional." That's not useful when you're staring at a 30-day deadline.</p>
        <p>GoodStanding.ai is built around having EA credentials on staff. When you get an IRS notice, we can actually handle it — not just tell you to hire someone else to handle it.</p>

        <h2>How Enrolled Agents get their credentials</h2>
        <p>There are two paths to becoming an EA:</p>
        <ol>
          <li><strong>Pass the Special Enrollment Examination (SEE)</strong> — a 3-part exam covering individual taxes, business taxes, and representation/practices/procedures. It's comprehensive and difficult, with pass rates of around 60–70% per part.</li>
          <li><strong>Former IRS employees with 5+ years of experience</strong> can bypass the exam and become EAs based on their IRS service history.</li>
        </ol>
        <p>After credentialing, EAs must complete 72 hours of continuing education every 3 years and maintain good standing with the IRS.</p>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 my-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-800 mb-1">The GoodStanding.ai difference</p>
              <p className="text-emerald-700 text-sm">Our Government Liaison service is backed by EA credentials. When you submit a government call request, an EA reviews your situation and either calls the IRS directly or escalates to our tax attorney network for complex matters. You get a real resolution, not a form letter telling you to call someone else.</p>
            </div>
          </div>
        </div>

        <h2>When you should ask if your compliance provider has EA credentials</h2>
        <p>Ask when you're evaluating any compliance or legal service: "Do you have Enrolled Agents on staff who can represent me before the IRS?" If the answer is no, understand that their government liaison or "IRS notice assistance" service is purely advisory — they can tell you what to do but can't do it for you. For early-stage founders who don't have an existing CPA or tax attorney relationship, that gap matters.</p>
      </>
    ),
  },

  "delaware-franchise-tax-guide": {
    slug: "delaware-franchise-tax-guide",
    title: "Delaware Franchise Tax for Startups: The Authorized Shares Method",
    description:
      "Delaware franchise tax can look terrifying — $50,000+ bills for early-stage startups using the default calculation. Here's how to use the Assumed Par Value method to pay $400 instead.",
    category: "Compliance",
    readTime: "7 min read",
    publishedAt: "February 2026",
    content: (
      <>
        <p>Every March 1, Delaware corporations owe franchise tax. For most early-stage startups, this is $400. But every year, thousands of founders open their Delaware annual report portal and see a number like $87,000 or $250,000 — and panic. Here's the good news: that number is almost certainly wrong, and it's easy to fix.</p>

        <h2>The two calculation methods</h2>
        <p>Delaware offers two methods for calculating franchise tax. It defaults to the worse one.</p>

        <h3>Method 1: Authorized Shares Method (the default — almost always wrong for startups)</h3>
        <p>This method charges based on the number of authorized shares in your charter:</p>
        <ul>
          <li>Up to 5,000 shares: $175 minimum</li>
          <li>5,001 to 10,000 shares: $250</li>
          <li>Each additional 10,000 shares: $75</li>
        </ul>
        <p>If your charter authorizes 10,000,000 shares (standard for startups), the calculation is: $250 + (9,990,000 / 10,000) × $75 = $250 + 999 × $75 = <strong>$75,175</strong>. This is the terrifying number founders see.</p>

        <h3>Method 2: Assumed Par Value Capital Method (almost always better)</h3>
        <p>This method calculates tax based on the total value of issued shares relative to authorized shares. For most early-stage startups — which have issued far fewer shares than they've authorized — this results in the $400 minimum tax.</p>
        <p>The formula requires:</p>
        <ul>
          <li>Total issued shares × (total gross assets ÷ total issued shares) = "assumed par value"</li>
          <li>Total authorized shares × assumed par value = "assumed par value capital"</li>
          <li>Tax = assumed par value capital × 0.04% (with a $400 minimum)</li>
        </ul>
        <p>For a company with $500,000 in assets and 9,000,000 shares issued (of 10,000,000 authorized), the tax rounds down to the $400 minimum.</p>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 my-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-800 mb-1">GoodStanding.ai files using the correct method</p>
              <p className="text-emerald-700 text-sm">When we file your Delaware annual report, we automatically calculate using the Assumed Par Value Capital Method. You'll always pay the minimum $400 (or slightly above if your gross assets are very large), never the six-figure default calculation.</p>
            </div>
          </div>
        </div>

        <h2>What you need to file the annual report</h2>
        <ul>
          <li>Number of authorized shares (from your Certificate of Incorporation)</li>
          <li>Number of issued shares (from your cap table)</li>
          <li>Gross assets (total assets from your balance sheet)</li>
          <li>Gross assets issued (assets attributable to issued shares)</li>
          <li>Current officers and directors</li>
          <li>Registered agent information</li>
        </ul>

        <h2>Late penalties</h2>
        <p>Delaware charges a $200 flat penalty for late franchise tax payment (after March 1) plus 1.5% monthly interest on the unpaid balance. If you're also late on the annual report (a separate but simultaneously-due filing), there's an additional $125 penalty. These add up quickly — the $400 minimum becomes $725+ if you're three months late.</p>
        <p>Delaware also places a lien on your company and can void your charter for persistent non-payment. Get it done by March 1.</p>

        <h2>What about when the company is big?</h2>
        <p>As your company raises venture capital and gross assets grow, the Assumed Par Value Method will eventually result in more than $400. But the thresholds are high. A company with $10M in gross assets and typical authorized shares would owe around $4,000–6,000 annually — still far less than the Authorized Shares Method would suggest.</p>
        <p>At Series B+ scale, companies typically work with tax advisors to optimize the calculation, but for pre-seed and seed-stage startups, the math almost always resolves to $400.</p>
      </>
    ),
  },
}

// ─── category styles ─────────────────────────────────────────────────────────

const categoryColors: Record<string, string> = {
  Formation: "bg-blue-50 text-blue-700",
  Compliance: "bg-emerald-50 text-emerald-700",
  "Government Liaison": "bg-purple-50 text-purple-700",
  International: "bg-amber-50 text-amber-700",
  Foundation: "bg-slate-100 text-slate-700",
}

// ─── page ────────────────────────────────────────────────────────────────────

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = articles[slug]

  if (!article) notFound()

  // Related articles (same category, excluding current)
  const related = Object.values(articles)
    .filter((a) => a.slug !== slug && a.category === article.category)
    .slice(0, 2)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
            <Link href="/resources" className="hover:text-slate-600 transition-colors">
              Resources
            </Link>
            <span>/</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[article.category] || "bg-slate-100 text-slate-700"}`}>
              {article.category}
            </span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-[#1B2B4B] leading-tight mb-4">
              {article.title}
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed mb-5">
              {article.description}
            </p>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
              <span>·</span>
              <span>Updated {article.publishedAt}</span>
              <span>·</span>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 bg-[#1B2B4B] rounded flex items-center justify-center">
                  <Shield className="w-3 h-3 text-emerald-400" />
                </div>
                <span>GoodStanding.ai</span>
              </div>
            </div>
          </div>

          {/* Article body */}
          <div className="prose prose-slate max-w-none
            prose-headings:text-[#1B2B4B] prose-headings:font-bold
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-5
            prose-ul:text-slate-600 prose-ul:space-y-2 prose-ul:mb-5
            prose-ol:text-slate-600 prose-ol:space-y-2 prose-ol:mb-5
            prose-li:leading-relaxed
            prose-strong:text-slate-800
            prose-table:text-sm
          ">
            {article.content}
          </div>

          {/* CTA banner */}
          <div className="mt-14 bg-[#0F1829] rounded-2xl p-8 text-white">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Let GoodStanding.ai handle this</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Everything in this guide is tracked, filed, and monitored automatically on Growth and Scale plans.
                  Stop managing compliance in spreadsheets.
                </p>
              </div>
            </div>
            <Link href="/signup">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">
                Start your company free
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <div className="mt-14">
              <h2 className="text-2xl font-bold text-[#1B2B4B] mb-6">Related guides</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/resources/${r.slug}`}
                    className="group flex flex-col gap-2 bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm hover:border-slate-300 transition-all"
                  >
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full self-start ${categoryColors[r.category] || "bg-slate-100 text-slate-700"}`}>
                      {r.category}
                    </span>
                    <p className="font-semibold text-[#1B2B4B] group-hover:text-emerald-600 transition-colors leading-snug">
                      {r.title}
                    </p>
                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                      {r.description}
                    </p>
                    <span className="text-xs text-slate-400 flex items-center gap-1 mt-auto pt-1">
                      <Clock className="w-3 h-3" />
                      {r.readTime}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="mt-10 pt-8 border-t border-slate-100">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#1B2B4B] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all guides
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

// Per-article metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = articles[slug]
  if (!article) return {}

  return {
    title: `${article.title} | GoodStanding.ai`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      url: `https://goodstanding.ai/resources/${slug}`,
      type: "article",
      siteName: "GoodStanding.ai",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  }
}

// Generate static params for all article slugs
export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }))
}
