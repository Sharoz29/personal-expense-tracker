import { Request, Response } from "express";
import { HealthMarkerService } from "../services/health-marker.service.js";

const service = new HealthMarkerService();

export class HealthMarkerController {
  async getAll(req: Request, res: Response) {
    const categoryId = req.query.category_id
      ? Number(req.query.category_id)
      : undefined;
    const data = await service.getAll(categoryId);
    res.json({ data });
  }

  async create(req: Request, res: Response) {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }

  async update(req: Request, res: Response) {
    const data = await service.update(Number(req.params.id), req.body);
    if (!data) {
      res.status(404).json({ error: "Health marker not found" });
      return;
    }
    res.json({ data });
  }

  async delete(req: Request, res: Response) {
    const deleted = await service.delete(Number(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: "Health marker not found" });
      return;
    }
    res.status(204).send();
  }
}
