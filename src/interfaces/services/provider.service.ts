
import type { ForgotPasswordRequest, ForgotPasswordResponse, IApplicantResponse, LoginData, LoginResponse, PaginatedProviderDto, ResendOtpResponse, ResetPasswordData, ResetPasswordResponse, SignupProviderData, SignUpProviderResponse, ToggleProviderStatusResponse, VerifyOtpData, VerifyOtpResponse } from "../DTO/services/providerService.dto.js";
import type { IProvider } from "../model/providerModel.interface.js";


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
  saveProviderVerificationDetails(
    providerId: string,
    data: Partial<IProvider>
  ): Promise<{
    success: boolean;
    message: string;
    data?: {
      isVerified?: boolean;
      status?: string;
    };
  }>
  toggleProviderStatus(userId: string): Promise<ToggleProviderStatusResponse>
  getAllApplicants(options: { page?: number; limit?: number }): Promise<{
    success: boolean;
    message: string;
    data?: {
      users: IApplicantResponse[];
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
  acceptProvider(
    providerId: string
  ): Promise<{ success: boolean; message: string }>
  rejectProvider(
    providerId: string,
    rejectReason: string
  ): Promise<{ success: boolean; message: string }>
}
