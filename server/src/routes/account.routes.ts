import { Router } from "express";
import { AccountController } from "../controllers/account.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import {
  createAccountSchema,
  updateAccountSchema,
  createTransferSchema,
} from "../validators/account.validator.js";

const router = Router();
const controller = new AccountController();

router.get("/transfers", asyncHandler(controller.getTransfers));
router.post("/transfers", validate(createTransferSchema), asyncHandler(controller.createTransfer));
router.get("/", asyncHandler(controller.getAll));
router.get("/:id", asyncHandler(controller.getById));
router.post("/", validate(createAccountSchema), asyncHandler(controller.create));
router.put("/:id", validate(updateAccountSchema), asyncHandler(controller.update));
router.delete("/:id", asyncHandler(controller.delete));

export default router;
