import mongoose from "mongoose";
import { config } from "./env.js";
import type { IDataBase } from "../interfaces/infra/database.interface.js";
import { injectable } from "tsyringe";

@injectable()
export class MongoDBConnection implements IDataBase {
  constructor() {}
  async connect(): Promise<void> {
    try {
      await mongoose.connect(config.MONGODB_URI);
      console.log("connected to the database successfully");
    } catch (error) {
      console.log("error occured while implementing the mongoDB connection");
      process.exit(1);
    }
  }
}

export const database: IDataBase = new MongoDBConnection();
