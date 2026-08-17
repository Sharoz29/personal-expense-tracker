CREATE TABLE IF NOT EXISTS committee_payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  committee_id INTEGER NOT NULL REFERENCES committees(id) ON DELETE CASCADE,
  month_number INTEGER NOT NULL,
  amount REAL NOT NULL,
  payment_date TEXT NOT NULL,
  account_id INTEGER REFERENCES accounts(id),
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(committee_id, month_number)
);