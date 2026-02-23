-- Migration: add team_invites table
-- Run this in the Supabase SQL editor

create table if not exists team_invites (
  id           uuid        primary key default gen_random_uuid(),
  owner_id     uuid        not null references auth.users(id) on delete cascade,
  email        text        not null,
  role         text        not null check (role in ('admin', 'member', 'viewer')),
  status       text        not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  invited_at   timestamptz not null default now(),
  accepted_at  timestamptz,
  unique (owner_id, email)
);

alter table team_invites enable row level security;

-- Owners can manage their own invites
create policy "Owners manage their invites"
  on team_invites
  for all
  using (auth.uid() = owner_id);
