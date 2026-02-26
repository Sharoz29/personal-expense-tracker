import { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service.js";

const service = new DashboardService();

export class DashboardController {
  async getSummary(req: Request, res: Response) {
    const { month, year } = req.query;
    const data = await service.getSummary(Number(month), Number(year));
    res.json({ data });
  }
}
