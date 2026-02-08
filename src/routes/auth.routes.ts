import express, { Router } from "express";

import { container } from "tsyringe";
import { AuthController } from "../controllers/auth.controller.js";

export class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    const authController = container.resolve(AuthController);

    this.router.get(
      "/refresh-token",
      authController.newAccessToken.bind(authController)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}