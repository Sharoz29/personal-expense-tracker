import { Router } from "express";
import { FlashcardController } from "../controllers/flashcard.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { audioUpload } from "../config/upload.js";
import {
  createFlashcardSchema,
  updateFlashcardSchema,
  reviewFlashcardSchema,
} from "../validators/flashcard.validator.js";

const router = Router();
const controller = new FlashcardController();

router.get("/due", asyncHandler(controller.getDueForReview));
router.get("/", asyncHandler(controller.getAll));
router.get("/:id", asyncHandler(controller.getById));
router.post("/", validate(createFlashcardSchema), asyncHandler(controller.create));
router.put("/:id", validate(updateFlashcardSchema), asyncHandler(controller.update));
router.delete("/:id", asyncHandler(controller.delete));
router.post("/:id/audio", audioUpload.single("audio"), asyncHandler(controller.uploadAudio));
router.post("/:id/review", validate(reviewFlashcardSchema), asyncHandler(controller.review));

export default router;
