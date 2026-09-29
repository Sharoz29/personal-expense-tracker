import { getDb } from "../config/db.js";
import type { FrenchTestResult, FrenchQuestion, CreateTestResultDto, CreateQuestionDto } from "../types/index.js";
import { mapRows } from "../utils/db.js";

export class FrenchTestRepository {
  // Test Results
  async findAllResults(): Promise<FrenchTestResult[]> {
    const db = getDb();
    const result = await db.execute("SELECT * FROM french_test_results ORDER BY completed_at DESC");
    return mapRows<FrenchTestResult>(result.rows);
  }

  async findResultById(id: number): Promise<FrenchTestResult | null> {
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT * FROM french_test_results WHERE id = ?",
      args: [id],
    });
    const rows = mapRows<FrenchTestResult>(result.rows);
    return rows[0] || null;
  }

  async createResult(data: CreateTestResultDto): Promise<FrenchTestResult> {
    const db = getDb();
    const percentage = (data.score / data.total_questions) * 100;
    const result = await db.execute({
      sql: `INSERT INTO french_test_results
            (test_name, test_type, score, total_questions, percentage, time_taken_seconds, answers_json)
            VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *`,
      args: [
        data.test_name,
        data.test_type,
        data.score,
        data.total_questions,
        percentage,
        data.time_taken_seconds ?? null,
        data.answers_json ?? null,
      ],
    });
    return mapRows<FrenchTestResult>(result.rows)[0];
  }

  async deleteResult(id: number): Promise<boolean> {
    const db = getDb();
    const result = await db.execute({
      sql: "DELETE FROM french_test_results WHERE id = ?",
      args: [id],
    });
    return (result.rowsAffected ?? 0) > 0;
  }

  // Questions
  async findAllQuestions(): Promise<FrenchQuestion[]> {
    const db = getDb();
    const result = await db.execute("SELECT * FROM french_questions ORDER BY created_at DESC");
    return mapRows<FrenchQuestion>(result.rows);
  }

  async findQuestionsByCategory(category: string): Promise<FrenchQuestion[]> {
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT * FROM french_questions WHERE category = ? ORDER BY created_at DESC",
      args: [category],
    });
    return mapRows<FrenchQuestion>(result.rows);
  }

  async createQuestion(data: CreateQuestionDto): Promise<FrenchQuestion> {
    const db = getDb();
    const result = await db.execute({
      sql: `INSERT INTO french_questions
            (question, option_a, option_b, option_c, option_d, correct_answer, category, difficulty)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
      args: [
        data.question,
        data.option_a,
        data.option_b,
        data.option_c,
        data.option_d,
        data.correct_answer,
        data.category || "vocabulary",
        data.difficulty || "beginner",
      ],
    });
    return mapRows<FrenchQuestion>(result.rows)[0];
  }

  async deleteQuestion(id: number): Promise<boolean> {
    const db = getDb();
    const result = await db.execute({
      sql: "DELETE FROM french_questions WHERE id = ?",
      args: [id],
    });
    return (result.rowsAffected ?? 0) > 0;
  }
}
