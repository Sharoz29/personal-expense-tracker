import { Router } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const router = Router();

router.post("/verify", (req, res) => {
  const { pin } = req.body;

  if (!pin || pin !== env.APP_PIN) {
    res.status(401).json({ error: "Invalid PIN" });
    return;
  }

  const token = jwt.sign({ authenticated: true }, env.JWT_SECRET, {
    expiresIn: "24h",
  });

  res.json({ token });
});

export default router;
