import { z } from "zod";

export const createFamilyMemberSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  relationship: z.string().min(1, "Relationship is required").max(50),
  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
    .optional(),
});

export const updateFamilyMemberSchema = createFamilyMemberSchema;
