import { Router } from "express";
import { LoanController } from "../controllers/loan.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { createLoanSchema, updateLoanSchema } from "../validators/loan.validator.js";

const router = Router();
const controller = new LoanController();

router.get("/", asyncHandler(controller.getAll));
router.get("/:id", asyncHandler(controller.getById));
router.post("/", validate(createLoanSchema), asyncHandler(controller.create));
router.put("/:id", validate(updateLoanSchema), asyncHandler(controller.update));
router.delete("/:id", asyncHandler(controller.delete));

export default router;
