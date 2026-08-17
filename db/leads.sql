-- Leads table. Run this in the Neon SQL Editor — seed.sql was generated before
-- it existed, so an installation seeded earlier will not have it.
CREATE TABLE IF NOT EXISTS leads (
  id serial PRIMARY KEY,
  name varchar(191) NOT NULL,
  phone varchar(64) NOT NULL,
  shape varchar(64),
  area varchar(64),
  service varchar(64),
  lang varchar(2),
  page varchar(512),
  handled boolean NOT NULL DEFAULT false,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS leads_created_idx ON leads (created_at);
