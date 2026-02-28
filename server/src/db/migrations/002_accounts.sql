CREATE TABLE IF NOT EXISTS accounts (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT    NOT NULL UNIQUE,
    account_number  TEXT    NOT NULL DEFAULT '',
    balance         REAL    NOT NULL DEFAULT 0,
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO accounts (name, account_number, balance) VALUES ('Cash', '', 0);

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

ALTER TABLE expenses ADD COLUMN account_id INTEGER DEFAULT 1;

CREATE INDEX IF NOT EXISTS idx_expenses_account ON expenses(account_id);

ALTER TABLE incomes ADD COLUMN account_id INTEGER DEFAULT 1;

CREATE INDEX IF NOT EXISTS idx_incomes_account ON incomes(account_id);
