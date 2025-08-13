import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { AppError } from "../utils/error";

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    console.log(req.body, "ew  klsdjkAJDSK;SKDJAS;dj ");
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.reduce((acc, detail) => {
        const key = detail.path.join(".");
        acc[key] = detail.message;
        return acc;
      }, {} as Record<string, string>);

      const appError = new AppError("Validation failed", 400);
      return next({ ...appError, errors: errorMessages });
    }
    console.log("next() without an error", value);
    req.body = value;
    next();
  };
};
