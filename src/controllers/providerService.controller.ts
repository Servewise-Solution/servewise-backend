import { inject, injectable } from "tsyringe";
import type { Request, Response } from "express";

import type { IProviderServiceService } from "../interfaces/services/providerService.service.js";

import { HTTP_STATUS } from "../constants/http-status.js";
import {
  createErrorResponse,
  createSuccessResponse
} from "../utils/responseHelper.utils.js";
import { MESSAGES } from "../constants/messages.js";

@injectable()
export class ProviderServiceController {
  constructor(
    @inject("IProviderServiceService")
    private _providerServiceService: IProviderServiceService
  ) {}

  // =====================================================
  // ⭐ PROVIDER SELECT SERVICE
  // =====================================================

  async createProviderService(req: Request, res: Response): Promise<void> {
    try {
      const serviceResponse =
        await this._providerServiceService.createProviderService(req.body);

      if (serviceResponse.success) {
        res.status(HTTP_STATUS.CREATED).json(
          createSuccessResponse(null, serviceResponse.message)
        );
      } else {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(createErrorResponse(serviceResponse.message));
      }
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse(MESSAGES.INTERNAL_SERVER_ERROR));
    }
  }

  // =====================================================
  // ⭐ PROVIDER UPDATE BEFORE APPROVAL
  // =====================================================

  async updateProviderService(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(createErrorResponse("Invalid provider service id"));
        return;
      }

      const serviceResponse =
        await this._providerServiceService.updateProviderService(id, req.body);

      if (serviceResponse.success) {
        res
          .status(HTTP_STATUS.OK)
          .json(createSuccessResponse(null, serviceResponse.message));
      } else {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(createErrorResponse(serviceResponse.message));
      }
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse(MESSAGES.INTERNAL_SERVER_ERROR));
    }
  }

  // =====================================================
  // ⭐ ADMIN APPROVE PROVIDER SERVICE
  // =====================================================

  async approveProviderService(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { finalPrice, adminId } = req.body;

      if (!id || typeof id !== "string") {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(createErrorResponse("Invalid provider service id"));
        return;
      }

      const serviceResponse =
        await this._providerServiceService.approveProviderService(
          id,
          finalPrice,
          adminId
        );

      if (serviceResponse.success) {
        res
          .status(HTTP_STATUS.OK)
          .json(createSuccessResponse(null, serviceResponse.message));
      } else {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(createErrorResponse(serviceResponse.message));
      }
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse(MESSAGES.INTERNAL_SERVER_ERROR));
    }
  }

  // =====================================================
  // ⭐ ADMIN REJECT PROVIDER SERVICE
  // =====================================================

  async rejectProviderService(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason, adminId } = req.body;

      if (!id || typeof id !== "string") {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(createErrorResponse("Invalid provider service id"));
        return;
      }

      const serviceResponse =
        await this._providerServiceService.rejectProviderService(
          id,
          reason,
          adminId
        );

      if (serviceResponse.success) {
        res
          .status(HTTP_STATUS.OK)
          .json(createSuccessResponse(null, serviceResponse.message));
      } else {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(createErrorResponse(serviceResponse.message));
      }
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse(MESSAGES.INTERNAL_SERVER_ERROR));
    }
  }

  // =====================================================
  // ⭐ SOFT DELETE
  // =====================================================

  async deleteProviderService(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(createErrorResponse("Invalid provider service id"));
        return;
      }

      const serviceResponse =
        await this._providerServiceService.deleteProviderService(id);

      if (serviceResponse.success) {
        res
          .status(HTTP_STATUS.OK)
          .json(createSuccessResponse(null, serviceResponse.message));
      } else {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(createErrorResponse(serviceResponse.message));
      }
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse(MESSAGES.INTERNAL_SERVER_ERROR));
    }
  }

  // =====================================================
  // ⭐ GET ALL PROVIDER SERVICES
  // =====================================================

  async getAllProviderServices(req: Request, res: Response): Promise<void> {
    try {
      const serviceResponse =
        await this._providerServiceService.getAllProviderServices(req.query);

      if (serviceResponse.success) {
        res.status(HTTP_STATUS.OK).json(
          createSuccessResponse(
            serviceResponse.data,
            serviceResponse.message
          )
        );
      } else {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(createErrorResponse(serviceResponse.message));
      }
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(createErrorResponse(MESSAGES.INTERNAL_SERVER_ERROR));
    }
  }
}
