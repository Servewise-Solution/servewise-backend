import { injectable, inject } from "tsyringe";
import type { IAuthService } from "../interfaces/services/auth.service.js";
import type { IJwtService } from "../interfaces/infra/jwtService.interface.js";
import type { IOTPService } from "../interfaces/infra/otpService.interface.js";
import type {
  IRegisterData,
  IRegisterResponse,
} from "../interfaces/DTO/services/authService.dto.js";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject("IJwtService") private _jwtService: IJwtService,
    @inject("IOTPService") private _otpService: IOTPService,
  ) {}

  async register(data: IRegisterData): Promise<IRegisterResponse> {
    try {
        
    } catch (error) {}
  }
}
