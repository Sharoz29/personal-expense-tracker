-- Payees table
CREATE TABLE IF NOT EXISTS payees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Add payee_id FK to payables
ALTER TABLE payables ADD COLUMN payee_id INTEGER REFERENCES payees(id);

-- Auto-migrate existing from_person values into payees
INSERT OR IGNORE INTO payees (name) SELECT DISTINCT from_person FROM payables WHERE from_person != '';

-- Backfill payee_id from from_person
UPDATE payables SET payee_id = (SELECT id FROM payees WHERE payees.name = payables.from_person) WHERE from_person != '';

-- Loans table
CREATE TABLE IF NOT EXISTS loans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  total_amount REAL NOT NULL DEFAULT 0,
  description TEXT DEFAULT '',
  start_date TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Rename Car Payment expense type to Loan Payment
UPDATE expense_types SET name = 'Loan Payment' WHERE name = 'Car Payment';

-- Add loan_id FK to expenses
ALTER TABLE expenses ADD COLUMN loan_id INTEGER REFERENCES loans(id);

-- Create a Car Loan entry and backfill existing loan payment expenses
INSERT INTO loans (name, total_amount, description) VALUES ('Car Loan', 0, 'Migrated from Car Loan page');

-- Backfill loan_id for existing Loan Payment expenses
UPDATE expenses SET loan_id = (SELECT id FROM loans WHERE name = 'Car Loan')
  WHERE expense_type_id = (SELECT id FROM expense_types WHERE name = 'Loan Payment');
