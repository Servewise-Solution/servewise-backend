import type {
  IRegisterData,
  IRegisterResponse,
} from "../DTO/services/authService.dto.js";

export interface IAuthService {
  register(data: IRegisterData): Promise<IRegisterResponse>;
}
