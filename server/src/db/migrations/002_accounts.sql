-- Accounts table
CREATE TABLE IF NOT EXISTS accounts (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT    NOT NULL UNIQUE,
    account_number  TEXT    NOT NULL DEFAULT '',
    balance         REAL    NOT NULL DEFAULT 0,
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Seed default Cash account for existing records
INSERT OR IGNORE INTO accounts (name, account_number, balance) VALUES ('Cash', '', 0);

-- Account transfers table
CREATE TABLE IF NOT EXISTS account_transfers (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    from_account_id  INTEGER NOT NULL,
    to_account_id    INTEGER NOT NULL,
    amount           REAL    NOT NULL CHECK (amount > 0),
    description      TEXT    NOT NULL DEFAULT '',
    date             TEXT    NOT NULL,
    created_at       TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at       TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (from_account_id) REFERENCES accounts(id) ON DELETE RESTRICT,
    FOREIGN KEY (to_account_id)   REFERENCES accounts(id) ON DELETE RESTRICT,
    CHECK (from_account_id != to_account_id)
);

CREATE INDEX IF NOT EXISTS idx_transfers_from ON account_transfers(from_account_id);
CREATE INDEX IF NOT EXISTS idx_transfers_to   ON account_transfers(to_account_id);
CREATE INDEX IF NOT EXISTS idx_transfers_date ON account_transfers(date);

-- Add account_id to expenses (default 1 = Cash account)
ALTER TABLE expenses ADD COLUMN account_id INTEGER NOT NULL DEFAULT 1 REFERENCES accounts(id) ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS idx_expenses_account ON expenses(account_id);

-- Add account_id to incomes (default 1 = Cash account)
ALTER TABLE incomes ADD COLUMN account_id INTEGER NOT NULL DEFAULT 1 REFERENCES accounts(id) ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS idx_incomes_account ON incomes(account_id);
