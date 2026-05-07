ALTER TABLE payables ADD COLUMN amount_paid REAL NOT NULL DEFAULT 0;

UPDATE payables SET amount_paid = amount WHERE status = 'paid' AND amount_paid = 0;

UPDATE payables SET amount_paid = 0 WHERE amount_paid IS NULL;

ALTER TABLE assets ADD COLUMN account_id INTEGER REFERENCES accounts(id);

ALTER TABLE savings_certificates ADD COLUMN account_id INTEGER REFERENCES accounts(id);

ALTER TABLE savings_certificates ADD COLUMN duration TEXT NOT NULL DEFAULT '';

ALTER TABLE savings_certificates ADD COLUMN tax_rate REAL NOT NULL DEFAULT 0;
