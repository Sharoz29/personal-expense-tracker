import { Router } from "express";
import { AssetController } from "../controllers/asset.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { createAssetSchema, updateAssetSchema } from "../validators/asset.validator.js";

const router = Router();
const controller = new AssetController();

router.get("/", asyncHandler(controller.getAll));
router.post("/", validate(createAssetSchema), asyncHandler(controller.create));
router.put("/:id", validate(updateAssetSchema), asyncHandler(controller.update));
router.delete("/:id", asyncHandler(controller.delete));

export default router;
