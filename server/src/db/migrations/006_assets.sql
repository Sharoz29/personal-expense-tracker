CREATE TABLE IF NOT EXISTS asset_types (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL UNIQUE,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS assets (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT    NOT NULL,
    asset_type_id   INTEGER NOT NULL,
    current_value   REAL    NOT NULL CHECK (current_value >= 0),
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (asset_type_id) REFERENCES asset_types(id)
);

CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(asset_type_id);
