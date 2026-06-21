import { z } from "zod";

export const createAssetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  asset_type_id: z.number().int().positive("Asset type is required"),
  current_value: z.number().nonnegative("Value must be >= 0"),
  weight_tolas: z.number().nonnegative("Weight must be >= 0").optional().nullable(),
  account_id: z.number().int().positive().optional(),
});

export const updateAssetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  asset_type_id: z.number().int().positive("Asset type is required"),
  current_value: z.number().nonnegative("Value must be >= 0"),
  weight_tolas: z.number().nonnegative("Weight must be >= 0").optional().nullable(),
});
