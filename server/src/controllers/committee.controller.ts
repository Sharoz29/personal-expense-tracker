import { Request, Response } from "express";
import { CommitteeService } from "../services/committee.service.js";

const service = new CommitteeService();

export class CommitteeController {
  async getAll(_req: Request, res: Response) {
    const data = await service.getAll();
    const payments = await service.getAllPayments();
    res.json({ data, payments });
  }

  async create(req: Request, res: Response) {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }

  async update(req: Request, res: Response) {
    const data = await service.update(Number(req.params.id), req.body);
    if (!data) { res.status(404).json({ error: "Committee not found" }); return; }
    res.json({ data });
  }

  async delete(req: Request, res: Response) {
    const deleted = await service.delete(Number(req.params.id));
    if (!deleted) { res.status(404).json({ error: "Committee not found" }); return; }
    res.status(204).send();
  }

  async payMonth(req: Request, res: Response) {
    try {
      const data = await service.payMonth(Number(req.params.id), req.body);
      res.status(201).json({ data });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async undoPayment(req: Request, res: Response) {
    try {
      await service.undoPayment(Number(req.params.paymentId));
      res.status(204).send();
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
