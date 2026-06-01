import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { monthYearQuerySchema, yearQuerySchema } from "../validators/expense.validator.js";

const router = Router();
const controller = new DashboardController();

router.get("/summary", validate(monthYearQuerySchema, "query"), asyncHandler(controller.getSummary));
router.get("/savings-history", asyncHandler(controller.getSavingsHistory));
router.get("/annual-summary", validate(yearQuerySchema, "query"), asyncHandler(controller.getAnnualSummary));

export default router;
