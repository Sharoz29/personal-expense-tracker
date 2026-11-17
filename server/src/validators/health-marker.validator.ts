import { z } from "zod";

export const createHealthMarkerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  unit: z.string().default(""),
  category_id: z.number().int().positive("Category is required"),
});

export const updateHealthMarkerSchema = createHealthMarkerSchema;
