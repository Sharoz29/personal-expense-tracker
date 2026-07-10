import { Router } from "express";
import { MutualFundController } from "../controllers/mutual-fund.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { createMutualFundSchema, updateMutualFundSchema } from "../validators/mutual-fund.validator.js";

const router = Router();
const controller = new MutualFundController();

router.get("/", asyncHandler(controller.getAll));
router.get("/company/:companyId", asyncHandler(controller.getByCompanyId));
router.get("/:id", asyncHandler(controller.getById));
router.post("/", validate(createMutualFundSchema), asyncHandler(controller.create));
router.put("/:id", validate(updateMutualFundSchema), asyncHandler(controller.update));
router.delete("/:id", asyncHandler(controller.delete));

export default router;
