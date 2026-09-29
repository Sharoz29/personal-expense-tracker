-- Learning Module: Flashcards and Spaced Repetition System

-- Flashcards table
CREATE TABLE IF NOT EXISTS flashcards (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    french_text       TEXT    NOT NULL,
    english_meaning   TEXT    NOT NULL,
    audio_filename    TEXT,
    category          TEXT    DEFAULT 'general',
    difficulty_level  TEXT    DEFAULT 'beginner',
    created_at        TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at        TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Flashcard reviews table
CREATE TABLE IF NOT EXISTS flashcard_reviews (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    flashcard_id      INTEGER NOT NULL,
    last_reviewed_at  TEXT    NOT NULL,
    next_review_at    TEXT    NOT NULL,
    ease_factor       REAL    NOT NULL DEFAULT 2.5,
    interval_days     INTEGER NOT NULL DEFAULT 1,
    repetitions       INTEGER NOT NULL DEFAULT 0,
    quality_rating    INTEGER,
    created_at        TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at        TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (flashcard_id) REFERENCES flashcards(id) ON DELETE CASCADE
);

-- French test results table
CREATE TABLE IF NOT EXISTS french_test_results (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    test_name           TEXT    NOT NULL,
    test_type           TEXT    DEFAULT 'multiple_choice',
    score               INTEGER NOT NULL,
    total_questions     INTEGER NOT NULL,
    percentage          REAL    NOT NULL,
    time_taken_seconds  INTEGER,
    answers_json        TEXT,
    completed_at        TEXT    NOT NULL DEFAULT (datetime('now')),
    created_at          TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- French questions table
CREATE TABLE IF NOT EXISTS french_questions (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    question        TEXT    NOT NULL,
    option_a        TEXT    NOT NULL,
    option_b        TEXT    NOT NULL,
    option_c        TEXT    NOT NULL,
    option_d        TEXT    NOT NULL,
    correct_answer  TEXT    NOT NULL,
    category        TEXT    DEFAULT 'vocabulary',
    difficulty      TEXT    DEFAULT 'beginner',
    created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);
