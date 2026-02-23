-- GoodStanding.ai — Supabase Schema
-- Run this in Supabase SQL editor to set up the database

-- Companies
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  entity_type TEXT CHECK (entity_type IN ('llc', 'c_corp', 's_corp')) NOT NULL,
  state_of_incorporation TEXT NOT NULL,
  ein TEXT,
  status TEXT CHECK (status IN ('good_standing', 'attention_needed', 'action_required')) DEFAULT 'good_standing',
  formed_at DATE,
  plan TEXT CHECK (plan IN ('launch', 'essentials', 'growth', 'scale')) DEFAULT 'launch',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- State registrations (foreign qualifications)
CREATE TABLE state_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  state TEXT NOT NULL,
  type TEXT CHECK (type IN ('formation', 'foreign_qualification', 'registered_agent')) NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive', 'pending')) DEFAULT 'active',
  registered_at DATE,
  agent_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Filings
CREATE TABLE filings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  state TEXT NOT NULL,
  due_date DATE,
  status TEXT CHECK (status IN ('completed', 'pending', 'overdue', 'not_required')) DEFAULT 'pending',
  filed_at DATE,
  amount NUMERIC(10, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  storage_path TEXT,
  size_kb INTEGER,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Government interactions (liaison log)
CREATE TABLE government_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  agency TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT CHECK (status IN ('resolved', 'in_progress', 'scheduled')) DEFAULT 'in_progress',
  summary TEXT,
  ea_name TEXT,
  call_duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE state_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE government_interactions ENABLE ROW LEVEL SECURITY;

-- Policies: users can only see their own data
CREATE POLICY "Users see own companies" ON companies FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own registrations" ON state_registrations FOR ALL USING (
  company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
);
CREATE POLICY "Users see own filings" ON filings FOR ALL USING (
  company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
);
CREATE POLICY "Users see own documents" ON documents FOR ALL USING (
  company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
);
CREATE POLICY "Users see own interactions" ON government_interactions FOR ALL USING (
  company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
);
