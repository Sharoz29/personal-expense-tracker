CREATE TABLE IF NOT EXISTS family_members (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT    NOT NULL,
    relationship    TEXT    NOT NULL DEFAULT 'Self',
    date_of_birth   TEXT,
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS health_report_categories (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL UNIQUE,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS health_markers (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT    NOT NULL,
    unit            TEXT    NOT NULL DEFAULT '',
    category_id     INTEGER NOT NULL,
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (category_id) REFERENCES health_report_categories(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_health_markers_category ON health_markers(category_id);

CREATE TABLE IF NOT EXISTS health_reports (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    family_member_id    INTEGER NOT NULL,
    category_id         INTEGER NOT NULL,
    report_date         TEXT    NOT NULL,
    lab_name            TEXT    NOT NULL DEFAULT '',
    notes               TEXT    NOT NULL DEFAULT '',
    created_at          TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at          TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (family_member_id) REFERENCES family_members(id) ON DELETE RESTRICT,
    FOREIGN KEY (category_id) REFERENCES health_report_categories(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_health_reports_member ON health_reports(family_member_id);
CREATE INDEX IF NOT EXISTS idx_health_reports_category ON health_reports(category_id);
CREATE INDEX IF NOT EXISTS idx_health_reports_date ON health_reports(report_date);

CREATE TABLE IF NOT EXISTS health_report_results (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id       INTEGER NOT NULL,
    marker_id       INTEGER NOT NULL,
    value           REAL    NOT NULL,
    min_reference   REAL,
    max_reference   REAL,
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (report_id) REFERENCES health_reports(id) ON DELETE CASCADE,
    FOREIGN KEY (marker_id) REFERENCES health_markers(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_health_results_report ON health_report_results(report_id);
CREATE INDEX IF NOT EXISTS idx_health_results_marker ON health_report_results(marker_id);
