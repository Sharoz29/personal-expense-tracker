import { Router } from "express";
import { CommitteeController } from "../controllers/committee.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { createCommitteeSchema, updateCommitteeSchema } from "../validators/committee.validator.js";

const router = Router();
const controller = new CommitteeController();

router.get("/", asyncHandler(controller.getAll));
router.post("/", validate(createCommitteeSchema), asyncHandler(controller.create));
router.put("/:id", validate(updateCommitteeSchema), asyncHandler(controller.update));
router.delete("/:id", asyncHandler(controller.delete));

export default router;
