CREATE TABLE IF NOT EXISTS savings_certificates (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    certificate_type  TEXT    NOT NULL,
    principal_amount  REAL    NOT NULL CHECK (principal_amount >= 0),
    profit_rate       REAL    NOT NULL CHECK (profit_rate >= 0),
    purchase_date     TEXT    NOT NULL,
    maturity_date     TEXT    NOT NULL,
    created_at        TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at        TEXT    NOT NULL DEFAULT (datetime('now'))
);
