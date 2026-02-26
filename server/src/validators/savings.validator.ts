import { z } from "zod";

export const calculateSavingsSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000),
});

export const updateSavingsSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000),
  amount: z.number(),
  notes: z.string().default(""),
});

export const monthYearQuerySchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000),
});
