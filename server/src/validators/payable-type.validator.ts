import { z } from "zod";

export const createPayableTypeSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

export const updatePayableTypeSchema = createPayableTypeSchema;
