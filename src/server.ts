import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import type { IServer } from "./interfaces/server.interface.js";
import type { IApp } from "./interfaces/app.interface.js";
import type { IDataBase } from "./interfaces/database.interface.js";
import { config } from "./config/env.js";
import { container } from "./di/container.js";

@injectable()
export class Server implements IServer {
  constructor(
    @inject("IApp") private readonly _app: IApp,
    @inject("IDataBase") private readonly _database: IDataBase,
  ) {}

  public async start(): Promise<void> {
    try {
      await this._database.connect();

      this._app.getApp().listen(config.PORT, () => {
        console.log(`server is running on http://localhost:${config.PORT}`);
      });
    } catch (error) {
      console.error("error occured while starting the server", error);
      process.exit(1);
    }
  }
}

const server = container.resolve(Server);
server.start();
