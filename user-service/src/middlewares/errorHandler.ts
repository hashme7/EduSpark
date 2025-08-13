import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error";
import { Logger } from "../utils/logger";

interface ErrorWithStatusAndErrors extends Error {
  statusCode?: number;
  isOperational?: boolean;
  errors?: Record<string, string>;
}

export const errorHandler = (
  err: ErrorWithStatusAndErrors,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  Logger.error("Error:", err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (err.name === "MongoServerError" && (err as any).code === 11000) {
    const message = "Duplicate field value entered";
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = "Validation Error";
    error = new AppError(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      message: error.message || "Server Error",
      ...(error.errors && { errors: error.errors }),
    },
  });
};
