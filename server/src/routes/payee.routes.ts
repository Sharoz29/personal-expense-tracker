import { Router } from "express";
import { PayeeController } from "../controllers/payee.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { createPayeeSchema, updatePayeeSchema } from "../validators/payee.validator.js";

const router = Router();
const controller = new PayeeController();

router.get("/", asyncHandler(controller.getAll));
router.get("/:id", asyncHandler(controller.getById));
router.post("/", validate(createPayeeSchema), asyncHandler(controller.create));
router.put("/:id", validate(updatePayeeSchema), asyncHandler(controller.update));
router.delete("/:id", asyncHandler(controller.delete));

export default router;
