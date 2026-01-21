import "reflect-metadata";
import { container } from "tsyringe";
import type { IApp } from "../interfaces/app.interface.js";
import { App } from "../app.js";
import type { IDataBase } from "../interfaces/database.interface.js";
import { MongoDBConnection } from "../config/database.js";

container.registerSingleton<IApp>("IApp", App);
container.registerSingleton<IDataBase>("IDataBase", MongoDBConnection);

export { container };
