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

import type { IPasswordHasher } from "../interfaces/infra/passwordService.interface.js";
import type { IJwtService } from "../interfaces/infra/jwtService.interface.js";
import type { IOTPService } from "../interfaces/infra/otpService.interface.js";
import type { IRedisService } from "../interfaces/infra/redisService.interface.js";
import { AuthRepository } from "../repositories/auth.repository.js";
import type { IAuthRepository } from "../interfaces/repository/auth.repository.js";
import type { IEmailService } from "../interfaces/infra/emailService.interface.js";
import { EmailService } from "../services/email.service.js";
import type { IAuthService } from "../interfaces/services/auth.service.js";
import { AuthService } from "../services/auth.service.js";
import { AccountRepository } from "../repositories/account.repository.js";
import type { IAccountRepository } from "../interfaces/repository/account.repository.js";
import { EmailTemplateService } from "../services/emailTemplate.service.js";
import type { IemailTemplateService } from "../interfaces/infra/emailTemplate.interface.js";

container.registerSingleton<IApp>("IApp", App);
container.registerSingleton<IDataBase>("IDataBase", MongoDBConnection);
container.registerSingleton<IPasswordHasher>("IPasswordHasher", PasswordHasher);
container.registerSingleton<IJwtService>("IJwtService", JWTService);
container.registerSingleton<IOTPService>("IOTPService", OTPService);
container.registerSingleton<IRedisService>("IRedisService", RedisService);
container.registerSingleton<IAuthRepository>("IAuthRepository",AuthRepository)
container.registerSingleton<IAuthService>("IAuthService",AuthService)
container.registerSingleton<IEmailService>("IEmailService",EmailService)
container.registerSingleton<IAccountRepository>("IAccountRepository",AccountRepository)
container.registerSingleton<IemailTemplateService>("IemailTemplateService",EmailTemplateService);
  


export { container };
