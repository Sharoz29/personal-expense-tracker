import { Router } from "express";
import { HealthReportController } from "../controllers/health-report.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import {
  createHealthReportSchema,
  updateHealthReportSchema,
  healthReportHistoryQuerySchema,
  healthReportFilterQuerySchema,
} from "../validators/health-report.validator.js";

const router = Router();
const controller = new HealthReportController();

// History must come before /:id to avoid param conflict
router.get(
  "/history",
  validate(healthReportHistoryQuerySchema, "query"),
  asyncHandler(controller.getHistory)
);
router.get(
  "/",
  validate(healthReportFilterQuerySchema, "query"),
  asyncHandler(controller.getAll)
);
router.get("/:id", asyncHandler(controller.getById));
router.post(
  "/",
  validate(createHealthReportSchema),
  asyncHandler(controller.create)
);
router.put(
  "/:id",
  validate(updateHealthReportSchema),
  asyncHandler(controller.update)
);
router.delete("/:id", asyncHandler(controller.delete));

export default router;
