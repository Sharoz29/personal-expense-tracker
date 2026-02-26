import { Router } from "express";
import { SavingsController } from "../controllers/savings.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { calculateSavingsSchema, updateSavingsSchema, monthYearQuerySchema } from "../validators/savings.validator.js";

const router = Router();
const controller = new SavingsController();

router.get("/", asyncHandler(controller.getAll));
router.get("/monthly", validate(monthYearQuerySchema, "query"), asyncHandler(controller.getByMonthYear));
router.post("/calculate", validate(calculateSavingsSchema), asyncHandler(controller.calculate));
router.put("/", validate(updateSavingsSchema), asyncHandler(controller.update));

export default router;
