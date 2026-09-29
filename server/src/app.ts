import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import routes from "./routes/index.js";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/error-handler.js";
import { authMiddleware } from "./middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Serve static audio files
app.use("/uploads/audio", express.static(path.join(__dirname, "../uploads/audio")));

app.use("/api/auth", authRoutes);
app.use("/api", authMiddleware, routes);
app.use(errorHandler);

export default app;
