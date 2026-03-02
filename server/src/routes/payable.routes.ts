import { Router } from "express";
import { PayableController } from "../controllers/payable.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { createPayableSchema, updatePayableSchema, markPaidSchema } from "../validators/payable.validator.js";

const router = Router();
const controller = new PayableController();

router.get("/", asyncHandler(controller.getAll));
router.post("/", validate(createPayableSchema), asyncHandler(controller.create));
router.put("/:id", validate(updatePayableSchema), asyncHandler(controller.update));
router.post("/:id/mark-paid", validate(markPaidSchema), asyncHandler(controller.markPaid));
router.delete("/:id", asyncHandler(controller.delete));

export default router;
