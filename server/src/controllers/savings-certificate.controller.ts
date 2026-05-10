import { Request, Response } from "express";
import { SavingsCertificateService } from "../services/savings-certificate.service.js";

const service = new SavingsCertificateService();

export class SavingsCertificateController {
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
    if (!data) { res.status(404).json({ error: "Savings certificate not found" }); return; }
    res.json({ data });
  }

  async delete(req: Request, res: Response) {
    const deleted = await service.delete(Number(req.params.id));
    if (!deleted) { res.status(404).json({ error: "Savings certificate not found" }); return; }
    res.status(204).send();
  }

  async redeemProfit(req: Request, res: Response) {
    try {
      const data = await service.redeemProfit(Number(req.params.id), req.body.account_id);
      res.json({ data });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
