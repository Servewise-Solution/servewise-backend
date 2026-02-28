// src/routes/index.ts
import type { Application, Request, Response } from "express"; 
import { UserRoutes } from "./user.routes.js";
import { AdminRoutes } from "./admin.routes.js";
import { AuthRoutes } from "./auth.routes.js";
import { ProviderRoutes } from "./provider.routes.js";
import { ApplicantsRoutes } from "./applicants.routes.js";

export class RouteRegistry {

  public static registerRoutes(app: Application): void { 
    const authRoutes = new AuthRoutes();
    app.use("/api/auth", authRoutes.getRouter());

    const userRoutes = new UserRoutes();
    app.use("/api/user", userRoutes.getRouter());

    const providerRoutes = new ProviderRoutes();
    app.use("/api/provider", providerRoutes.getRouter());

    const applicantsRoutes = new ApplicantsRoutes();
    app.use("/api/applicant", applicantsRoutes.getRouter());

    const adminRoutes = new AdminRoutes();
    app.use("/api/admin", adminRoutes.getRouter());

    app.get("/health", (_req: Request, res: Response) => {
      res.status(200).json({ message: "backend is running..." });
    });
  }
}
