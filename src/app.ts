import express, { type Application } from "express";
import type { IApp } from "./interfaces/infra/app.interface.js";
import { injectable } from "tsyringe";
import { createServer, Server as HttpServer } from "http";
import { RouteRegistry } from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";


@injectable()
export class App implements IApp {
  public _app: Application;
  public server: HttpServer;

  constructor() {
    this._app = express();
    this.setupMiddlewares(); 
    this.setupRoutes();      
    this.server = createServer(this._app);
  }


  private setupMiddlewares(): void {

    this._app.use(
      cors({
        origin:"http:localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: [
          "Authorization",
          "Content-Type",
          "Access-Control-Allow-Headers",
          "Origin",
          "Accept",
          "X-Requested-With",
          "Access-Control-Request-Method",
          "Access-Control-Request-Headers",
        ],
        exposedHeaders: ["Set-Cookie"],
        credentials: true,
      })
    );

    this._app.use(express.json());
    this._app.use(cookieParser());
  }

  private setupRoutes(): void {
    RouteRegistry.registerRoutes(this._app);
  }

  public getApp(): Application {
    return this._app;
  }
}
