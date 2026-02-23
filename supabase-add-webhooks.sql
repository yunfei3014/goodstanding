-- Migration: user_webhooks table
-- Run in Supabase SQL editor

create table if not exists user_webhooks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  url         text not null,
  secret      text,
  events      text[] not null default '{"filing.overdue","filing.upcoming","digest.weekly"}',
  enabled     boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists user_webhooks_user_id_idx on user_webhooks(user_id);

alter table user_webhooks enable row level security;

create policy "Users manage own webhooks"
  on user_webhooks
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
