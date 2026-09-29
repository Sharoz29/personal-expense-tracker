import { z } from "zod";

export const createTestResultSchema = z.object({
  test_name: z.string().min(1, "Test name is required"),
  test_type: z.string().min(1, "Test type is required"),
  score: z.number().int().min(0),
  total_questions: z.number().int().min(1),
  time_taken_seconds: z.number().int().optional(),
  answers_json: z.string().optional(),
});

export const createQuestionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  option_a: z.string().min(1),
  option_b: z.string().min(1),
  option_c: z.string().min(1),
  option_d: z.string().min(1),
  correct_answer: z.enum(["a", "b", "c", "d"]),
  category: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
});
