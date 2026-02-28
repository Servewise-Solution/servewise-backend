import { inject, injectable } from "tsyringe";
import type { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/http-status.js";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../utils/responseHelper.utils.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import type { IApplicantsService } from "../interfaces/services/applicants.service.js";

@injectable()
export class ApplicantsController {
  constructor(
    @inject("IApplicantsService") private _applicantService:IApplicantsService
  ) {}

  // ================================
  // Submit provider verification docs
  // ================================
  async submitProviderDocuments(
    req: AuthenticatedRequest,
    res: Response,
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

      if (data.schedule && typeof data.schedule === "string") {
        data.schedule = JSON.parse(data.schedule);
      }

      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      const result =
        await this._applicantService.saveProviderVerificationDetails(
          providerId,
          data,
          files,
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

  // ================================
  // Get all applicants
  // ================================
  async getAllApplicants(req: Request, res: Response): Promise<void> {
    try {
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
        await this._applicantService.getAllApplicants(options);

      if (serviceResponse.success) {
        res.status(HTTP_STATUS.OK).json(
          createSuccessResponse(
            serviceResponse.data,
            serviceResponse.message,
          ),
        );
      } else {
        res.status(HTTP_STATUS.BAD_REQUEST).json(
          createErrorResponse(
            serviceResponse.message || "Failed to fetch applicants",
          ),
        );
      }
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse("Internal server error"));
    }
  }

  // ================================
  // Accept provider
  // ================================
  async acceptProvider(req: Request, res: Response): Promise<void> {
    try {
      const providerId = req.params.providerId;

      if (!providerId || Array.isArray(providerId)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Invalid provider id",
        });
        return;
      }

      const result = await this._applicantService.acceptProvider(providerId);

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      console.error("Error occurred while accepting provider:", error);

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to accept provider",
      });
    }
  }

  // ================================
  // Reject provider
  // ================================
  async rejectProvider(req: Request, res: Response): Promise<void> {
    try {
      const providerId = req.params.providerId;
      const rejectReason = req.body.rejectReason;

      if (!providerId || Array.isArray(providerId)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Invalid provider id",
        });
        return;
      }

      if (!rejectReason || typeof rejectReason !== "string") {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Reject reason required",
        });
        return;
      }

      const result = await this._applicantService.rejectProvider(
        providerId,
        rejectReason,
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
}