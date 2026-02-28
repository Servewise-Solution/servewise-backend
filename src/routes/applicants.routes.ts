import express, { Router } from "express";
import { container } from "tsyringe";
import { ApplicantsController } from "../controllers/applicants.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { Roles } from "../constants/roles.js";
import { upload } from "../middlewares/upload.middleware.js";

export class ApplicantsRoutes {
  private router: Router;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = express.Router();
    this.authMiddleware = AuthMiddleware.getInstance();
    this.setupRoutes();
  }

  private setupRoutes() {
    const applicantsController = container.resolve(ApplicantsController);

    // ===============================
    // PROVIDER SUBMIT DOCUMENTS
    // ===============================
    this.router.patch(
      "/provider-verification",
      this.authMiddleware.providerVerifyAuthenticate(Roles.PROVIDER),
      upload.fields([
        { name: "premiseImage", maxCount: 1 },
        { name: "businessLicense", maxCount: 1 },
        { name: "ownerImage", maxCount: 1 },
      ]),
      applicantsController.submitProviderDocuments.bind(applicantsController)
    );

    // ===============================
    // ADMIN - GET ALL APPLICANTS
    // ===============================
    this.router.get(
      "/",
      this.authMiddleware.authenticate(Roles.ADMIN),
      applicantsController.getAllApplicants.bind(applicantsController)
    );

    // ===============================
    // ADMIN - ACCEPT PROVIDER
    // ===============================
    this.router.patch(
      "/accept/:providerId",
      this.authMiddleware.authenticate(Roles.ADMIN),
      applicantsController.acceptProvider.bind(applicantsController)
    );

    // ===============================
    // ADMIN - REJECT PROVIDER
    // ===============================
    this.router.patch(
      "/reject/:providerId",
      this.authMiddleware.authenticate(Roles.ADMIN),
      applicantsController.rejectProvider.bind(applicantsController)
    );
  }

  public getRouter() {
    return this.router;
  }
}