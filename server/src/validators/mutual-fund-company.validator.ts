import { z } from "zod";

export const createMutualFundCompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
});

export const updateMutualFundCompanySchema = createMutualFundCompanySchema;
