import { Router } from "express";
import { InstallmentPlanController } from "../controllers/installment-plan.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { createInstallmentPlanSchema, updateInstallmentPlanSchema } from "../validators/installment-plan.validator.js";

const router = Router();
const controller = new InstallmentPlanController();

router.get("/", asyncHandler(controller.getAll));
router.get("/:id", asyncHandler(controller.getById));
router.post("/", validate(createInstallmentPlanSchema), asyncHandler(controller.create));
router.put("/:id", validate(updateInstallmentPlanSchema), asyncHandler(controller.update));
router.delete("/:id", asyncHandler(controller.delete));

export default router;
