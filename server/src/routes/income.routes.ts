import { Router } from "express";
import { IncomeController } from "../controllers/income.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { createIncomeSchema, updateIncomeSchema, monthYearQuerySchema } from "../validators/income.validator.js";

const router = Router();
const controller = new IncomeController();

router.get("/summary", validate(monthYearQuerySchema, "query"), asyncHandler(controller.getSummary));
router.get("/", validate(monthYearQuerySchema, "query"), asyncHandler(controller.getByMonthYear));
router.get("/:id", asyncHandler(controller.getById));
router.post("/", validate(createIncomeSchema), asyncHandler(controller.create));
router.put("/:id", validate(updateIncomeSchema), asyncHandler(controller.update));
router.delete("/:id", asyncHandler(controller.delete));

export default router;
