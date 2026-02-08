import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginData,
  LoginResponse,
  PaginatedUserDto,
  ResendOtpResponse,
  ResetPasswordData,
  ResetPasswordResponse,
  SignupUserData,
  SignUpUserResponse,
  VerifyOtpData,
  VerifyOtpResponse,
} from "../DTO/services/userService.dto.js";

export interface IUserService {
  userSignUp(data: SignupUserData): Promise<SignUpUserResponse>
  verifyOtp(data: VerifyOtpData): Promise<VerifyOtpResponse>
  login(data: LoginData): Promise<LoginResponse>
  resendOtp(data: string): Promise<ResendOtpResponse>
  resetPassword(data: ResetPasswordData): Promise<ResetPasswordResponse>
  forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse>
  getAllUsers(options: {
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
  }>
}
