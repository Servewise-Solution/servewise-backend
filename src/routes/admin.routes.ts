import type { Router } from "express";
import express from "express";
import { container } from "tsyringe";
import { AdminController } from "../controllers/admin.controller.js";
import { Roles } from "../constants/roles.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

export class AdminRoutes {
  private router: Router;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = express.Router();
    this.authMiddleware = AuthMiddleware.getInstance();
    this.setupRoutes();
  }

  private setupRoutes() {
    const adminController = container.resolve(AdminController);

    this.router.post("/login", adminController.login.bind(adminController));

    this.router.get(
      "/logout",
      this.authMiddleware.authenticate(Roles.ADMIN),
      adminController.logout.bind(adminController)
    );
  }
  public getRouter() {
    return this.router;
  }
}
