import { getDb } from "../config/db.js";
import type { Flashcard, FlashcardReview, CreateFlashcardDto } from "../types/index.js";
import { mapRows } from "./base.repository.js";

export class FlashcardRepository {
  async findAll(): Promise<Flashcard[]> {
    const db = getDb();
    const result = await db.execute("SELECT * FROM flashcards ORDER BY created_at DESC");
    return mapRows<Flashcard>(result.rows);
  }

  async findById(id: number): Promise<Flashcard | null> {
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT * FROM flashcards WHERE id = ?",
      args: [id],
    });
    const rows = mapRows<Flashcard>(result.rows);
    return rows[0] || null;
  }

  async create(data: CreateFlashcardDto): Promise<Flashcard> {
    const db = getDb();
    const result = await db.execute({
      sql: `INSERT INTO flashcards (french_text, english_meaning, category, difficulty_level)
            VALUES (?, ?, ?, ?) RETURNING *`,
      args: [
        data.french_text,
        data.english_meaning,
        data.category || "general",
        data.difficulty_level || "beginner",
      ],
    });
    return mapRows<Flashcard>(result.rows)[0];
  }

  async update(id: number, data: CreateFlashcardDto): Promise<Flashcard | null> {
    const db = getDb();
    await db.execute({
      sql: `UPDATE flashcards
            SET french_text = ?, english_meaning = ?, category = ?,
                difficulty_level = ?, updated_at = datetime('now')
            WHERE id = ?`,
      args: [
        data.french_text,
        data.english_meaning,
        data.category || "general",
        data.difficulty_level || "beginner",
        id,
      ],
    });
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const db = getDb();
    const result = await db.execute({
      sql: "DELETE FROM flashcards WHERE id = ?",
      args: [id],
    });
    return (result.rowsAffected ?? 0) > 0;
  }

  async updateAudioFilename(id: number, filename: string): Promise<void> {
    const db = getDb();
    await db.execute({
      sql: "UPDATE flashcards SET audio_filename = ?, updated_at = datetime('now') WHERE id = ?",
      args: [filename, id],
    });
  }

  async updateAudioR2(id: number, url: string, key: string): Promise<void> {
    const db = getDb();
    await db.execute({
      sql: "UPDATE flashcards SET audio_url = ?, audio_key = ?, updated_at = datetime('now') WHERE id = ?",
      args: [url, key, id],
    });
  }

  async findDueForReview(): Promise<Flashcard[]> {
    const db = getDb();
    const result = await db.execute(`
      SELECT f.*
      FROM flashcards f
      LEFT JOIN flashcard_reviews r ON f.id = r.flashcard_id
      WHERE r.next_review_at IS NULL OR r.next_review_at <= datetime('now')
      ORDER BY r.next_review_at ASC, f.created_at ASC
      LIMIT 20
    `);
    return mapRows<Flashcard>(result.rows);
  }

  async getReviewStats(flashcardId: number): Promise<FlashcardReview | null> {
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT * FROM flashcard_reviews WHERE flashcard_id = ? ORDER BY last_reviewed_at DESC LIMIT 1",
      args: [flashcardId],
    });
    const rows = mapRows<FlashcardReview>(result.rows);
    return rows[0] || null;
  }

  async createOrUpdateReview(
    flashcardId: number,
    data: {
      ease_factor: number;
      interval_days: number;
      repetitions: number;
      quality_rating: number;
      next_review_at: string;
    }
  ): Promise<void> {
    const db = getDb();
    const existing = await this.getReviewStats(flashcardId);

    if (existing) {
      await db.execute({
        sql: `UPDATE flashcard_reviews
              SET last_reviewed_at = datetime('now'), next_review_at = ?,
                  ease_factor = ?, interval_days = ?, repetitions = ?,
                  quality_rating = ?, updated_at = datetime('now')
              WHERE id = ?`,
        args: [
          data.next_review_at,
          data.ease_factor,
          data.interval_days,
          data.repetitions,
          data.quality_rating,
          existing.id,
        ],
      });
    } else {
      await db.execute({
        sql: `INSERT INTO flashcard_reviews
              (flashcard_id, last_reviewed_at, next_review_at, ease_factor,
               interval_days, repetitions, quality_rating)
              VALUES (?, datetime('now'), ?, ?, ?, ?, ?)`,
        args: [
          flashcardId,
          data.next_review_at,
          data.ease_factor,
          data.interval_days,
          data.repetitions,
          data.quality_rating,
        ],
      });
    }
  }
}
