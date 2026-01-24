import "reflect-metadata";
import { container } from "tsyringe";
import type { IApp } from "../interfaces/infra/app.interface.js";
import { App } from "../app.js";
import type { IDataBase } from "../interfaces/infra/database.interface.js";
import { MongoDBConnection } from "../config/database.js";
import { PasswordHasher } from "../services/password.service.js";
import { JWTService } from "../services/jwt.service.js";
import { OTPService } from "../services/otp.service.js";
import { RedisService } from "../services/redis.service.js";

import type { IPasswordHasher } from "../interfaces/infra/password.interface.js";
import type { IJwtService } from "../interfaces/infra/jwt.interface.js";
import type { IOTPService } from "../interfaces/infra/otp.interface.js";
import type { IRedisService } from "../interfaces/infra/redis.interface.js";

container.registerSingleton<IApp>("IApp", App);
container.registerSingleton<IDataBase>("IDataBase", MongoDBConnection);
container.registerSingleton<IPasswordHasher>("IPasswordHasher", PasswordHasher);
container.registerSingleton<IJwtService>("IJwtService", JWTService);
container.registerSingleton<IOTPService>("IOTPService", OTPService);
container.registerSingleton<IRedisService>("IRedisService", RedisService);

export { container };
