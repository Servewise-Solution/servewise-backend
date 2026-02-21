import { inject, injectable } from "tsyringe";
import mongoose from "mongoose";

import type { IServiceTypeService } from "../interfaces/services/serviceType.service.js";
import type { IServiceTypeRepository } from "../interfaces/repository/serviceType.repository.js";
import type { IAuditRepository } from "../interfaces/repository/audit.repository.js";

@injectable()
export class ServiceTypeService implements IServiceTypeService {
  constructor(
    @inject("IServiceTypeRepository")
    private _serviceTypeRepo: IServiceTypeRepository,

    @inject("IAuditRepository")
    private _auditRepo: IAuditRepository
  ) {}

  // ✅ CREATE SERVICE TYPE
  async createServiceType(data: {
    name: string;
    category: string;
    description?: string;
    adminId: string;
  }) {
    try {
      const audit = await this._auditRepo.createAudit({
        createdBy: new mongoose.Types.ObjectId(data.adminId),
        createdByRole: "ADMIN"
      });

      const payload: any = {
        name: data.name,
        category: new mongoose.Types.ObjectId(data.category),
        audit
      };

      if (data.description !== undefined) {
        payload.description = data.description;
      }

      await this._serviceTypeRepo.addServiceType(payload);

      return {
        success: true,
        message: "Service type created successfully"
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to create service type" };
    }
  }

  // ✅ UPDATE SERVICE TYPE
  async updateServiceType(
    id: string,
    data: {
      name?: string;
      category?: string;
      description?: string;
      adminId: string;
    }
  ) {
    try {
      const audit = await this._auditRepo.createAudit({
        createdBy: new mongoose.Types.ObjectId(data.adminId),
        createdByRole: "ADMIN"
      });

      const payload: any = { audit };

      if (data.name !== undefined) payload.name = data.name;

      if (data.category !== undefined) {
        payload.category = new mongoose.Types.ObjectId(data.category);
      }

      if (data.description !== undefined) {
        payload.description = data.description;
      }

      await this._serviceTypeRepo.editServiceType(id, payload);

      return {
        success: true,
        message: "Service type updated successfully"
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to update service type" };
    }
  }

  // ✅ SOFT DELETE
  async deleteServiceType(id: string) {
    try {
      await this._serviceTypeRepo.softDeleteServiceType(id);

      return {
        success: true,
        message: "Service type deleted successfully"
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to delete service type" };
    }
  }

  // ✅ GET ALL
  async getAllServiceTypes(options: any) {
    try {
      const result = await this._serviceTypeRepo.getAllServiceTypes(options);

      return {
        success: true,
        message: "Service types fetched successfully",
        data: result
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to fetch service types" };
    }
  }
}
