
import type { ForgotPasswordRequest, ForgotPasswordResponse, LoginData, LoginResponse, PaginatedProviderDto, ResendOtpResponse, ResetPasswordData, ResetPasswordResponse, SignupProviderData, SignUpProviderResponse, ToggleProviderStatusResponse, VerifyOtpData, VerifyOtpResponse } from "../DTO/services/providerService.dto.js";


export interface IProviderService {
  providerSignUp(data: SignupProviderData): Promise<SignUpProviderResponse>
  verifyOtp(data: VerifyOtpData): Promise<VerifyOtpResponse>
  login(data: LoginData): Promise<LoginResponse>
  resendOtp(data: string): Promise<ResendOtpResponse>
  resetPassword(data: ResetPasswordData): Promise<ResetPasswordResponse>
  forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse>
  getAllProviders(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{
    success: boolean;
    message: string;
    data?: {
      users: PaginatedProviderDto[];
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
  toggleProviderStatus(userId: string): Promise<ToggleProviderStatusResponse>
}
