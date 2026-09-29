import { FlashcardRepository } from "../repositories/flashcard.repository.js";
import { TTSService } from "./tts.service.js";
import { uploadAudio, deleteAudio } from "../lib/r2.js";
import type { CreateFlashcardDto } from "../types/index.js";

export class FlashcardService {
  private repo = new FlashcardRepository();
  private ttsService = new TTSService();

  async getAll() {
    return this.repo.findAll();
  }

  async getById(id: number) {
    return this.repo.findById(id);
  }

  async create(data: CreateFlashcardDto) {
    // Step 1: Insert row
    const flashcard = await this.repo.create(data);

    // Step 2: Try to generate and upload audio
    try {
      const mp3Buffer = await this.ttsService.generateFrenchAudio(data.french_text);
      const { url, key } = await uploadAudio(flashcard.id, mp3Buffer);

      // Step 3: Update DB with audio URL and key
      await this.repo.updateAudioR2(flashcard.id, url, key);

      // Return updated flashcard
      return this.repo.findById(flashcard.id);
    } catch (error) {
      console.error("Failed to generate/upload TTS audio:", error);
      // Return flashcard without audio if TTS/upload fails
      return flashcard;
    }
  }

  async update(id: number, data: CreateFlashcardDto) {
    const existing = await this.repo.findById(id);
    if (!existing) return null;

    // Only regenerate if French text actually changed
    const frenchTextChanged = existing.french_text !== data.french_text;

    // Update flashcard data first
    const updated = await this.repo.update(id, data);

    if (frenchTextChanged) {
      // Capture old audio_key before regeneration
      const oldAudioKey = existing.audio_key;

      try {
        // Generate new audio
        const mp3Buffer = await this.ttsService.generateFrenchAudio(data.french_text);
        const { url, key } = await uploadAudio(id, mp3Buffer);

        // Update DB with new audio
        await this.repo.updateAudioR2(id, url, key);

        // Delete old audio object (after DB update succeeds)
        if (oldAudioKey) {
          await deleteAudio(oldAudioKey);
        }

        return this.repo.findById(id);
      } catch (error) {
        console.error("Failed to regenerate TTS audio:", error);
        return updated;
      }
    }

    return updated;
  }

  async delete(id: number) {
    // Get flashcard to retrieve audio_key
    const flashcard = await this.repo.findById(id);

    // Delete flashcard row
    const deleted = await this.repo.delete(id);

    // Delete audio object (after row deletion)
    if (flashcard?.audio_key) {
      await deleteAudio(flashcard.audio_key);
    }

    return deleted;
  }

  async uploadAudio(id: number, filename: string) {
    // Legacy method - kept for backward compatibility
    await this.repo.updateAudioFilename(id, filename);
    return this.repo.findById(id);
  }

  async uploadManualAudio(id: number, mp3Buffer: Buffer) {
    const flashcard = await this.repo.findById(id);
    if (!flashcard) return null;

    // Capture old audio_key
    const oldAudioKey = flashcard.audio_key;

    try {
      // Upload manually recorded audio to R2
      const { url, key } = await uploadAudio(id, mp3Buffer);

      // Update DB with new audio
      await this.repo.updateAudioR2(id, url, key);

      // Delete old audio object (after DB update succeeds)
      if (oldAudioKey) {
        await deleteAudio(oldAudioKey);
      }

      return this.repo.findById(id);
    } catch (error) {
      console.error("Failed to upload manual audio:", error);
      throw error;
    }
  }

  async regenerateAudio(id: number) {
    const flashcard = await this.repo.findById(id);
    if (!flashcard) return null;

    // Capture old audio_key
    const oldAudioKey = flashcard.audio_key;

    try {
      // Generate new audio
      const mp3Buffer = await this.ttsService.generateFrenchAudio(flashcard.french_text);
      const { url, key } = await uploadAudio(id, mp3Buffer);

      // Update DB with new audio
      await this.repo.updateAudioR2(id, url, key);

      // Delete old audio object (after DB update succeeds)
      if (oldAudioKey) {
        await deleteAudio(oldAudioKey);
      }

      return this.repo.findById(id);
    } catch (error) {
      console.error("Failed to regenerate TTS audio:", error);
      throw error;
    }
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
