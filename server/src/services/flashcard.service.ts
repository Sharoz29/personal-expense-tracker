import { FlashcardRepository } from "../repositories/flashcard.repository.js";
import type { CreateFlashcardDto } from "../types/index.js";

export class FlashcardService {
  private repo = new FlashcardRepository();

  async getAll() {
    return this.repo.findAll();
  }

  async getById(id: number) {
    return this.repo.findById(id);
  }

  async create(data: CreateFlashcardDto) {
    return this.repo.create(data);
  }

  async update(id: number, data: CreateFlashcardDto) {
    return this.repo.update(id, data);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }

  async uploadAudio(id: number, filename: string) {
    await this.repo.updateAudioFilename(id, filename);
    return this.repo.findById(id);
  }

  async getDueForReview() {
    return this.repo.findDueForReview();
  }

  async reviewFlashcard(id: number, qualityRating: number) {
    // SM-2 Spaced Repetition Algorithm
    const stats = await this.repo.getReviewStats(id);

    let easeFactor = stats?.ease_factor ?? 2.5;
    let repetitions = stats?.repetitions ?? 0;
    let interval = stats?.interval_days ?? 1;

    if (qualityRating >= 3) {
      // Correct answer
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
    } else {
      // Incorrect answer - reset
      repetitions = 0;
      interval = 1;
    }

    // Adjust ease factor
    easeFactor =
      easeFactor + (0.1 - (5 - qualityRating) * (0.08 + (5 - qualityRating) * 0.02));
    easeFactor = Math.max(1.3, easeFactor);

    // Calculate next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    await this.repo.createOrUpdateReview(id, {
      ease_factor: easeFactor,
      interval_days: interval,
      repetitions,
      quality_rating: qualityRating,
      next_review_at: nextReviewDate.toISOString(),
    });

    return this.repo.findById(id);
  }
}
