-- Slack Incoming Webhook integration
-- Run in the Supabase SQL editor.
-- Adds Slack webhook URL and alert preferences to user_preferences.

alter table user_preferences
  add column if not exists slack_webhook_url text,
  add column if not exists slack_overdue_alerts boolean not null default true,
  add column if not exists slack_upcoming_alerts boolean not null default true,
  add column if not exists slack_weekly_digest boolean not null default false;
