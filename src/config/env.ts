import dotenv from "dotenv";
import type { IConfig } from "../interfaces/env.interface.js";
dotenv.config({ quiet: true });

function validateEnvVars() {
  const requiredEnvVars = ["PORT", "CLIENT_URL", "MONGODB_URI"];

  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      console.log(`missing the environmental variable:${envVar}`);
    }
  });
}

validateEnvVars();

export const config: IConfig = {
  PORT: Number(process.env.PORT),
  MONGODB_URI: process.env.MONGODB_URI as string,
  CLIENT_URL: process.env.CLIENT_URL as string,
};
