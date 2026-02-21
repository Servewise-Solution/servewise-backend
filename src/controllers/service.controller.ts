import { inject, injectable } from "tsyringe";
import type { Request, Response } from "express";

import type { IServiceService } from "../interfaces/services/service.service.js";

import { HTTP_STATUS } from "../constants/http-status.js";
import {
  createErrorResponse,
  createSuccessResponse
} from "../utils/responseHelper.utils.js";
import { MESSAGES } from "../constants/messages.js";

@injectable()
export class ServiceController {
  constructor(
    @inject("IServiceService")
    private _serviceService: IServiceService
  ) {}

  // =====================================================
  // 🧩 CREATE MASTER SERVICE
  // =====================================================

  async createService(req: Request, res: Response): Promise<void> {
    try {
      const serviceResponse =
        await this._serviceService.createService(req.body);

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
  // 🧩 UPDATE MASTER SERVICE
  // =====================================================

  async updateService(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(createErrorResponse("Invalid service id"));
        return;
      }

      const serviceResponse =
        await this._serviceService.updateService(id, req.body);

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
  // 🧩 DELETE MASTER SERVICE (SOFT)
  // =====================================================

  async deleteService(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(createErrorResponse("Invalid service id"));
        return;
      }

      const serviceResponse =
        await this._serviceService.deleteService(id);

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
  // 🧩 GET ALL MASTER SERVICES
  // =====================================================

  async getAllServices(req: Request, res: Response): Promise<void> {
    try {
      const serviceResponse =
        await this._serviceService.getAllServices(req.query);

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
