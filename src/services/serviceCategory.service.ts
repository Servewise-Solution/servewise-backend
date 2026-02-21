import { inject, injectable } from "tsyringe";
import mongoose from "mongoose";

import type { IServiceCategoryService } from "../interfaces/services/serviceCategory.service.js";
import type { IServiceCategoryRepository } from "../interfaces/repository/serviceCategory.repository.js";
import type { IAuditRepository } from "../interfaces/repository/audit.repository.js";

@injectable()
export class ServiceCategoryService implements IServiceCategoryService {
  constructor(
    @inject("IServiceCategoryRepository")
    private _serviceCategoryRepo: IServiceCategoryRepository,

    @inject("IAuditRepository")
    private _auditRepo: IAuditRepository
  ) {}

  // ✅ CREATE SERVICE CATEGORY
  async createServiceCategory(data: {
    name: string;
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
        audit
      };

      if (data.description !== undefined) {
        payload.description = data.description;
      }

      await this._serviceCategoryRepo.addServiceCategory(payload);

      return {
        success: true,
        message: "Service category created successfully"
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to create service category" };
    }
  }

  // ✅ UPDATE SERVICE CATEGORY
  async updateServiceCategory(
    id: string,
    data: {
      name?: string;
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
      if (data.description !== undefined) payload.description = data.description;

      await this._serviceCategoryRepo.editServiceCategory(id, payload);

      return {
        success: true,
        message: "Service category updated successfully"
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to update service category" };
    }
  }

  // ✅ SOFT DELETE
  async deleteServiceCategory(id: string) {
    try {
      await this._serviceCategoryRepo.softDeleteServiceCategory(id);

      return {
        success: true,
        message: "Service category deleted successfully"
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to delete service category" };
    }
  }

  // ✅ GET ALL
  async getAllServiceCategories(options: any) {
    try {
      const result =
        await this._serviceCategoryRepo.getAllServiceCategories(options);

      return {
        success: true,
        message: "Service categories fetched successfully",
        data: result
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to fetch service categories" };
    }
  }
}
