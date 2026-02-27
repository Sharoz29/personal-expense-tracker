import { Request, Response } from "express";
import { ExpenseService } from "../services/expense.service.js";

const service = new ExpenseService();

export class ExpenseController {
  async getByMonthYear(req: Request, res: Response) {
    const { month, year } = req.query;
    const data = await service.getByMonthYear(Number(month), Number(year));
    res.json({ data });
  }

  async getById(req: Request, res: Response) {
    const data = await service.getById(Number(req.params.id));
    if (!data) {
      res.status(404).json({ error: "Expense not found" });
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
      res.status(404).json({ error: "Expense not found" });
      return;
    }
    res.json({ data });
  }

  async delete(req: Request, res: Response) {
    const deleted = await service.delete(Number(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: "Expense not found" });
      return;
    }
    res.status(204).send();
  }

  async getByTypeName(req: Request, res: Response) {
    const { typeName } = req.query;
    const data = await service.getByTypeName(String(typeName));
    res.json({ data });
  }

  async getSummary(req: Request, res: Response) {
    const { month, year } = req.query;
    const total = await service.getSummary(Number(month), Number(year));
    res.json({ data: { total } });
  }
}
