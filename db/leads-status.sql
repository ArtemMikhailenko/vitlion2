-- Sales stage for each enquiry. Run once in the Neon SQL Editor.
-- Existing rows keep working: anything already marked handled becomes 'won',
-- everything else stays 'new'.
ALTER TABLE leads ADD COLUMN IF NOT EXISTS status varchar(16) NOT NULL DEFAULT 'new';
UPDATE leads SET status = 'won' WHERE handled = true AND status = 'new';
