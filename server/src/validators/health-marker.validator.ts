import { z } from "zod";

export const createHealthMarkerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  unit: z.string().default(""),
  category_id: z.number().int().positive("Category is required"),
  marker_type: z.enum(["numeric", "text"]).default("numeric"),
  min_reference: z.number().nullable().optional(),
  max_reference: z.number().nullable().optional(),
  normal_value: z.string().nullable().optional(),
  reference_ranges: z.string().nullable().optional(),
});

export const updateHealthMarkerSchema = createHealthMarkerSchema;
