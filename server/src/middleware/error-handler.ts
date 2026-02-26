import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(`[ERROR] ${err.message}`, err.stack);

  if (err.message.includes("FOREIGN KEY constraint failed")) {
    res.status(409).json({
      error: "Cannot delete this record because it is referenced by other data.",
    });
    return;
  }

  if (err.message.includes("UNIQUE constraint failed")) {
    res.status(409).json({
      error: "A record with this name already exists.",
    });
    return;
  }

  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
}
