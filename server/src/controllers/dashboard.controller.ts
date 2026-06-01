import { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service.js";

const service = new DashboardService();

export class DashboardController {
  async getSummary(req: Request, res: Response) {
    const { month, year } = req.query;
    const data = await service.getSummary(Number(month), Number(year));
    res.json({ data });
  }

  async getSavingsHistory(_req: Request, res: Response) {
    const data = await service.getSavingsHistory();
    res.json({ data });
  }

  async getAnnualSummary(req: Request, res: Response) {
    const { year } = req.query;
    const data = await service.getAnnualSummary(Number(year));
    res.json({ data });
  }

  async getCategoryBreakdown(req: Request, res: Response) {
    const { year, category, type } = req.query;
    const data = await service.getCategoryBreakdown(Number(year), String(category), type as "expense" | "income");
    res.json({ data });
  }
}
