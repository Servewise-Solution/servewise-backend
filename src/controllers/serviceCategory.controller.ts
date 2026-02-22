import { inject, injectable } from "tsyringe";
import type { Request, Response } from "express";

import type { IServiceCategoryService } from "../interfaces/services/serviceCategory.service.js";
import type { IServiceTypeService } from "../interfaces/services/serviceType.service.js";

import { HTTP_STATUS } from "../constants/http-status.js";
import {
  createErrorResponse,
  createSuccessResponse
} from "../utils/responseHelper.utils.js";
import { MESSAGES } from "../constants/messages.js";

@injectable()
export class ServiceController {
  constructor(
    @inject("IServiceCategoryService")
    private _serviceCategoryService: IServiceCategoryService,

    @inject("IServiceTypeService")
    private _serviceTypeService: IServiceTypeService
  ) {}

  // =====================================================
  // 🧩 SERVICE CATEGORY
  // =====================================================

  async createServiceCategory(req: Request, res: Response): Promise<void> {
    try {
      const serviceResponse =
        await this._serviceCategoryService.createServiceCategory(req.body);

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

  async updateServiceCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(createErrorResponse("Invalid service category id"));
        return;
      }

      const serviceResponse =
        await this._serviceCategoryService.updateServiceCategory(id, req.body);

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

  async deleteServiceCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(createErrorResponse("Invalid service category id"));
        return;
      }

      const serviceResponse =
        await this._serviceCategoryService.deleteServiceCategory(id);

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

  async getAllServiceCategories(req: Request, res: Response): Promise<void> {
    try {
      const serviceResponse =
        await this._serviceCategoryService.getAllServiceCategories(req.query);

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

  // =====================================================
  // 🛠 SERVICE TYPE
  // =====================================================

  async createServiceType(req: Request, res: Response): Promise<void> {
    try {
      const serviceResponse =
        await this._serviceTypeService.createServiceType(req.body);

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

  async updateServiceType(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(createErrorResponse("Invalid service type id"));
        return;
      }

      const serviceResponse =
        await this._serviceTypeService.updateServiceType(id, req.body);

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

  async deleteServiceType(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(createErrorResponse("Invalid service type id"));
        return;
      }

      const serviceResponse =
        await this._serviceTypeService.deleteServiceType(id);

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

  async getAllServiceTypes(req: Request, res: Response): Promise<void> {
    try {
      const serviceResponse =
        await this._serviceTypeService.getAllServiceTypes(req.query);

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
