import { Request, Response } from "express";
import { HealthReportService } from "../services/health-report.service.js";

const service = new HealthReportService();

export class HealthReportController {
  async getAll(req: Request, res: Response) {
    const filters: { family_member_id?: number; category_id?: number } = {};
    if (req.query.family_member_id)
      filters.family_member_id = Number(req.query.family_member_id);
    if (req.query.category_id)
      filters.category_id = Number(req.query.category_id);
    const data = await service.getAll(filters);
    res.json({ data });
  }

  async getById(req: Request, res: Response) {
    const data = await service.getById(Number(req.params.id));
    if (!data) {
      res.status(404).json({ error: "Health report not found" });
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
      res.status(404).json({ error: "Health report not found" });
      return;
    }
    res.json({ data });
  }

  async delete(req: Request, res: Response) {
    const deleted = await service.delete(Number(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: "Health report not found" });
      return;
    }
    res.status(204).send();
  }

  async getHistory(req: Request, res: Response) {
    const familyMemberId = Number(req.query.family_member_id);
    const markerId = Number(req.query.marker_id);
    const data = await service.getMarkerHistory(familyMemberId, markerId);
    res.json({ data });
  }
}
