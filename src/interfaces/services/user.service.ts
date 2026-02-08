import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginData,
  LoginResponse,
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
}
