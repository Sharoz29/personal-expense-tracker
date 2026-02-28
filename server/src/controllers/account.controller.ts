import { Request, Response } from "express";
import { AccountService } from "../services/account.service.js";

const service = new AccountService();

export class AccountController {
  async getAll(_req: Request, res: Response) {
    const data = await service.getAll();
    res.json({ data });
  }

  async getById(req: Request, res: Response) {
    const data = await service.getById(Number(req.params.id));
    if (!data) {
      res.status(404).json({ error: "Account not found" });
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
      res.status(404).json({ error: "Account not found" });
      return;
    }
    res.json({ data });
  }

  async delete(req: Request, res: Response) {
    const deleted = await service.delete(Number(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: "Account not found" });
      return;
    }
    res.status(204).send();
  }

  async getTransfers(_req: Request, res: Response) {
    const data = await service.getTransfers();
    res.json({ data });
  }

  async createTransfer(req: Request, res: Response) {
    const data = await service.createTransfer(req.body);
    res.status(201).json({ data });
  }
}
