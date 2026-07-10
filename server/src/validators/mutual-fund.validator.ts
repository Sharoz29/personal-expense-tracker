import { z } from "zod";

const loadTypeEnum = z.enum(["percentage", "fixed"]);

export const createMutualFundSchema = z.object({
  name: z.string().min(1, "Fund name is required"),
  company_id: z.number().int().positive("Company is required"),
  category: z.string().min(1, "Category is required"),
  risk_level: z.string().min(1, "Risk level is required"),
  front_end_load_value: z.number().nonnegative().default(0),
  front_end_load_type: loadTypeEnum.default("percentage"),
  back_end_load_value: z.number().nonnegative().default(0),
  back_end_load_type: loadTypeEnum.default("percentage"),
  other_fees_value: z.number().nonnegative().default(0),
  other_fees_type: loadTypeEnum.default("percentage"),
});

export const updateMutualFundSchema = createMutualFundSchema;
