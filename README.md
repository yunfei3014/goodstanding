# GoodStanding.ai

Startup compliance, automated. GoodStanding.ai helps founders keep their companies in good standing — filings tracked, government interactions handled by Enrolled Agents, and all documents in one place.

**Live:** https://goodstanding-jade.vercel.app

## Features

- **Multi-step signup** — company setup wizard (entity type, state, founders, plan) with email confirmation
- **Dashboard overview** — real-time compliance health across all entities
- **Compliance tracking** — filings by status (overdue, pending, completed) with due dates and amounts
- **Document vault** — searchable document storage grouped by company
- **Government Liaison** — submit requests handled by federally licensed Enrolled Agents
- **Multi-company support** — switch between entities from the sidebar

## Tech stack

- [Next.js 15](https://nextjs.org) (App Router, Turbopack)
- [Supabase](https://supabase.com) — auth + Postgres database with Row Level Security
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [Vercel](https://vercel.com) — deployment

## Local development

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Create `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Apply the database schema (see `supabase-schema.sql`)

4. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

The schema (`supabase-schema.sql`) creates four tables — `companies`, `filings`, `documents`, `government_interactions` — all with Row Level Security policies so users only see their own data.
