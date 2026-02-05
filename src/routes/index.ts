// src/routes/index.ts
import type { Application, Request, Response } from "express"; 
import { UserRoutes } from "./auth.routes.js";

export class RouteRegistry {

  public static registerRoutes(app: Application): void { 
    const userRoutes = new UserRoutes();
    app.use("/api/auth", userRoutes.getRouter());

    app.get("/health", (_req: Request, res: Response) => {
      res.status(200).json({ message: "backend is running..." });
    });
  }
}
