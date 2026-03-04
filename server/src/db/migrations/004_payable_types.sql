CREATE TABLE IF NOT EXISTS payable_types (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL UNIQUE,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

ALTER TABLE payables ADD COLUMN payable_type_id INTEGER DEFAULT NULL
