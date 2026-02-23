-- Add status_token column for public shareable compliance status pages
alter table companies
  add column if not exists status_token text unique default encode(gen_random_bytes(20), 'hex');

-- Backfill any existing rows that still have null
update companies
set status_token = encode(gen_random_bytes(20), 'hex')
where status_token is null;

-- Make it not-null after backfill
alter table companies
  alter column status_token set not null;
