import express, { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { container } from "tsyringe";
import { validate } from "../middlewares/zodValidate.middleware.js";
import {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validations/auth.validation.js";

export class UserRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    const authController = container.resolve(AuthController);

    this.router.post(
      "/register",
      validate(registerSchema),
      authController.register.bind(authController)
    );

    this.router.post(
      "/verify-otp",
      validate(verifyOtpSchema),
      authController.verifyOtp.bind(authController)
    );
    this.router.post(
      "/login",
      validate(loginSchema),
      authController.login.bind(authController)
    );
    this.router.post(
      "/resend-otp",
      validate(resendOtpSchema),
      authController.resendOtp.bind(authController)
    );
    this.router.post(
      "/forgot-password",
      validate(forgotPasswordSchema),
      authController.forgotPassword.bind(authController)
    );

    this.router.post(
      "/reset-password",
      validate(resetPasswordSchema),
      authController.resetPassword.bind(authController)
    );
  }

  public getRouter() {
    return this.router;
  }
}
