import { inject, injectable } from "tsyringe";
import type { IUserService } from "../interfaces/services/user.service.js";
import type { IUserRepository } from "../interfaces/repository/user.repository.js";
import type { IOTPService, OtpVerificationResult } from "../interfaces/infra/otpService.interface.js";
import type { IRedisService } from "../interfaces/infra/redisService.interface.js";
import type { IEmailService } from "../interfaces/infra/emailService.interface.js";
import type { IPasswordHasher } from "../interfaces/infra/passwordService.interface.js";
import type { IJwtService } from "../interfaces/infra/jwtService.interface.js";
import { OTP_PREFIX, OtpPurpose } from "../constants/otp.constant.js";
import { config } from "../config/env.js";
import type { ForgotPasswordRequest, ForgotPasswordResponse, LoginData, LoginResponse, PaginatedUserDto, ResendOtpResponse, ResetPasswordData, ResetPasswordResponse, SignupUserData, SignUpUserResponse, VerifyOtpData, VerifyOtpResponse } from "../interfaces/DTO/services/userService.dto.js";
import type { CreateUser } from "../interfaces/DTO/repository/userRepository.dto.js";
import { Roles } from "../constants/roles.js";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject("IUserRepository") private _userRepository: IUserRepository,
    @inject("IOTPService") private _otpService: IOTPService,
    @inject("IRedisService") private _redisService: IRedisService,
    @inject("IEmailService") private _emailService: IEmailService,
    @inject("IPasswordHasher") private _passwordService: IPasswordHasher,
    @inject("IJwtService") private _jwtService: IJwtService
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

  async userSignUp(data: SignupUserData): Promise<SignUpUserResponse> {
    try {
      console.log(
        "entering to the usersignup function in the userauth service"
      );
      console.log("data:", data);

      const { email, password } = data;

      const existingUser = await this._userRepository.findByEmail(email);
      if (existingUser) {
        return {
          message: "User already exists, please login",
          success: false,
        };
      }

      const pendingUser = await this._redisService.getObject(
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

      const hashedPassword = await this._passwordService.hash(password);
      const otp = await this.generateAndSendOtp(email, OtpPurpose.REGISTRATION);

      console.log("Generated otp for new user registration:", otp);

      const userData = {
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
        const pendingUser = await this._redisService.getObject<CreateUser>(
          `pending_user:${email}`
        );

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

        const userData = { ...pendingUser, status: "Active" as const };

        const newUser = await this._userRepository.createUser(userData);

      

        const otpRedisKey = this.getOtpRedisKey(email, OtpPurpose.REGISTRATION);
        await this._redisService.delete(otpRedisKey);
        await this._redisService.delete(`pending_user:${email}`);

        return {
          message: "Email verified successfully! Please login to continue",
          success: true,
        };
      } else if (OtpPurpose.PASSWORD_RESET === purpose) {
        console.log("password resetting in the userAuthService");
        const user = await this._userRepository.findByEmail(email);
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

  async resendOtp(data: string): Promise<ResendOtpResponse> {
    try {
      console.log("entering resendotp function in the userservice");

      const user = await this._userRepository.findByEmail(data);

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

      const user = await this._userRepository.findByEmail(email);

      if (!user) {
        return {
          success: false,
          message: "User not found with this email",
        };
      }

      if (user.status !== "Active") {
        return {
          success: false,
          message: "Your account is blocked. Please contact support.",
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

      const user = await this._userRepository.findByEmail(email);
      console.log("userData in resetPassword:", user);

      if (!user) {
        return {
          success: false,
          message: "User not found with this email",
        };
      }

      if (user.status !== "Active") {
        return {
          success: false,
          message: "Your account is blocked. Please contact support.",
        };
      }

      const hashedPassword = await this._passwordService.hash(password);

      await this._userRepository.updatePassword(email, hashedPassword);

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

  async login(data: LoginData): Promise<LoginResponse> {
    try {
      console.log("entering to the login credentials verifying in service");
      const { email, password } = data;

      const user = await this._userRepository.findByEmail(email);
      console.log("user", user);

      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      if (user.status !== "Active") {
        return {
          success: false,
          message: "Your account has been blocked. Please contact support.",
        };
      }

      const isPasswordValid = await this._passwordService.verify(
        user.password,
        password
      );

      if (!isPasswordValid) {
        return {
          success: false,
          message: "Invalid password",
        };
      }

      const userId = String(user._id);
      console.log("userId from login:", userId);

      const access_token = this._jwtService.generateAccessToken(
        userId,
        Roles.USER
      );

      const refresh_token = this._jwtService.generateRefreshToken(
        userId,
        Roles.USER
      );

      return {
        success: true,
        message: "Login successful",
        access_token,
        refresh_token,
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
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

  async getAllUsers(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{
    success: boolean;
    message: string;
    data?: {
      users: PaginatedUserDto[];
      pagination: {
        total: number;
        page: number;
        pages: number;
        limit: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    };
  }> {
    try {
      console.log("Function fetching all the users");
  
      const repoOptions: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
      } = {};
  
      if (options.page !== undefined) repoOptions.page = options.page;
      if (options.limit !== undefined) repoOptions.limit = options.limit;
      if (options.search !== undefined) repoOptions.search = options.search;
      if (options.status !== undefined) repoOptions.status = options.status;
  
      const result = await this._userRepository.getAllUsers(repoOptions);
  
      console.log("result from the user service:", result);
  
      const users: PaginatedUserDto[] = result.data.map((user) => ({
        _id: user._id.toString(), 
        username: user.username,
        email: user.email,
        phone: user.phone,
        status: user.status,
      }));
  
      return {
        success: true,
        message: "Users fetched successfully",
        data: {
          users,
          pagination: {
            total: result.total,
            page: result.page,
            pages: result.pages,
            limit: result.limit,
            hasNextPage: result.page < result.pages,
            hasPrevPage: result.page > 1,
          },
        },
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      return {
        success: false,
        message: "Something went wrong while fetching users",
      };
    }
  }
  
  
}