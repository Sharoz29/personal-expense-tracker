import { Router } from "express";
import { MutualFundTransactionController } from "../controllers/mutual-fund-transaction.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { createMutualFundTransactionSchema, updateMutualFundTransactionSchema } from "../validators/mutual-fund-transaction.validator.js";

const router = Router();
const controller = new MutualFundTransactionController();

router.get("/", asyncHandler(controller.getAll));
router.get("/fund/:fundId", asyncHandler(controller.getByFundId));
router.post("/", validate(createMutualFundTransactionSchema), asyncHandler(controller.create));
router.put("/:id", validate(updateMutualFundTransactionSchema), asyncHandler(controller.update));
router.delete("/:id", asyncHandler(controller.delete));

export default router;
