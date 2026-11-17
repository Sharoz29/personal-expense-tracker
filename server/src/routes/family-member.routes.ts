import { Router } from "express";
import { FamilyMemberController } from "../controllers/family-member.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import {
  createFamilyMemberSchema,
  updateFamilyMemberSchema,
} from "../validators/family-member.validator.js";

const router = Router();
const controller = new FamilyMemberController();

router.get("/", asyncHandler(controller.getAll));
router.get("/:id", asyncHandler(controller.getById));
router.post(
  "/",
  validate(createFamilyMemberSchema),
  asyncHandler(controller.create)
);
router.put(
  "/:id",
  validate(updateFamilyMemberSchema),
  asyncHandler(controller.update)
);
router.delete("/:id", asyncHandler(controller.delete));

export default router;
