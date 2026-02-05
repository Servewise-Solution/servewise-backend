import { injectable, inject } from "tsyringe";
import type { IAuthService } from "../interfaces/services/auth.service.js";
import type { IJwtService } from "../interfaces/infra/jwtService.interface.js";
import type {
  IOTPService,
  OtpVerificationResult,
} from "../interfaces/infra/otpService.interface.js";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  IRegisterData,
  IRegisterResponse,
  LoginData,
  LoginResponse,
  PendingUserData,
  ResendOtpResponse,
  ResetPasswordData,
  ResetPasswordResponse,
  VerifyOtpData,
  VerifyOtpResponse,
} from "../interfaces/DTO/services/authService.dto.js";
import type { IUserRepository } from "../interfaces/repository/auth.repository.js";
import type { IRedisService } from "../interfaces/infra/redisService.interface.js";
import { OTP_PREFIX, OtpPurpose } from "../constants/otp.constant.js";
import { config } from "../config/env.js";
import type { IEmailService } from "../interfaces/infra/emailService.interface.js";
import type { IPasswordHasher } from "../interfaces/infra/passwordService.interface.js";
import type { IAccountRepository } from "../interfaces/repository/account.repository.js";
import type { CreateUser } from "../interfaces/DTO/repository/authRepository.dto.js";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject("IJwtService") private _jwtService: IJwtService,
    @inject("IOTPService") private _otpService: IOTPService,
    @inject("IAuthRepository") private _userRepository: IUserRepository,
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
      console.log("entering user signup");

      const { email, password, username, phone } = data;

      const existingUser = await this._accountRepository.findByEmail(email);
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
        const otp = await this.generateAndSendOtp(
          email,
          OtpPurpose.REGISTRATION
        );
        console.log("otp from pending user", otp);

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
      console.log("otp", otp);

      const userData: PendingUserData = {
        email,
        username,
        phone,
        password: hashedPassword,
        role: "USER",
      };

      await this._redisService.setObject(
        `pending_user:${email}`,
        userData,
        config.OTP_EXPIRY_SECONDS
      );

      return {
        message: "User created successfully, OTP sent",
        success: true,
        data: { email },
      };
    } catch (error) {
      console.log("Error during signup:", error);
      throw new Error("Signup failed");
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

        switch (role) {
          case "USER": {
            const newUser = await this._userRepository.createUser({
              accountId: newAccount._id as any,
              username,
              phone,
              status: "Active",
              isVerified: true,
            });

            console.log("Created USER with ID:", newUser._id);
            break;
          }
          default:
            return {
              success: false,
              message: "Invalid role selected",
            };
        }

        const otpRedisKey = this.getOtpRedisKey(email, OtpPurpose.REGISTRATION);
        await this._redisService.delete(otpRedisKey);
        await this._redisService.delete(`pending_user:${email}`);

        return {
          message: "Email verified successfully! Please login to continue",
          success: true,
        };
      } else if (OtpPurpose.PASSWORD_RESET === purpose) {
        console.log("password resetting in the userAuthService");
        const user = await this._accountRepository.findByEmail(email);
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

  async login(data: LoginData): Promise<LoginResponse> {
    try {
      console.log("entering to the login credentials verifying in service");
      const { email, password } = data;

      const account = await this._accountRepository.findByEmail(email);
      console.log("user", account);

      if (!account) {
        return {
          success: false,
          message: "account not found",
        };
      }

      const user = await this._userRepository.findByAccountId(account._id);

      if (!user) {
        return {
          success: false,
          message: "user not found",
        };
      }

      if (user.status !== "Active") {
        return {
          success: false,
          message: "Your account has been blocked. Please contact support.",
        };
      }

      const isPasswordValid = await this._passwordHasher.verify(
        account.password,
        password
      );

      if (!isPasswordValid) {
        return {
          success: false,
          message: "Invalid password",
        };
      }

      const accountId = String(account._id);
      console.log("accountId from login:", accountId);

      const access_token = this._jwtService.generateAccessToken(
        accountId,
        account.role
      );

      const refresh_token = this._jwtService.generateRefreshToken(
        accountId,
        account.role
      );

      return {
        success: true,
        message: "Login successful",
        access_token,
        refresh_token,
        data: {
          _id: user._id,
          username: user.username,
          email: account.email,
          phone: user.phone,
          image: user.image,
          status: user.status,
        },
      };
    } catch (error) {
      console.log("error", error);
      return {
        success: false,
        message: "Error occurred during login",
      };
    }
  }

  async resendOtp(data: string): Promise<ResendOtpResponse> {
    try {
      console.log("entering resendotp function in the userservice");

      const user = await this._accountRepository.findByEmail(data);

      if (user) {
        const newOtp = await this.generateAndSendOtp(
          data,
          OtpPurpose.PASSWORD_RESET
        );
        console.log("generated new OTP for password reset:", newOtp);

        return {
          success: true,
          message: "OTP sent successfully for password reset",
          email: data,
        };
      }

      const pendingUser = await this._redisService.getObject<CreateUser>(
        `pending_user:${data}`
      );

      if (pendingUser) {
        const newOtp = await this.generateAndSendOtp(
          data,
          OtpPurpose.REGISTRATION
        );
        console.log("generated new OTP for registration:", newOtp);

        await this._redisService.setObject(
          `pending_user:${data}`,
          pendingUser,
          config.OTP_EXPIRY_SECONDS
        );

        return {
          success: true,
          message: "OTP sent successfully for registration",
          email: data,
        };
      }

      return {
        success: false,
        message: "User not found. Please signup first",
      };
    } catch (error) {
      console.log("error occurred while resending the otp", error);
      return {
        success: false,
        message: "Error occurred while resending the otp",
      };
    }
  }

  async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> {
    try {
      console.log("Entering forgotPassword in userService");
      const { email } = data;

      const account = await this._accountRepository.findByEmail(email);
      console.log("user", account);

      if (!account) {
        return {
          success: false,
          message: "account not found",
        };
      }

      const user = await this._userRepository.findByAccountId(account._id);

      if (!user) {
        return {
          success: false,
          message: "user not found",
        };
      }

      if (user.status !== "Active") {
        return {
          success: false,
          message: "Your account has been blocked. Please contact support.",
        };
      }
      const otp = await this.generateAndSendOtp(
        email,
        OtpPurpose.PASSWORD_RESET
      );
      console.log("Generated OTP for password reset:", otp);

      return {
        success: true,
        message: "Password reset OTP sent to your email",
        email,
      };
    } catch (error) {
      console.log("Error during forgot password:", error);
      return {
        success: false,
        message: "An error occurred during password reset process",
      };
    }
  }

  async resetPassword(data: ResetPasswordData): Promise<ResetPasswordResponse> {
    try {
      console.log("Entering resetPassword in userService");
      const { email, password } = data;

      const account = await this._accountRepository.findByEmail(email);
      console.log("user", account);

      if (!account) {
        return {
          success: false,
          message: "account not found",
        };
      }

      const user = await this._userRepository.findByAccountId(account._id);

      if (!user) {
        return {
          success: false,
          message: "user not found",
        };
      }

      if (user.status !== "Active") {
        return {
          success: false,
          message: "Your account has been blocked. Please contact support.",
        };
      }

      const hashedPassword = await this._passwordHasher.hash(password);

      await this._accountRepository.updatePassword(email, hashedPassword);

      const redisKey = this.getOtpRedisKey(email, OtpPurpose.PASSWORD_RESET);
      await this._redisService.delete(redisKey);

      return {
        success: true,
        message: "Password reset successful",
      };
    } catch (error) {
      console.log("Error during password reset:", error);
      return {
        success: false,
        message: "An error occurred during password reset",
      };
    }
  }
}
