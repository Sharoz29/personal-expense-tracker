import { Router } from "express";
import { HealthReportCategoryController } from "../controllers/health-report-category.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import {
  createHealthReportCategorySchema,
  updateHealthReportCategorySchema,
} from "../validators/health-report-category.validator.js";

const router = Router();
const controller = new HealthReportCategoryController();

router.get("/", asyncHandler(controller.getAll));
router.post(
  "/",
  validate(createHealthReportCategorySchema),
  asyncHandler(controller.create)
);
router.put(
  "/:id",
  validate(updateHealthReportCategorySchema),
  asyncHandler(controller.update)
);
router.delete("/:id", asyncHandler(controller.delete));

export default router;
