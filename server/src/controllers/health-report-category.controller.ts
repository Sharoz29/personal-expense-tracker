import { Request, Response } from "express";
import { HealthReportCategoryService } from "../services/health-report-category.service.js";

const service = new HealthReportCategoryService();

export class HealthReportCategoryController {
  async getAll(_req: Request, res: Response) {
    const data = await service.getAllWithMarkers();
    res.json({ data });
  }

  async create(req: Request, res: Response) {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }

  async update(req: Request, res: Response) {
    const data = await service.update(Number(req.params.id), req.body);
    if (!data) {
      res.status(404).json({ error: "Health report category not found" });
      return;
    }
    res.json({ data });
  }

  async delete(req: Request, res: Response) {
    const deleted = await service.delete(Number(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: "Health report category not found" });
      return;
    }
    res.status(204).send();
  }
}
