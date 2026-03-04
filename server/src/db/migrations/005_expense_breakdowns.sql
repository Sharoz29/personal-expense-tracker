-- Add breakdowns column to expenses (JSON array of {label, amount} or null)
ALTER TABLE expenses ADD COLUMN breakdowns TEXT DEFAULT NULL;
