import { Router } from "express";
import { ExpenseController } from "../controllers/expense.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { createExpenseSchema, updateExpenseSchema, monthYearQuerySchema } from "../validators/expense.validator.js";

const router = Router();
const controller = new ExpenseController();

router.get("/summary", validate(monthYearQuerySchema, "query"), asyncHandler(controller.getSummary));
router.get("/", validate(monthYearQuerySchema, "query"), asyncHandler(controller.getByMonthYear));
router.get("/:id", asyncHandler(controller.getById));
router.post("/", validate(createExpenseSchema), asyncHandler(controller.create));
router.put("/:id", validate(updateExpenseSchema), asyncHandler(controller.update));
router.delete("/:id", asyncHandler(controller.delete));

export default router;
