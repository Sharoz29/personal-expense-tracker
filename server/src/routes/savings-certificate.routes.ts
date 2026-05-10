import { Router } from "express";
import { SavingsCertificateController } from "../controllers/savings-certificate.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { createSavingsCertificateSchema, updateSavingsCertificateSchema, redeemProfitSchema } from "../validators/savings-certificate.validator.js";

const router = Router();
const controller = new SavingsCertificateController();

router.get("/", asyncHandler(controller.getAll));
router.post("/", validate(createSavingsCertificateSchema), asyncHandler(controller.create));
router.post("/:id/redeem-profit", validate(redeemProfitSchema), asyncHandler(controller.redeemProfit));
router.put("/:id", validate(updateSavingsCertificateSchema), asyncHandler(controller.update));
router.delete("/:id", asyncHandler(controller.delete));

export default router;
