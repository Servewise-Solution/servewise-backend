import { inject, injectable } from "tsyringe";
import mongoose from "mongoose";

import type { IServiceService } from "../interfaces/services/service.service.js";
import type { IServiceRepository } from "../interfaces/repository/service.repository.js";
import type { IAuditRepository } from "../interfaces/repository/audit.repository.js";

@injectable()
export class ServiceService implements IServiceService {
  constructor(
    @inject("IServiceRepository")
    private _serviceRepo: IServiceRepository,

    @inject("IAuditRepository")
    private _auditRepo: IAuditRepository
  ) {}

  // ✅ CREATE MASTER SERVICE
  async createService(data: {
    vehicleCategoryId: string;
    vehicleTypeId: string;
    serviceCategoryId: string;
    serviceTypeId: string;
    name: string;
    description?: string;
    basePrice: number;
    isPriceFlexible?: boolean;
    estimatedDuration: number;
    adminId: string;
  }) {
    try {
      const audit = await this._auditRepo.createAudit({
        createdBy: new mongoose.Types.ObjectId(data.adminId),
        createdByRole: "ADMIN"
      });

      const payload: any = {
        vehicleCategoryId: new mongoose.Types.ObjectId(data.vehicleCategoryId),
        vehicleTypeId: new mongoose.Types.ObjectId(data.vehicleTypeId),
        serviceCategoryId: new mongoose.Types.ObjectId(data.serviceCategoryId),
        serviceTypeId: new mongoose.Types.ObjectId(data.serviceTypeId),
        name: data.name,
        basePrice: data.basePrice,
        estimatedDuration: data.estimatedDuration,
        audit
      };

      if (data.description !== undefined) payload.description = data.description;
      if (data.isPriceFlexible !== undefined)
        payload.isPriceFlexible = data.isPriceFlexible;

      await this._serviceRepo.addService(payload);

      return {
        success: true,
        message: "Service created successfully"
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to create service" };
    }
  }

  // ✅ UPDATE MASTER SERVICE
  async updateService(
    id: string,
    data: {
      vehicleCategoryId?: string;
      vehicleTypeId?: string;
      serviceCategoryId?: string;
      serviceTypeId?: string;
      name?: string;
      description?: string;
      basePrice?: number;
      isPriceFlexible?: boolean;
      estimatedDuration?: number;
      adminId: string;
    }
  ) {
    try {
      const audit = await this._auditRepo.createAudit({
        createdBy: new mongoose.Types.ObjectId(data.adminId),
        createdByRole: "ADMIN"
      });

      const payload: any = { audit };

      if (data.vehicleCategoryId)
        payload.vehicleCategoryId = new mongoose.Types.ObjectId(data.vehicleCategoryId);

      if (data.vehicleTypeId)
        payload.vehicleTypeId = new mongoose.Types.ObjectId(data.vehicleTypeId);

      if (data.serviceCategoryId)
        payload.serviceCategoryId = new mongoose.Types.ObjectId(data.serviceCategoryId);

      if (data.serviceTypeId)
        payload.serviceTypeId = new mongoose.Types.ObjectId(data.serviceTypeId);

      if (data.name !== undefined) payload.name = data.name;
      if (data.description !== undefined) payload.description = data.description;
      if (data.basePrice !== undefined) payload.basePrice = data.basePrice;
      if (data.isPriceFlexible !== undefined)
        payload.isPriceFlexible = data.isPriceFlexible;
      if (data.estimatedDuration !== undefined)
        payload.estimatedDuration = data.estimatedDuration;

      await this._serviceRepo.editService(id, payload);

      return {
        success: true,
        message: "Service updated successfully"
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to update service" };
    }
  }

  // ✅ SOFT DELETE
  async deleteService(id: string) {
    try {
      await this._serviceRepo.softDeleteService(id);

      return {
        success: true,
        message: "Service deleted successfully"
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to delete service" };
    }
  }

  // ✅ GET ALL
  async getAllServices(options: any) {
    try {
      const result = await this._serviceRepo.getAllServices(options);

      return {
        success: true,
        message: "Services fetched successfully",
        data: result
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to fetch services" };
    }
  }
}
