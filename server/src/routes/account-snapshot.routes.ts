import { Router } from "express";
import { AccountSnapshotController } from "../controllers/account-snapshot.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";

const router = Router();
const controller = new AccountSnapshotController();

router.get("/", asyncHandler(controller.getTrajectories));

export default router;
