import { Router } from "express";
import { FrenchTestController } from "../controllers/french-test.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { createTestResultSchema, createQuestionSchema } from "../validators/french-test.validator.js";

const router = Router();
const controller = new FrenchTestController();

// Test Results
router.get("/results", asyncHandler(controller.getAllResults));
router.get("/results/:id", asyncHandler(controller.getResultById));
router.post("/results", validate(createTestResultSchema), asyncHandler(controller.createResult));
router.delete("/results/:id", asyncHandler(controller.deleteResult));

// Questions
router.get("/questions", asyncHandler(controller.getAllQuestions));
router.post("/questions", validate(createQuestionSchema), asyncHandler(controller.createQuestion));
router.delete("/questions/:id", asyncHandler(controller.deleteQuestion));

export default router;
