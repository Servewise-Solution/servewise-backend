import dotenv from "dotenv";
import type { IConfig } from "../interfaces/infra/env.interface.js";
dotenv.config({ quiet: true });

function validateEnvVars() {
  const requiredEnvVars = [
    "PORT",
    "CLIENT_URL",
    "MONGODB_URI",
    "JWT_SECRET",
    "JWT_REFRESH_SECRET",
    "JWT_EXPIRATION",
    "JWT_REFRESH_EXPIRATION",
    "REFRESH_TOKEN_COOKIE_MAX_AGE",
    "REDIS_HOST",
    "REDIS_PORT",
    "EMAIL_PASS",
    "EMAIL_USER",
    "OTP_EXPIRY_SECONDS"
  ];

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
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION as string,
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION as string,
  REFRESH_TOKEN_COOKIE_MAX_AGE: Number(
    process.env.REFRESH_TOKEN_COOKIE_MAX_AGE,
  ),
  REDIS_HOST: process.env.REDIS_HOST as string,
  REDIS_PORT: Number(process.env.REDIS_PORT),
  EMAIL_USER: process.env.EMAIL_USER as string,
  EMAIL_PASS: process.env.EMAIL_PASS as string,
  OTP_EXPIRY_SECONDS: Number(process.env.OTP_EXPIRY_SECONDS) || 300,
};
