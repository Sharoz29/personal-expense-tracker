import { Router } from "express";
import { MutualFundCompanyController } from "../controllers/mutual-fund-company.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { createMutualFundCompanySchema, updateMutualFundCompanySchema } from "../validators/mutual-fund-company.validator.js";

const router = Router();
const controller = new MutualFundCompanyController();

router.get("/", asyncHandler(controller.getAll));
router.get("/:id", asyncHandler(controller.getById));
router.post("/", validate(createMutualFundCompanySchema), asyncHandler(controller.create));
router.put("/:id", validate(updateMutualFundCompanySchema), asyncHandler(controller.update));
router.delete("/:id", asyncHandler(controller.delete));

export default router;
