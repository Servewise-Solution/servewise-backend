import type {
  IRegisterData,
  IRegisterResponse,
  VerifyOtpData,
  VerifyOtpResponse,
} from "../DTO/services/authService.dto.js";

export interface IAuthService {
  register(data: IRegisterData): Promise<IRegisterResponse>;
  verifyOtp(data: VerifyOtpData): Promise<VerifyOtpResponse>;
}
