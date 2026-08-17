-- Table for site-wide settings edited in the panel (contacts, social links).
-- Run this once in the Neon SQL Editor; existing data is untouched.
CREATE TABLE IF NOT EXISTS site_settings (
  key         varchar(64) PRIMARY KEY,
  value       text NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now()
);
