CREATE TABLE IF NOT EXISTS expense_types (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL UNIQUE,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS income_sources (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL UNIQUE,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS expenses (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    expense_type_id  INTEGER NOT NULL,
    amount           REAL    NOT NULL CHECK (amount >= 0),
    description      TEXT    NOT NULL DEFAULT '',
    date             TEXT    NOT NULL,
    month            INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year             INTEGER NOT NULL CHECK (year >= 2000),
    created_at       TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at       TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (expense_type_id) REFERENCES expense_types(id)
        ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_expenses_month_year ON expenses(month, year);

CREATE INDEX IF NOT EXISTS idx_expenses_type ON expenses(expense_type_id);

CREATE TABLE IF NOT EXISTS incomes (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    income_source_id  INTEGER NOT NULL,
    amount            REAL    NOT NULL CHECK (amount >= 0),
    description       TEXT    NOT NULL DEFAULT '',
    date              TEXT    NOT NULL,
    month             INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year              INTEGER NOT NULL CHECK (year >= 2000),
    created_at        TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at        TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (income_source_id) REFERENCES income_sources(id)
        ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_incomes_month_year ON incomes(month, year);

CREATE INDEX IF NOT EXISTS idx_incomes_source ON incomes(income_source_id);

CREATE TABLE IF NOT EXISTS savings (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    month      INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year       INTEGER NOT NULL CHECK (year >= 2000),
    amount     REAL    NOT NULL DEFAULT 0,
    notes      TEXT    NOT NULL DEFAULT '',
    created_at TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT    NOT NULL DEFAULT (datetime('now')),
    UNIQUE(month, year)
);

INSERT OR IGNORE INTO expense_types (name) VALUES
    ('Rent'),
    ('Groceries'),
    ('Utilities'),
    ('Transportation'),
    ('Entertainment'),
    ('Healthcare'),
    ('Dining Out'),
    ('Miscellaneous'),
    ('Car Payment');

INSERT OR IGNORE INTO income_sources (name) VALUES
    ('Salary'),
    ('Freelance'),
    ('Investments'),
    ('Other');
