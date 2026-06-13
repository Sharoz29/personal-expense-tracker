import { z } from "zod";

export const createIncomeSchema = z.object({
  income_source_id: z.number().int().positive(),
  account_id: z.number().int().positive(),
  amount: z.number().nonnegative("Amount must be >= 0"),
  description: z.string().default(""),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000),
  installment_plan_id: z.number().int().positive().optional(),
  reference_number: z.string().optional(),
});

export const updateIncomeSchema = createIncomeSchema;

export const monthYearQuerySchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000),
});
