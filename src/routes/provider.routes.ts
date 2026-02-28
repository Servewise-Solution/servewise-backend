import express, { Router } from "express";
import { container } from "tsyringe";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendOtpSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from "../validations/auth.validation.js";
import { validate } from "../middlewares/zodValidate.middleware.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { Roles } from "../constants/roles.js";
import { ProviderController } from "../controllers/provider.controller.js";


export class ProviderRoutes {
  private router: Router;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = express.Router();
    this.authMiddleware = AuthMiddleware.getInstance();
    this.setupRoutes();
  }

  private setupRoutes() {
    const providerController = container.resolve(ProviderController);

    this.router.post(
      "/register",
      validate(registerSchema),
      providerController.register.bind(providerController)
    );

    this.router.post(
      "/login",
      validate(loginSchema),
      providerController.login.bind(providerController)
    );

    this.router.post(
      "/verify-otp",
      validate(verifyOtpSchema),
      providerController.verifyOtp.bind(providerController)
    );

    this.router.post(
      "/resend-otp",
      validate(resendOtpSchema),
      providerController.resendOtp.bind(providerController)
    );

    this.router.post(
      "/forgot-password",
      validate(forgotPasswordSchema),
      providerController.forgotPassword.bind(providerController)
    );

    this.router.post(
      "/reset-password",
      validate(resetPasswordSchema),
      providerController.resetPassword.bind(providerController)
    );
    this.router.get(
      "/",
      this.authMiddleware.authenticate(Roles.PROVIDER),
      providerController.getAllProviders.bind(providerController)
    );

    this.router.patch(
      "/:userId/block",
      this.authMiddleware.authenticate(Roles.PROVIDER),
      providerController.toggleProviderStatus.bind(providerController)
    );

    this.router.get(
      "/get-all-providers",
      this.authMiddleware.authenticate(Roles.ADMIN),
      providerController.getAllProviders.bind(providerController)
    );

    this.router.get(
      "/logout",
      this.authMiddleware.authenticate(Roles.PROVIDER),
      providerController.logout.bind(providerController)
    );
  }

  public getRouter() {
    return this.router;
  }
}
