import { z } from "zod";

export const createPayableSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().positive("Amount must be positive"),
  from_person: z.string().default(""),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD").optional(),
  payable_type_id: z.number().int().positive().optional(),
  status: z.enum(["pending", "paid"]).default("pending"),
  account_id: z.number().int().positive().optional(),
  paid_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD").optional(),
});

export const updatePayableSchema = createPayableSchema;

export const markPaidSchema = z.object({
  account_id: z.number().int().positive(),
});
