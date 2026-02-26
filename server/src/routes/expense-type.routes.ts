import { Router } from "express";
import { ExpenseTypeController } from "../controllers/expense-type.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { createExpenseTypeSchema, updateExpenseTypeSchema } from "../validators/expense-type.validator.js";

const router = Router();
const controller = new ExpenseTypeController();

router.get("/", asyncHandler(controller.getAll));
router.get("/:id", asyncHandler(controller.getById));
router.post("/", validate(createExpenseTypeSchema), asyncHandler(controller.create));
router.put("/:id", validate(updateExpenseTypeSchema), asyncHandler(controller.update));
router.delete("/:id", asyncHandler(controller.delete));

export default router;
