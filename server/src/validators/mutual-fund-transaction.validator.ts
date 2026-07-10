import { z } from "zod";

export const createMutualFundTransactionSchema = z.object({
  fund_id: z.number().int().positive("Fund is required"),
  account_id: z.number().int().positive().optional(),
  amount: z.number().positive("Amount must be positive"),
  nav_at_purchase: z.number().positive("NAV must be positive"),
  units_allocated: z.number().positive("Units must be positive"),
  investment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  portal_reflection_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD").optional(),
  description: z.string().default(""),
});

export const updateMutualFundTransactionSchema = createMutualFundTransactionSchema;
