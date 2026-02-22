import { inject, injectable } from "tsyringe";
import type { IUserService } from "../interfaces/services/user.service.js";
import type { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/http-status.js";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../utils/responseHelper.utils.js";
import { MESSAGES } from "../constants/messages.js";
import { config } from "../config/env.js";
import type { IProviderService } from "../interfaces/services/provider.service.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

@injectable()
export class ProviderController {
  constructor(@inject("IProviderService") private _providerService: IProviderService) {}
  async register(req: Request, res: Response): Promise<void> {
    try {
      console.log("entering to the register function in userController");
      const data = req.body;
      console.log("data:", data);

      const serviceResponse = await this._providerService.providerSignUp(data);
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

      const serviceResponse = await this._providerService.verifyOtp(data);
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

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const serviceResponse = await this._providerService.resendOtp(email);

      if (serviceResponse.success) {
        res
          .status(HTTP_STATUS.OK)
          .json(
            createSuccessResponse(
              { email: serviceResponse.email },
              serviceResponse.message
            )
          );
      } else {
        let statusCode: number;
        let message: string = serviceResponse.message || "Failed to resend OTP";

        if (serviceResponse.message?.includes("not found")) {
          statusCode = HTTP_STATUS.NOT_FOUND;
          message = MESSAGES.USER_NOT_FOUND;
        } else {
          statusCode = HTTP_STATUS.BAD_REQUEST;
        }

        res.status(statusCode).json(createErrorResponse(message));
      }
    } catch (error) {
      console.log("error in the resendOtp controller", error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse(MESSAGES.INTERNAL_SERVER_ERROR));
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const serviceResponse = await this._providerService.forgotPassword({ email });

      if (serviceResponse.success) {
        res
          .status(HTTP_STATUS.OK)
          .json(
            createSuccessResponse(
              { email: serviceResponse.email },
              serviceResponse.message
            )
          );
      } else {
        const statusCode = serviceResponse.message?.includes("not found")
          ? HTTP_STATUS.NOT_FOUND
          : serviceResponse.message?.includes("blocked") ||
            serviceResponse.message?.includes("verify your email")
          ? HTTP_STATUS.FORBIDDEN
          : HTTP_STATUS.BAD_REQUEST;

        const message = serviceResponse.message?.includes("not found")
          ? MESSAGES.USER_NOT_FOUND
          : serviceResponse.message || "Failed to send reset email";

        res.status(statusCode).json(createErrorResponse(message));
      }
    } catch (error) {
      console.log("error occured:", error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse(MESSAGES.INTERNAL_SERVER_ERROR));
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      console.log("Entering resetPassword function in userController");
      const { email, password } = req.body;

      const serviceResponse = await this._providerService.resetPassword({
        email,
        password,
      });
      console.log("Response from resetPassword service:", serviceResponse);

      if (serviceResponse.success) {
        res
          .status(HTTP_STATUS.OK)
          .json(createSuccessResponse(null, serviceResponse.message));
      } else {
        const statusCode = serviceResponse.message?.includes("not found")
          ? HTTP_STATUS.NOT_FOUND
          : serviceResponse.message?.includes("verify your email")
          ? HTTP_STATUS.FORBIDDEN
          : serviceResponse.message?.includes("blocked")
          ? HTTP_STATUS.FORBIDDEN
          : HTTP_STATUS.BAD_REQUEST;
        res
          .status(statusCode)
          .json(
            createErrorResponse(
              serviceResponse.message || "Failed to reset password"
            )
          );
      }
    } catch (error) {
      console.log("Error in resetPassword controller:", error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse("Internal Server Error"));
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      console.log("entering the user login function in usercontroller");
      const data = req.body;

      const serviceResponse = await this._providerService.login(data);
      console.log("response from the login controller", serviceResponse);

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
              user: serviceResponse.data,
              access_token: serviceResponse.access_token,
            },
            serviceResponse.message
          )
        );
      } else {
        const statusCode = serviceResponse.message?.includes("not found")
          ? HTTP_STATUS.NOT_FOUND
          : serviceResponse.message?.includes("Invalid password")
          ? HTTP_STATUS.UNAUTHORIZED
          : serviceResponse.message?.includes("verify your email")
          ? HTTP_STATUS.FORBIDDEN
          : serviceResponse.message?.includes("blocked")
          ? HTTP_STATUS.FORBIDDEN
          : HTTP_STATUS.BAD_REQUEST;

        res
          .status(statusCode)
          .json(createErrorResponse(serviceResponse.message || "Login failed"));
      }
    } catch (error) {
      console.log("error:", error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse("Internal server error"));
    }
  }

  async getAllProviders(req: Request, res: Response): Promise<void> {
    try {
      console.log("function fetching all the users");

      const repoOptions: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
      } = {};

      if (req.query.page !== undefined) {
        repoOptions.page = parseInt(req.query.page as string, 10);
      }

      if (req.query.limit !== undefined) {
        repoOptions.limit = parseInt(req.query.limit as string, 10);
      }

      if (req.query.search !== undefined) {
        repoOptions.search = req.query.search as string;
      }

      if (req.query.status !== undefined) {
        repoOptions.status = req.query.status as string;
      }

      console.log("repoOptions",repoOptions)

      const serviceResponse = await this._providerService.getAllProviders(repoOptions);

      console.log(
        "result from the fetching all users controller:",
        serviceResponse
      );

      if (serviceResponse.success) {
        res
          .status(HTTP_STATUS.OK)
          .json(
            createSuccessResponse(serviceResponse.data, serviceResponse.message)
          );
      } else {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(
            createErrorResponse(
              serviceResponse.message || "Failed to fetch users"
            )
          );
      }
    } catch (error) {
      console.error("Error in getAllUsers controller:", error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse("Error fetching users"));
    }
  }

  async toggleProviderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      if (typeof userId !== "string") {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(createErrorResponse("Invalid user ID"));
        return;
      }

      const serviceResponse = await this._providerService.toggleProviderStatus(userId);

      if (serviceResponse.success) {
        res
          .status(HTTP_STATUS.OK)
          .json(
            createSuccessResponse(serviceResponse.data, serviceResponse.message)
          );
      } else {
        const statusCode = serviceResponse.message?.includes("not found")
          ? HTTP_STATUS.NOT_FOUND
          : HTTP_STATUS.BAD_REQUEST;
        res
          .status(statusCode)
          .json(
            createErrorResponse(
              serviceResponse.message || "Failed to toggle user status"
            )
          );
      }
    } catch (error) {
      console.error("Error in toggleUserStatus controller:", error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse("Internal server error"));
    }
  }
 
  async submitProviderDocuments(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const providerId = req.user?.id;
  
      if (!providerId) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized: Provider ID missing in token",
        });
        return;
      }
  
      const data = { ...req.body };
      console.log("data",data)

      // ✅ convert schedule string → object
      if (data.schedule && typeof data.schedule === "string") {
        data.schedule = JSON.parse(data.schedule);
      }
  
      let premiseImageUrl: string | undefined;
      let companyLicenseUrl: string | undefined;
      let ownerImageUrl: string | undefined;
  
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
  
      if (files?.premiseImage?.[0]) {
        premiseImageUrl = await uploadToCloudinary(
          files.premiseImage[0].path
        );
      }
  
      if (files?.companyLicense?.[0]) {
        companyLicenseUrl = await uploadToCloudinary(
          files.companyLicense[0].path
        );
      }
      if (files?.ownerImage?.[0]) {
        ownerImageUrl = await uploadToCloudinary(
          files.ownerImage[0].path
        );
      }
  
      const result =
        await this._providerService.saveProviderVerificationDetails(
          providerId,
          {
            ...data,
            premiseImage: premiseImageUrl,
            companyLicense: companyLicenseUrl,
            ownerImage: ownerImageUrl
          }
        );
  
      res.status(HTTP_STATUS.OK).json({
        success: result.success,
        message: result.message,
        data: result.data,
      });
    } catch (err: unknown) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: err || "Failed to submit provider documents",
      });
    }
  }
  
  async getAllApplicants(req: Request, res: Response): Promise<void> {
    try {
      console.log("entered into get applications list");
  
      const page = req.query.page
        ? parseInt(req.query.page as string)
        : undefined;
  
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : undefined;
  
      const options: { page?: number; limit?: number } = {};
  
      if (page !== undefined) options.page = page;
      if (limit !== undefined) options.limit = limit;
  
      const serviceResponse =
        await this._providerService.getAllApplicants(options);
  
      if (serviceResponse.success) {
        res
          .status(HTTP_STATUS.OK)
          .json(
            createSuccessResponse(serviceResponse.data, serviceResponse.message)
          );
      } else {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(
            createErrorResponse(
              serviceResponse.message || "Failed to fetch users"
            )
          );
      }
    } catch (error) {
      console.error(error);
  
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse("Internal server error"));
    }
  }

  async acceptProvider(req: Request, res: Response): Promise<void> {
    try {
      console.log("Entered provider accept controller");
  
      const providerId = req.params.providerId;
  
      if (!providerId || Array.isArray(providerId)) {
        res.status(400).json({
          success: false,
          message: "Invalid provider id",
        });
        return;
      }
  
      const result =
        await this._providerService.acceptProvider(providerId);
  
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      console.error("Error occurred while accepting provider:", error);
  
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to accept provider",
      });
    }
  }
  

  async rejectProvider(req: Request, res: Response): Promise<void> {
    try {
      console.log("Entered provider reject controller");
  
      const providerId = req.params.providerId;
      const rejectReason = req.body.rejectReason;
  
      if (!providerId || Array.isArray(providerId)) {
        res.status(400).json({
          success: false,
          message: "Invalid provider id",
        });
        return;
      }
  
      if (!rejectReason || typeof rejectReason !== "string") {
        res.status(400).json({
          success: false,
          message: "Reject reason required",
        });
        return;
      }
  
      const result =
        await this._providerService.rejectProvider(
          providerId,
          rejectReason
        );
  
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      console.error("Error occurred while rejecting provider:", error);
  
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to reject provider",
      });
    }
  }
  
  
  
  

  async logout(req: Request, res: Response): Promise<void> {
    try {
      console.log("entering the logout function from the user controller");
      res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res
        .status(HTTP_STATUS.OK)
        .json(createSuccessResponse(null, "Logged out successfully"));
    } catch (error) {
      console.log("error occured while user logging out:", error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse("Internal server error occurred"));
    }
  }
  
}
