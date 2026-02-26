#!/usr/bin/env tsx
/**
 * GoodStanding Project Reviewer
 * Usage: npm run review
 * Reads key project files and streams a comprehensive review from Claude Opus.
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "..");
const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

// Files to include in the review, in priority order
const FILES_TO_REVIEW: Array<{ file: string; label: string }> = [
  { file: "supabase-schema.sql", label: "Database Schema" },
  { file: "lib/supabase.ts", label: "Supabase Client & Types" },
  { file: "lib/filings.ts", label: "Filings Logic (auto-generated defaults)" },
  { file: "lib/email.ts", label: "Email Utility" },
  { file: "lib/stripe.ts", label: "Stripe Integration" },
  { file: "lib/api-auth.ts", label: "API Key Auth" },
  { file: "app/dashboard/layout.tsx", label: "Dashboard Shell / Sidebar" },
  { file: "app/dashboard/page.tsx", label: "Dashboard Overview Page" },
  { file: "app/dashboard/compliance/page.tsx", label: "Compliance Page" },
  { file: "app/dashboard/documents/page.tsx", label: "Document Vault Page" },
  { file: "app/dashboard/government/page.tsx", label: "Government Liaison Page" },
  { file: "app/api/v1/companies/route.ts", label: "Public API: Companies" },
  { file: "app/page.tsx", label: "Landing Page" },
  { file: "next.config.ts", label: "Next.js Config" },
];

function readFile(relPath: string): string | null {
  const full = path.join(ROOT, relPath);
  try {
    return fs.readFileSync(full, "utf-8");
  } catch {
    return null;
  }
}

function buildProjectBundle(): string {
  const sections: string[] = [];

  for (const { file, label } of FILES_TO_REVIEW) {
    const content = readFile(file);
    if (!content) {
      sections.push(`### ${label} (${file})\n[FILE NOT FOUND]\n`);
      continue;
    }
    const truncated =
      content.length > 12_000
        ? content.slice(0, 12_000) + `\n... [truncated at 12,000 chars]`
        : content;
    sections.push(`### ${label}\n**File:** \`${file}\`\n\`\`\`\n${truncated}\n\`\`\``);
  }

  return sections.join("\n\n---\n\n");
}

const SYSTEM_PROMPT = `You are a senior full-stack software architect and startup product reviewer.
You review SaaS products built with Next.js, Supabase, TypeScript, and Tailwind.
Your reviews are concise, direct, and actionable. You prioritize:
1. Security vulnerabilities (auth, RLS, API exposure)
2. Critical bugs that would break production
3. Correctness of core business logic
4. Missing features vs. stated product goals
5. Code quality and maintainability
6. UX gaps visible from the code

Format your review with these sections:
## 🔴 Critical Issues (fix before launch)
## 🟡 Important Issues (fix soon)
## 🟢 What's Working Well
## 📋 Feature Gaps (vs. product goals)
## 🏗 Architecture Notes
## ⚡ Quick Wins (easy improvements)

Be specific: include file paths and line context where relevant.`;

async function main() {
  console.log("Building project bundle...");
  const bundle = buildProjectBundle();
  const outputFile = path.join(ROOT, "REVIEW.md");

  const prompt = `Review the GoodStanding.ai project — a startup compliance SaaS (Next.js 16, Supabase, Tailwind, TypeScript).

**Product context:** Helps startup founders stay compliant — formation, annual report filings, document vault, government liaison (IRS calls via Enrolled Agent). Key differentiator: EA license to represent clients before the IRS/state agencies.

**What I need reviewed:**
- Are there security holes (especially auth, RLS, API key handling)?
- Is the core filings logic correct and production-ready?
- What critical bugs or missing pieces would block a real launch?
- What's the overall code quality?

Here are the key project files:

${bundle}`;

  console.log(`\nSending ${Math.round(prompt.length / 1000)}KB to Claude Opus 4.6...\n`);
  console.log("=".repeat(60));
  console.log();

  let fullReview = "";

  const stream = client.messages.stream({
    model: "claude-opus-4-6",
    max_tokens: 8192,
    thinking: { type: "adaptive" },
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      process.stdout.write(event.delta.text);
      fullReview += event.delta.text;
    }
  }

  const final = await stream.finalMessage();
  console.log("\n\n" + "=".repeat(60));
  console.log(
    `\nTokens used — input: ${final.usage.input_tokens}, output: ${final.usage.output_tokens}`
  );

  // Save to file
  const header = `# GoodStanding.ai — Code Review\n\n_Generated: ${new Date().toISOString()}_\n\n`;
  fs.writeFileSync(outputFile, header + fullReview, "utf-8");
  console.log(`\nReview saved to: REVIEW.md`);
}

main().catch((err) => {
  console.error("Review failed:", err.message);
  process.exit(1);
});
