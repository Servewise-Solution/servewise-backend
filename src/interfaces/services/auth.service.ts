import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  IRegisterData,
  IRegisterResponse,
  LoginData,
  LoginResponse,
  ResendOtpResponse,
  ResetPasswordData,
  ResetPasswordResponse,
  VerifyOtpData,
  VerifyOtpResponse,
} from "../DTO/services/authService.dto.js";

export interface IAuthService {
  register(data: IRegisterData): Promise<IRegisterResponse>;
  verifyOtp(data: VerifyOtpData): Promise<VerifyOtpResponse>;
  login(data: LoginData): Promise<LoginResponse>
  resendOtp(data: string): Promise<ResendOtpResponse>
  resetPassword(data: ResetPasswordData): Promise<ResetPasswordResponse>
  forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse>
}
