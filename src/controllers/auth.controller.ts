import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { IAuthService } from "../interfaces/services/auth.service.js";
import { HTTP_STATUS } from "../constants/http-status.js";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../utils/responseHelper.utils.js";
import { MESSAGES } from "../constants/messages.js";

@injectable()
export class AuthController {
  constructor(@inject("IAuthService") private _authService: IAuthService) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      console.log("entering to the register function in userController");
      const data = req.body;
      console.log("data:", data);

      const serviceResponse = await this._authService.register(data);
      console.log("response in register:", serviceResponse);

      if (serviceResponse.success) {
        res
          .status(HTTP_STATUS.CREATED)
          .json(
            createSuccessResponse(
              serviceResponse.data,
              serviceResponse.message || MESSAGES.REGISTRATION_SUCCESS
            )
          );
      } else {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(
            createErrorResponse(
              serviceResponse.message || MESSAGES.REGISTRATION_FAILED
            )
          );
      }
    } catch (error) {
      console.log("error occurred", error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse(MESSAGES.INTERNAL_SERVER_ERROR));
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      console.log("entering into the verify otp function in userController");
      const data = req.body;
      console.log("userData in verifyOtp controller:", data);

      const serviceResponse = await this._authService.verifyOtp(data);
      console.log("response in verifyOtp controller:", serviceResponse);

      if (serviceResponse.success) {
        res
          .status(HTTP_STATUS.OK)
          .json(createSuccessResponse(null, serviceResponse.message));
      } else {
        let statusCode: number;
        let message: string = serviceResponse.message || MESSAGES.OTP_INVALID;

        switch (true) {
          case serviceResponse.message?.includes("not found"):
            statusCode = HTTP_STATUS.NOT_FOUND;
            message = MESSAGES.USER_NOT_FOUND;
            break;
          case serviceResponse.message?.includes("expired"):
            statusCode = HTTP_STATUS.NOT_FOUND;
            message = MESSAGES.OTP_EXPIRED;
            break;
          case serviceResponse.message?.includes("Invalid OTP"):
            statusCode = HTTP_STATUS.UNAUTHORIZED;
            message = MESSAGES.OTP_INVALID;
            break;
          case serviceResponse.message?.includes("already verified"):
            statusCode = HTTP_STATUS.CONFLICT;
            message = "User already verified";
            break;
          default:
            statusCode = HTTP_STATUS.BAD_REQUEST;
            message = MESSAGES.OTP_INVALID;
        }
        res.status(statusCode).json(createErrorResponse(message));
      }
    } catch (error) {
      console.log("error occurred:", error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse(MESSAGES.INTERNAL_SERVER_ERROR));
    }
  }
}
