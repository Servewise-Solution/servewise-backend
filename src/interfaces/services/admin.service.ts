import type { LoginData, LoginResponse } from "../DTO/services/adminService.dto.js";



export interface IAdminService {
  adminLogin(data: LoginData): Promise<LoginResponse>;
}