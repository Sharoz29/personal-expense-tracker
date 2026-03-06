import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/error-handler.js";
import { authMiddleware } from "./middleware/auth.js";

const app = express();

app.use(cors());
app.use(express.json());
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api", authMiddleware, routes);
app.use(errorHandler);

export default app;
