export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    if ("captureStackTrace" in Error) {
      (Error as any).captureStackTrace(this, AppError);
    }
  }
}
