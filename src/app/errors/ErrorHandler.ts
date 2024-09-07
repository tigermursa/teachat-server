import { Request, Response, NextFunction } from "express";
import { CustomError } from "./CustomError";

export function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  // default status code and message
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log the error (avoid logging in production)
  if (process.env.NODE_ENV !== "production") {
    console.error(`[${new Date().toISOString()}] ${err.name}: ${message}`);
  }

  // Respond  the error
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
    },
  });
}

//this using at app.ts
