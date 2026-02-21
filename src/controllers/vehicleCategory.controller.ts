import { inject, injectable } from "tsyringe";
import type { Request, Response } from "express";

import type { IVehicleCategoryService } from "../interfaces/services/vehicleCategory.service.js";
import type { IVehicleTypeService } from "../interfaces/services/vehicleType.service.js";

import { HTTP_STATUS } from "../constants/http-status.js";
import {
  createErrorResponse,
  createSuccessResponse
} from "../utils/responseHelper.utils.js";
import { MESSAGES } from "../constants/messages.js";

@injectable()
export class VehicleController {
  constructor(
    @inject("IVehicleCategoryService")
    private _vehicleCategoryService: IVehicleCategoryService,

    @inject("IVehicleTypeService")
    private _vehicleTypeService: IVehicleTypeService
  ) {}

  // =====================================================
  // 🚗 VEHICLE CATEGORY
  // =====================================================

  async createVehicleCategory(req: Request, res: Response): Promise<void> {
    try {
      const serviceResponse =
        await this._vehicleCategoryService.createVehicleCategory(req.body);

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

  async updateVehicleCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(createErrorResponse("Invalid vehicle category id"));
        return;
      }

      const serviceResponse =
        await this._vehicleCategoryService.updateVehicleCategory(id, req.body);

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

  async deleteVehicleCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(createErrorResponse("Invalid vehicle category id"));
        return;
      }

      const serviceResponse =
        await this._vehicleCategoryService.deleteVehicleCategory(id);

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

  async getAllVehicleCategories(req: Request, res: Response): Promise<void> {
    try {
      const serviceResponse =
        await this._vehicleCategoryService.getAllVehicleCategories(req.query);

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
  // 🚙 VEHICLE TYPE
  // =====================================================

  async createVehicleType(req: Request, res: Response): Promise<void> {
    try {
      const serviceResponse =
        await this._vehicleTypeService.createVehicleType(req.body);

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

  async updateVehicleType(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(createErrorResponse("Invalid vehicle category id"));
        return;
      }

      const serviceResponse =
        await this._vehicleTypeService.updateVehicleType(id, req.body);

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

  async deleteVehicleType(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(createErrorResponse("Invalid vehicle category id"));
        return;
      }

      const serviceResponse =
        await this._vehicleTypeService.deleteVehicleType(id);

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

  async getAllVehicleTypes(req: Request, res: Response): Promise<void> {
    try {
      const serviceResponse =
        await this._vehicleTypeService.getAllVehicleTypes(req.query);

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
