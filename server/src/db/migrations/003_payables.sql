-- Create payables table
CREATE TABLE IF NOT EXISTS payables (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT NOT NULL,
  amount REAL NOT NULL,
  from_person TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  due_date TEXT,
  paid_date TEXT,
  account_id INTEGER,
  income_id INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Ensure "Reimbursement" income source exists
INSERT OR IGNORE INTO income_sources (name) VALUES ('Reimbursement')
