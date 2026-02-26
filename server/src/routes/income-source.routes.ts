import { Router } from "express";
import { IncomeSourceController } from "../controllers/income-source.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { createIncomeSourceSchema, updateIncomeSourceSchema } from "../validators/income-source.validator.js";

const router = Router();
const controller = new IncomeSourceController();

router.get("/", asyncHandler(controller.getAll));
router.get("/:id", asyncHandler(controller.getById));
router.post("/", validate(createIncomeSourceSchema), asyncHandler(controller.create));
router.put("/:id", validate(updateIncomeSourceSchema), asyncHandler(controller.update));
router.delete("/:id", asyncHandler(controller.delete));

export default router;
