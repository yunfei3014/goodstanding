-- API key management for GoodStanding.ai REST API access
create table if not exists api_keys (
  id          uuid       primary key default gen_random_uuid(),
  user_id     uuid       not null references auth.users(id) on delete cascade,
  name        text       not null,
  key_prefix  text       not null,   -- first 12 chars for display (e.g. "gsa_ab12ef34")
  key_hash    text       not null unique, -- sha-256 hex hash of the full key
  last_used_at timestamptz,
  created_at  timestamptz not null default now()
);

alter table api_keys enable row level security;

create policy "Users manage own API keys" on api_keys for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
