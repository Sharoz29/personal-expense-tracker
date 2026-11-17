import { Router } from "express";
import { HealthMarkerController } from "../controllers/health-marker.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import {
  createHealthMarkerSchema,
  updateHealthMarkerSchema,
} from "../validators/health-marker.validator.js";

const router = Router();
const controller = new HealthMarkerController();

router.get("/", asyncHandler(controller.getAll));
router.post(
  "/",
  validate(createHealthMarkerSchema),
  asyncHandler(controller.create)
);
router.put(
  "/:id",
  validate(updateHealthMarkerSchema),
  asyncHandler(controller.update)
);
router.delete("/:id", asyncHandler(controller.delete));

export default router;
