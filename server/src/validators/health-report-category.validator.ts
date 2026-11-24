import { z } from "zod";

export const createHealthReportCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  follow_up_months: z.number().int().positive().nullable().optional(),
});

export const updateHealthReportCategorySchema =
  createHealthReportCategorySchema;
