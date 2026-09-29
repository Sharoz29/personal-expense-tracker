import { Request, Response } from "express";
import { FlashcardService } from "../services/flashcard.service.js";

const service = new FlashcardService();

export class FlashcardController {
  async getAll(_req: Request, res: Response) {
    const data = await service.getAll();
    res.json({ data });
  }

  async getById(req: Request, res: Response) {
    const data = await service.getById(Number(req.params.id));
    if (!data) {
      res.status(404).json({ error: "Flashcard not found" });
      return;
    }
    res.json({ data });
  }

  async create(req: Request, res: Response) {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }

  async update(req: Request, res: Response) {
    const data = await service.update(Number(req.params.id), req.body);
    if (!data) {
      res.status(404).json({ error: "Flashcard not found" });
      return;
    }
    res.json({ data });
  }

  async delete(req: Request, res: Response) {
    const deleted = await service.delete(Number(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: "Flashcard not found" });
      return;
    }
    res.status(204).send();
  }

  async uploadAudio(req: Request, res: Response) {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "No audio file provided" });
      return;
    }
    // file.buffer is available because we're using memoryStorage
    const data = await service.uploadManualAudio(Number(req.params.id), file.buffer);
    res.json({ data });
  }

  async getDueForReview(_req: Request, res: Response) {
    const data = await service.getDueForReview();
    res.json({ data });
  }

  async review(req: Request, res: Response) {
    const { quality_rating } = req.body;
    const data = await service.reviewFlashcard(Number(req.params.id), quality_rating);
    res.json({ data });
  }

  async generateAudio(req: Request, res: Response) {
    const data = await service.regenerateAudio(Number(req.params.id));
    if (!data) {
      res.status(404).json({ error: "Flashcard not found" });
      return;
    }
    res.json({ data });
  }
}
