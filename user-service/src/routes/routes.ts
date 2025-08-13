import { Router } from "express";
import { UserController } from "../controllers/index";
import { validate } from "../middlewares/validation";
import { signupSchema } from "../validation/user";
import { signupRateLimit } from "../middlewares/security";

export const createUserRoutes = (userController: UserController): Router => {
  const router = Router();

  router.post(
    "/register",
    (req, _res, next) => {
      console.log(req.body, "request body");
      next();
    },
    signupRateLimit,
    validate(signupSchema),
    userController.signup.bind(userController)
  );

  return router;
};
