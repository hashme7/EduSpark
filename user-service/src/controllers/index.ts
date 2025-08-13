import { Request, Response, NextFunction } from "express";
import { IUserService } from "../interfaces/services/IUserService";

export class UserController {
  constructor(private readonly userService: IUserService) {}

  signup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.userService.signup(req.body);
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
