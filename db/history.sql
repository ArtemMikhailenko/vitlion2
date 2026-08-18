-- Version history for edited site text. Run once in the Neon SQL Editor.
CREATE TABLE IF NOT EXISTS content_history (
  id          serial PRIMARY KEY,
  key         varchar(191) NOT NULL,
  lang        varchar(2) NOT NULL,
  value       jsonb NOT NULL,
  author      varchar(191),
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS history_key_idx ON content_history (key, lang);
CREATE INDEX IF NOT EXISTS history_created_idx ON content_history (created_at);
