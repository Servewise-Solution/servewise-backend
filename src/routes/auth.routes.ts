import express, { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { container } from "tsyringe";


export class UserRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    const authController = container.resolve(AuthController);

    this.router.post("/register", authController.register.bind(authController));

    this.router.post(
      "/verify-otp",
      authController.verifyOtp.bind(authController)
    );
  }

  public getRouter() {
    return this.router;
  }
}
