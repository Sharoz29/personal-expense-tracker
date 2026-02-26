import { z } from "zod";

export const createIncomeSourceSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

export const updateIncomeSourceSchema = createIncomeSourceSchema;
