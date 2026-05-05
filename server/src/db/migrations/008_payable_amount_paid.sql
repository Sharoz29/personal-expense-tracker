-- Add amount_paid column to payables for partial payment tracking
ALTER TABLE payables ADD COLUMN amount_paid REAL NOT NULL DEFAULT 0;

-- Backfill existing rows: set amount_paid = amount for paid payables, 0 for pending
UPDATE payables SET amount_paid = amount WHERE status = 'paid' AND amount_paid = 0;

UPDATE payables SET amount_paid = 0 WHERE amount_paid IS NULL;

-- Add account_id to assets for tracking which account was used to purchase
ALTER TABLE assets ADD COLUMN account_id INTEGER REFERENCES accounts(id);

-- Add account_id to savings_certificates for tracking which account was used to purchase
ALTER TABLE savings_certificates ADD COLUMN account_id INTEGER REFERENCES accounts(id);
