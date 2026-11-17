CREATE TABLE IF NOT EXISTS account_balance_snapshots (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id  INTEGER NOT NULL,
    month       INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year        INTEGER NOT NULL CHECK (year >= 2000),
    balance     REAL    NOT NULL DEFAULT 0,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    UNIQUE(account_id, month, year)
);

CREATE INDEX IF NOT EXISTS idx_snapshots_account ON account_balance_snapshots(account_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_month_year ON account_balance_snapshots(month, year);
