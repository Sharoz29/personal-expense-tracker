import { z } from "zod";

export const createFlashcardSchema = z.object({
  french_text: z.string().min(1, "French text is required").max(500, "French text too long"),
  english_meaning: z.string().min(1, "English meaning is required").max(500, "English meaning too long"),
  category: z.string().optional(),
  difficulty_level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
});

export const updateFlashcardSchema = createFlashcardSchema;

export const reviewFlashcardSchema = z.object({
  quality_rating: z.number().int().min(0).max(5, "Quality rating must be 0-5"),
});
