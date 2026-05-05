import { Router } from "express";
import { PayableController } from "../controllers/payable.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { createPayableSchema, updatePayableSchema, markPaidSchema, lumpSumSchema } from "../validators/payable.validator.js";

const router = Router();
const controller = new PayableController();

router.get("/", asyncHandler(controller.getAll));
router.post("/", validate(createPayableSchema), asyncHandler(controller.create));
router.post("/lump-sum", validate(lumpSumSchema), asyncHandler(controller.receiveLumpSum));
router.put("/:id", validate(updatePayableSchema), asyncHandler(controller.update));
router.post("/:id/mark-paid", validate(markPaidSchema), asyncHandler(controller.markPaid));
router.delete("/:id", asyncHandler(controller.delete));

export default router;
