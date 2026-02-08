import { inject, injectable } from "tsyringe";
import type { IAdminService } from "../interfaces/services/admin.service.js";

import { Roles } from "../constants/roles.js";
import type { IPasswordHasher } from "../interfaces/infra/passwordService.interface.js";
import type { IJwtService } from "../interfaces/infra/jwtService.interface.js";
import type { IAdminRepository } from "../interfaces/repository/admin.repository.js";
import type { LoginData, LoginResponse } from "../interfaces/DTO/services/adminService.dto.js";


@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject("IAdminRepository") private _adminRepository: IAdminRepository,
    @inject("IPasswordHasher") private _passwordService: IPasswordHasher,
    @inject("IJwtService") private _jwtService: IJwtService
  ) {}

  async adminLogin(data: LoginData): Promise<LoginResponse> {
    try {
      console.log("entered into the adminLogin function in the admin Service");
      console.log("data in adminLogin service:", data);

      const { email, password } = data;

      const admin = await this._adminRepository.findByEmail(email);

      console.log("admin from the adminAuthService:", admin);

      if (!admin) {
        return {
          success: false,
          message: "admin not found",
        };
      }

      const isPasswordValid = await this._passwordService.verify(
        admin.password,
        password
      );
      if (!isPasswordValid) {
        return {
          success: false,
          message: "invalid Password",
        };
      }

      const adminId = String(admin._id);

      const access_token = await this._jwtService.generateAccessToken(
        adminId,
        Roles.ADMIN
      );
      console.log("admin access_token:", access_token);

      const refresh_token = await this._jwtService.generateRefreshToken(
        adminId,
        Roles.ADMIN
      );
      console.log("admin refresh_token:", refresh_token);

      return {
        success: true,
        message: "Login Successful",
        access_token,
        refresh_token,
        data: {
          _id: admin._id.toString(),
          email: admin.email,
          status: admin.status,
        },
      };
    } catch (error) {
      console.log("error occured while admin is logging in:", error);
      return {
        success: false,
        message: "error occured during the adminLogin",
      };
    }
  }
}