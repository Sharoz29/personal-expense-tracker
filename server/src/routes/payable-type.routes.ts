import { Router } from "express";
import { PayableTypeController } from "../controllers/payable-type.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { createPayableTypeSchema, updatePayableTypeSchema } from "../validators/payable-type.validator.js";

const router = Router();
const controller = new PayableTypeController();

router.get("/", asyncHandler(controller.getAll));
router.get("/:id", asyncHandler(controller.getById));
router.post("/", validate(createPayableTypeSchema), asyncHandler(controller.create));
router.put("/:id", validate(updatePayableTypeSchema), asyncHandler(controller.update));
router.delete("/:id", asyncHandler(controller.delete));

export default router;
