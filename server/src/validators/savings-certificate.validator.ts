import { z } from "zod";

export const createSavingsCertificateSchema = z.object({
  certificate_type: z.string().min(1, "Certificate type is required"),
  principal_amount: z.number().positive("Principal amount must be positive"),
  profit_rate: z.number().nonnegative("Profit rate must be >= 0"),
  purchase_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  maturity_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
});

export const updateSavingsCertificateSchema = createSavingsCertificateSchema;
