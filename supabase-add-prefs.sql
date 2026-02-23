-- Migration: add user_preferences table
-- Run this in the Supabase SQL editor

create table if not exists user_preferences (
  user_id            uuid        primary key references auth.users(id) on delete cascade,
  email_enabled      boolean     not null default true,
  email_days         integer[]   not null default '{7,30}',
  email_overdue_alerts boolean   not null default true,
  email_weekly_digest  boolean   not null default false,
  ical_token         text,
  updated_at         timestamptz not null default now()
);

alter table user_preferences enable row level security;

create policy "Users manage own prefs"
  on user_preferences
  for all
  using (auth.uid() = user_id);
