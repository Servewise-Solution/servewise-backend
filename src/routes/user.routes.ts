import express,{ Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../controllers/user.controller.js";

import { forgotPasswordSchema, loginSchema, registerSchema, resendOtpSchema, resetPasswordSchema, verifyOtpSchema } from "../validations/auth.validation.js";
import { validate } from "../middlewares/zodValidate.middleware.js";


export class UserRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    const userController = container.resolve(UserController);

    this.router.post("/register",validate(registerSchema),userController.register.bind(userController));

    this.router.post("/login",validate(loginSchema),userController.login.bind(userController));

    this.router.post(
      "/verify-otp",validate(verifyOtpSchema),
      userController.verifyOtp.bind(userController)
    );

    this.router.post(
      "/resend-otp",validate(resendOtpSchema),
      userController.resendOtp.bind(userController)
    );

    this.router.post(
      "/forgot-password",validate(forgotPasswordSchema),
      userController.forgotPassword.bind(userController)
    );

    this.router.post(
      "/reset-password",validate(resetPasswordSchema),
      userController.resetPassword.bind(userController)
    );
    this.router.get(
      "/",
      userController.getAllUsers.bind(userController)
    );
    this.router.get(
      "/logout",
      userController.logout.bind(userController)
    );
  }

  public getRouter() {
    return this.router;
  }
}