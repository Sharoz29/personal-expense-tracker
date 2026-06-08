CREATE TABLE IF NOT EXISTS payees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

ALTER TABLE payables ADD COLUMN payee_id INTEGER REFERENCES payees(id);

INSERT OR IGNORE INTO payees (name) SELECT DISTINCT from_person FROM payables WHERE from_person != '';

UPDATE payables SET payee_id = (SELECT id FROM payees WHERE payees.name = payables.from_person) WHERE from_person != '';

CREATE TABLE IF NOT EXISTS loans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  total_amount REAL NOT NULL DEFAULT 0,
  description TEXT DEFAULT '',
  start_date TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

UPDATE expense_types SET name = 'Loan Payment' WHERE name = 'Car Payment';

ALTER TABLE expenses ADD COLUMN loan_id INTEGER REFERENCES loans(id);

INSERT OR IGNORE INTO loans (name, total_amount, description) VALUES ('Car Loan', 0, 'Migrated from Car Loan page');

UPDATE expenses SET loan_id = (SELECT id FROM loans WHERE name = 'Car Loan')
  WHERE expense_type_id = (SELECT id FROM expense_types WHERE name = 'Loan Payment');
