CREATE TABLE IF NOT EXISTS committees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  total_members INTEGER NOT NULL,
  contribution_per_month REAL NOT NULL,
  my_month INTEGER NOT NULL,
  start_date TEXT NOT NULL,
  account_id INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);
