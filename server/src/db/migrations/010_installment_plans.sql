CREATE TABLE IF NOT EXISTS installment_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  total_amount REAL NOT NULL DEFAULT 0,
  buyer_name TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

ALTER TABLE incomes ADD COLUMN installment_plan_id INTEGER REFERENCES installment_plans(id);

ALTER TABLE incomes ADD COLUMN reference_number TEXT DEFAULT '';

INSERT OR IGNORE INTO income_sources (name) VALUES ('Installment Payment');
