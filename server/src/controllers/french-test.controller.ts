import { Request, Response } from "express";
import { FrenchTestService } from "../services/french-test.service.js";

const service = new FrenchTestService();

export class FrenchTestController {
  // Test Results
  async getAllResults(_req: Request, res: Response) {
    const data = await service.getAllResults();
    res.json({ data });
  }

  async getResultById(req: Request, res: Response) {
    const data = await service.getResultById(Number(req.params.id));
    if (!data) {
      res.status(404).json({ error: "Test result not found" });
      return;
    }
    res.json({ data });
  }

  async createResult(req: Request, res: Response) {
    const data = await service.createResult(req.body);
    res.status(201).json({ data });
  }

  async deleteResult(req: Request, res: Response) {
    const deleted = await service.deleteResult(Number(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: "Test result not found" });
      return;
    }
    res.status(204).send();
  }

  // Questions
  async getAllQuestions(req: Request, res: Response) {
    const { category } = req.query;
    const data = category
      ? await service.getQuestionsByCategory(String(category))
      : await service.getAllQuestions();
    res.json({ data });
  }

  async createQuestion(req: Request, res: Response) {
    const data = await service.createQuestion(req.body);
    res.status(201).json({ data });
  }

  async deleteQuestion(req: Request, res: Response) {
    const deleted = await service.deleteQuestion(Number(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: "Question not found" });
      return;
    }
    res.status(204).send();
  }
}
