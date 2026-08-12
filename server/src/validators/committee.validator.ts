import { z } from "zod";

export const createCommitteeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  total_members: z.number().int().positive("Total members must be positive"),
  contribution_per_month: z.number().positive("Contribution must be positive"),
  my_month: z.number().int().positive("My month must be positive"),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  account_id: z.number().int().positive().optional(),
});

export const updateCommitteeSchema = createCommitteeSchema;
