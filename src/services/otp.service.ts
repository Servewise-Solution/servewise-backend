import type { IOTPService } from "../interfaces/infra/otp.interface.js";

export class OTPService implements IOTPService {
  generateOtp(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}
