import express, { type Application } from "express";
import type { IApp } from "./interfaces/infra/app.interface.js";
import { injectable } from "tsyringe";

@injectable()
export class App implements IApp {
  private _app: Application;

  constructor() {
    this._app = express();
  }

  public getApp(): Application {
    return this._app;
  }
}
