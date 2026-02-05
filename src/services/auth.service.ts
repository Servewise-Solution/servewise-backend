import { injectable, inject } from "tsyringe";
import type { IAuthService } from "../interfaces/services/auth.service.js";
import type { IJwtService } from "../interfaces/infra/jwtService.interface.js";
import type {
  IOTPService,
  OtpVerificationResult,
} from "../interfaces/infra/otpService.interface.js";
import type {
  IRegisterData,
  IRegisterResponse,
  PendingUserData,
  VerifyOtpData,
  VerifyOtpResponse,
} from "../interfaces/DTO/services/authService.dto.js";
import type { IAuthRepository } from "../interfaces/repository/auth.repository.js";
import type { IRedisService } from "../interfaces/infra/redisService.interface.js";
import { OTP_PREFIX, OtpPurpose } from "../constants/otp.constant.js";
import { config } from "../config/env.js";
import type { IEmailService } from "../interfaces/infra/emailService.interface.js";
import type { IPasswordHasher } from "../interfaces/infra/passwordService.interface.js";
import type { IAccountRepository } from "../interfaces/repository/account.repository.js";


@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject("IJwtService") private _jwtService: IJwtService,
    @inject("IOTPService") private _otpService: IOTPService,
    @inject("IAuthRepository") private _authRepository: IAuthRepository,
    @inject("IRedisService") private _redisService: IRedisService,
    @inject("IEmailService") private _emailService: IEmailService,
    @inject("IPasswordHasher") private _passwordHasher: IPasswordHasher,
    @inject("IAccountRepository") private _accountRepository: IAccountRepository
  ) {}

  private getOtpRedisKey(email: string, purpose: OtpPurpose): string {
    return `${OTP_PREFIX}${purpose}:${email}`;
  }

  private async generateAndSendOtp(
    email: string,
    purpose: OtpPurpose
  ): Promise<string> {
    const otp = await this._otpService.generateOtp();
    console.log(`Generated Otp for ${purpose}:`, otp);

    const redisKey = this.getOtpRedisKey(email, purpose);

    console.log("generated RedisKey:", redisKey);

    await this._redisService.set(redisKey, otp, config.OTP_EXPIRY_SECONDS);

    if (purpose === OtpPurpose.PASSWORD_RESET) {
      await this._emailService.sendPasswordResetEmail(email, otp);
    } else {
      await this._emailService.sendOtpEmail(email, otp);
    }
    return otp;
  }

  private async verifyOtpGeneric(
    email: string,
    otp: string,
    purpose: OtpPurpose
  ): Promise<OtpVerificationResult> {
    const redisKey = this.getOtpRedisKey(email, purpose);
    const storedOtp = await this._redisService.get(redisKey);
    console.log("storedOTp", storedOtp);
    console.log("OTp", otp);
    if (!storedOtp) {
      return {
        success: false,
        message: "OTP has expired or doesn't exist. Please request a new one",
      };
    }

    if (storedOtp !== otp) {
      return {
        success: false,
        message: "Invalid OTP",
      };
    }

    return {
      success: true,
      message: "OTP verified successfully",
      email,
    };
  }

  async register(data: IRegisterData): Promise<IRegisterResponse> {
    try {
      console.log(
        "entering to the usersignup function in the userauth service"
      );
      console.log("data:", data);

      const { email, password, role } = data;

      const existingUser = await this._authRepository.findByEmail(email);
      if (existingUser) {
        return {
          message: "User already exists, please login",
          success: false,
        };
      }

      const pendingUser = await this._redisService.getObject<PendingUserData>(
        `pending_user:${email}`
      );
      if (pendingUser) {
        console.log("user has pending signup, resending otp");

        const otp = await this.generateAndSendOtp(
          email,
          OtpPurpose.REGISTRATION
        );
        console.log("generated new otp for pending user:", otp);

        await this._redisService.setObject(
          `pending_user:${email}`,
          pendingUser,
          config.OTP_EXPIRY_SECONDS
        );

        return {
          message: "OTP sent to complete registration",
          success: true,
          data: { email },
        };
      }

      const hashedPassword = await this._passwordHasher.hash(password);
      const otp = await this.generateAndSendOtp(email, OtpPurpose.REGISTRATION);

      console.log("Generated otp for new user registration:", otp);

      const userData: PendingUserData = {
        ...data,
        password: hashedPassword,
      };

      await this._redisService.setObject(
        `pending_user:${email}`,
        userData,
        config.OTP_EXPIRY_SECONDS
      );

      console.log("pending user data stored in redis");

      return {
        message: "User created successfully, OTP sent",
        success: true,
        data: { email },
      };
    } catch (error) {
      console.log("Error during user signup:", error);
      throw new Error("An error occurred during the user signup");
    }
  }

  async verifyOtp(data: VerifyOtpData): Promise<VerifyOtpResponse> {
    try {
      console.log("entering to the verifyotp function in userService");

      const { otp, email, purpose } = data;

      if (OtpPurpose.REGISTRATION === purpose) {
        const pendingUser = await this._redisService.getObject<PendingUserData>(
          `pending_user:${email}`
        );

        console.log("pendingUser", pendingUser);

        if (!pendingUser) {
          return {
            success: false,
            message: "Registration expired or not found. Please signup again",
          };
        }

        const verificationResult = await this.verifyOtpGeneric(
          email,
          otp,
          OtpPurpose.REGISTRATION
        );

        if (!verificationResult.success) {
          return {
            success: false,
            message: verificationResult.message,
          };
        }

     
        const { username, phone, password, role } = pendingUser;

     
        const newAccount = await this._accountRepository.createAccount({
          email,
          password,
          role,
        });
        console.log("Created account with ID:", newAccount._id);

    
        const newUser = await this._authRepository.createUser({
          accountId: newAccount._id as any, 
          username,
          phone,
          isVerified: true,
        });

        console.log("Created user with ID:", newUser._id);

   
        const otpRedisKey = this.getOtpRedisKey(email, OtpPurpose.REGISTRATION);
        await this._redisService.delete(otpRedisKey);
        await this._redisService.delete(`pending_user:${email}`);

        return {
          message: "Email verified successfully! Please login to continue",
          success: true,
        };
      } else if (OtpPurpose.PASSWORD_RESET === purpose) {
        console.log("password resetting in the userAuthService");
        const user = await this._authRepository.findByEmail(email);
        console.log("user from the password resetting:", user);

        if (!user) {
          return {
            success: false,
            message: "User not found with this email",
          };
        }

        const verificationResult = await this.verifyOtpGeneric(
          email,
          otp,
          OtpPurpose.PASSWORD_RESET
        );

        return verificationResult;
      } else {
        return {
          success: false,
          message: "Invalid verification request",
        };
      }
    } catch (error) {
      console.log("Error during OTP verification:", error);
      return {
        success: false,
        message: "An error occurred during the otp verification",
      };
    }
  }
}