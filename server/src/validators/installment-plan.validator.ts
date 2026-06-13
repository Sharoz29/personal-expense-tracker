import { z } from "zod";

export const createInstallmentPlanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  total_amount: z.number().min(0, "Total amount must be >= 0"),
  buyer_name: z.string().min(1, "Buyer name is required"),
  description: z.string().optional(),
});

export const updateInstallmentPlanSchema = createInstallmentPlanSchema;
