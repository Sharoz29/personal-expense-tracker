import { z } from "zod";

const healthReportResultSchema = z.object({
  marker_id: z.number().int().positive("Marker is required"),
  value: z.number({ required_error: "Value is required" }),
  min_reference: z.number().nullable().optional(),
  max_reference: z.number().nullable().optional(),
});

export const createHealthReportSchema = z.object({
  family_member_id: z.number().int().positive("Family member is required"),
  category_id: z.number().int().positive("Category is required"),
  report_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  lab_name: z.string().default(""),
  notes: z.string().default(""),
  results: z
    .array(healthReportResultSchema)
    .min(1, "At least one result is required"),
});

export const updateHealthReportSchema = createHealthReportSchema;

export const healthReportHistoryQuerySchema = z.object({
  family_member_id: z.coerce.number().int().positive("Family member is required"),
  marker_id: z.coerce.number().int().positive("Marker is required"),
});

export const healthReportFilterQuerySchema = z.object({
  family_member_id: z.coerce.number().int().positive().optional(),
  category_id: z.coerce.number().int().positive().optional(),
});
