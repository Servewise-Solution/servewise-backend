import express, { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../controllers/user.controller.js";
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
import { upload } from "../middlewares/upload.middleware.js";

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

    this.router.patch(
      "/provider-verification",
      this.authMiddleware.providerVerifyAuthenticate(Roles.PROVIDER),
      upload.fields([
        { name: "premiseImage", maxCount: 1 },
        { name: "companyLicense", maxCount: 1 },
        { name: "ownerImage", maxCount: 1 }
      ]),
      providerController.submitProviderDocuments.bind(providerController)
    );

    this.router.get(
      "/applicants",
      this.authMiddleware.authenticate(Roles.ADMIN),
      providerController.getAllApplicants.bind(providerController)
    );

    this.router.patch(
      "/accept/:providerId",
      this.authMiddleware.authenticate(Roles.ADMIN),
      providerController.acceptProvider.bind(providerController)
    );

    this.router.patch(
      "/reject/:providerId",
      this.authMiddleware.authenticate(Roles.ADMIN),
      providerController.rejectProvider.bind(providerController)
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
