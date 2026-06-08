import { z } from "zod";

export const createLoanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  total_amount: z.number().min(0, "Total amount must be >= 0"),
  description: z.string().optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD").optional(),
});

export const updateLoanSchema = createLoanSchema;
