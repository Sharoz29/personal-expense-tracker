import { z } from "zod";

export const createPayeeSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
});

export const updatePayeeSchema = createPayeeSchema;
