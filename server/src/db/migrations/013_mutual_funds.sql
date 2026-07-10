CREATE TABLE IF NOT EXISTS mutual_fund_companies (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL UNIQUE,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS mutual_funds (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    name                    TEXT    NOT NULL,
    company_id              INTEGER NOT NULL,
    category                TEXT    NOT NULL DEFAULT 'Equity',
    risk_level              TEXT    NOT NULL DEFAULT 'Medium',
    front_end_load_value    REAL    NOT NULL DEFAULT 0,
    front_end_load_type     TEXT    NOT NULL DEFAULT 'percentage' CHECK (front_end_load_type IN ('percentage', 'fixed')),
    back_end_load_value     REAL    NOT NULL DEFAULT 0,
    back_end_load_type      TEXT    NOT NULL DEFAULT 'percentage' CHECK (back_end_load_type IN ('percentage', 'fixed')),
    other_fees_value        REAL    NOT NULL DEFAULT 0,
    other_fees_type         TEXT    NOT NULL DEFAULT 'percentage' CHECK (other_fees_type IN ('percentage', 'fixed')),
    created_at              TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at              TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (company_id) REFERENCES mutual_fund_companies(id)
);

CREATE INDEX IF NOT EXISTS idx_mutual_funds_company ON mutual_funds(company_id);

CREATE TABLE IF NOT EXISTS mutual_fund_transactions (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    fund_id                 INTEGER NOT NULL,
    account_id              INTEGER,
    amount                  REAL    NOT NULL CHECK (amount > 0),
    nav_at_purchase         REAL    NOT NULL CHECK (nav_at_purchase > 0),
    units_allocated         REAL    NOT NULL CHECK (units_allocated > 0),
    front_end_load_amount   REAL    NOT NULL DEFAULT 0,
    back_end_load_amount    REAL    NOT NULL DEFAULT 0,
    other_fees_amount       REAL    NOT NULL DEFAULT 0,
    net_invested_amount     REAL    NOT NULL DEFAULT 0,
    investment_date         TEXT    NOT NULL,
    portal_reflection_date  TEXT,
    description             TEXT    NOT NULL DEFAULT '',
    created_at              TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at              TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (fund_id)    REFERENCES mutual_funds(id),
    FOREIGN KEY (account_id) REFERENCES accounts(id)
);

CREATE INDEX IF NOT EXISTS idx_mf_transactions_fund ON mutual_fund_transactions(fund_id);

CREATE INDEX IF NOT EXISTS idx_mf_transactions_account ON mutual_fund_transactions(account_id);
