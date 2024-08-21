// src/app/errors/ErrorHandler.ts
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/CustomError";

export function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  // Set default status code and message
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log the error (avoid logging in production)
  if (process.env.NODE_ENV !== "production") {
    console.error(`[${new Date().toISOString()}] ${err.name}: ${message}`);
  }

  // Respond with the error
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
    },
  });
}
