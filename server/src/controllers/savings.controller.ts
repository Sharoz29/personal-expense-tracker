import { Request, Response } from "express";
import { SavingsService } from "../services/savings.service.js";

const service = new SavingsService();

export class SavingsController {
  async getAll(_req: Request, res: Response) {
    const data = await service.getAll();
    res.json({ data });
  }

  async getByMonthYear(req: Request, res: Response) {
    const { month, year } = req.query;
    const data = await service.getByMonthYear(Number(month), Number(year));
    res.json({ data });
  }

  async calculate(req: Request, res: Response) {
    const { month, year } = req.body;
    const data = await service.calculateAndSave(Number(month), Number(year));
    res.json({ data });
  }

  async update(req: Request, res: Response) {
    const { month, year, amount, notes } = req.body;
    const data = await service.updateManually(Number(month), Number(year), amount, notes);
    res.json({ data });
  }
}
