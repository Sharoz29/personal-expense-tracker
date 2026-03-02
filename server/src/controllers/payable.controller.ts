import { Request, Response } from "express";
import { PayableService } from "../services/payable.service.js";

const service = new PayableService();

export class PayableController {
  async getAll(_req: Request, res: Response) {
    const data = await service.getAll();
    res.json({ data });
  }

  async create(req: Request, res: Response) {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }

  async update(req: Request, res: Response) {
    const data = await service.update(Number(req.params.id), req.body);
    if (!data) {
      res.status(404).json({ error: "Payable not found or already paid" });
      return;
    }
    res.json({ data });
  }

  async markPaid(req: Request, res: Response) {
    try {
      const data = await service.markPaid(Number(req.params.id), req.body.account_id);
      if (!data) {
        res.status(404).json({ error: "Payable not found" });
        return;
      }
      res.json({ data });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    const deleted = await service.delete(Number(req.params.id));
    if (!deleted) {
      res.status(404).json({ error: "Payable not found or already paid" });
      return;
    }
    res.status(204).send();
  }
}
