import { Request, Response } from "express";
import { AccountSnapshotService } from "../services/account-snapshot.service.js";

const service = new AccountSnapshotService();

export class AccountSnapshotController {
  async getTrajectories(req: Request, res: Response) {
    const accountId = req.query.account_id
      ? Number(req.query.account_id)
      : undefined;
    const data = await service.getTrajectories(accountId);
    res.json({ data });
  }
}
