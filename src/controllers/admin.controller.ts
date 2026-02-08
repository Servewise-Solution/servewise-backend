
import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { IUserService } from "../interfaces/services/user.service.js";
import type { IAdminService } from "../interfaces/services/admin.service.js";
import { config } from "../config/env.js";
import { HTTP_STATUS } from "../constants/http-status.js";
import { createErrorResponse, createSuccessResponse } from "../utils/responseHelper.utils.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

@injectable()
export class AdminController {
  constructor(
    @inject("IUserService")
    private _userService: IUserService,
    @inject("IAdminService")
    private _adminService: IAdminService,
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      console.log("entering to the admin controller function for admin login");
      const data = req.body;
      console.log("data:", data);

      const serviceResponse = await this._adminService.adminLogin(data);
      console.log("response from the admin login controller:", serviceResponse);

      if (serviceResponse.success) {
        res.cookie("refresh_token", serviceResponse.refresh_token, {
          httpOnly: true,
          secure: config.NODE_ENV === "production",
          sameSite:
            config.NODE_ENV === "production"
              ? ("strict" as const)
              : ("lax" as const),
          maxAge: config.REFRESH_TOKEN_COOKIE_MAX_AGE,
        });

        res.status(HTTP_STATUS.OK).json(
          createSuccessResponse(
            {
              admin: serviceResponse.data,
              access_token: serviceResponse.access_token,
            },
            serviceResponse.message
          )
        );
      } else {
        const statusCode = serviceResponse.message?.includes("not found")
          ? HTTP_STATUS.NOT_FOUND
          : serviceResponse.message?.includes("invalid")
          ? HTTP_STATUS.UNAUTHORIZED
          : HTTP_STATUS.BAD_REQUEST;

        res
          .status(statusCode)
          .json(createErrorResponse(serviceResponse.message || "Login failed"));
      }
    } catch (error) {
      console.log("error occurred while logging the admin:", error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse("Internal Server Error"));
    }
  }
  async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      console.log("entering the logout function from the admin controller");

      res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      res
        .status(HTTP_STATUS.OK)
        .json(createSuccessResponse(null, "Logged out successfully"));
    } catch (error) {
      console.log("error occurred while admin logging out:", error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse("Internal server error occurred"));
    }
  }
}