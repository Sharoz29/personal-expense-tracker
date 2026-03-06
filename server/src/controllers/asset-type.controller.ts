import { Request, Response } from "express";
import { AssetTypeService } from "../services/asset-type.service.js";

const service = new AssetTypeService();

export class AssetTypeController {
  async getAll(_req: Request, res: Response) {
    const data = await service.getAll();
    res.json({ data });
  }

  async getById(req: Request, res: Response) {
    const data = await service.getById(Number(req.params.id));
    if (!data) { res.status(404).json({ error: "Asset type not found" }); return; }
    res.json({ data });
  }

  async create(req: Request, res: Response) {
    const data = await service.create(req.body);
    res.status(201).json({ data });
  }

  async update(req: Request, res: Response) {
    const data = await service.update(Number(req.params.id), req.body);
    if (!data) { res.status(404).json({ error: "Asset type not found" }); return; }
    res.json({ data });
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await service.delete(Number(req.params.id));
      if (!deleted) { res.status(404).json({ error: "Asset type not found" }); return; }
      res.status(204).send();
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
