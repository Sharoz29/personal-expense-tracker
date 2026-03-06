import { Router } from "express";
import { AssetTypeController } from "../controllers/asset-type.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { createAssetTypeSchema, updateAssetTypeSchema } from "../validators/asset-type.validator.js";

const router = Router();
const controller = new AssetTypeController();

router.get("/", asyncHandler(controller.getAll));
router.get("/:id", asyncHandler(controller.getById));
router.post("/", validate(createAssetTypeSchema), asyncHandler(controller.create));
router.put("/:id", validate(updateAssetTypeSchema), asyncHandler(controller.update));
router.delete("/:id", asyncHandler(controller.delete));

export default router;
