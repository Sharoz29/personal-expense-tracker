import { z } from "zod";

export const createAccountSchema = z.object({
  name: z.string().min(1).max(100),
  account_number: z.string().default(""),
  balance: z.number().default(0),
});

export const updateAccountSchema = z.object({
  name: z.string().min(1).max(100),
  account_number: z.string().default(""),
});

export const createTransferSchema = z.object({
  from_account_id: z.number().int().positive(),
  to_account_id: z.number().int().positive(),
  amount: z.number().positive("Transfer amount must be > 0"),
  description: z.string().default(""),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
}).refine((data) => data.from_account_id !== data.to_account_id, {
  message: "Cannot transfer to the same account",
});
