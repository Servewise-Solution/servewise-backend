import { inject, injectable } from "tsyringe";
import mongoose from "mongoose";

import type { IVehicleCategoryService } from "../interfaces/services/vehicleCategory.service.js";
import type { IAuditRepository } from "../interfaces/repository/audit.repository.js";
import type { IVehicleCategoryRepository } from "../interfaces/repository/vehicleCategory.repo.js";

@injectable()
export class VehicleCategoryService implements IVehicleCategoryService {
  constructor(
    @inject("IVehicleCategoryRepository")
    private _vehicleCategoryRepo: IVehicleCategoryRepository,

    @inject("IAuditRepository")
    private _auditRepo: IAuditRepository
  ) {}

  // ✅ CREATE
  async createVehicleCategory(data: {
    name: string;
    description?: string;
    image?: string;
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

      if (data.description !== undefined) payload.description = data.description;
      if (data.image !== undefined) payload.image = data.image;

      await this._vehicleCategoryRepo.addVehicleCategory(payload);

      return {
        success: true,
        message: "Vehicle category created successfully"
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to create vehicle category" };
    }
  }

  // ✅ UPDATE
  async updateVehicleCategory(
    id: string,
    data: {
      name?: string;
      description?: string;
      image?: string;
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
      if (data.image !== undefined) payload.image = data.image;

      await this._vehicleCategoryRepo.editVehicleCategory(id, payload);

      return { success: true, message: "Vehicle category updated" };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Update failed" };
    }
  }

  // ✅ DELETE
  async deleteVehicleCategory(id: string) {
    try {
      await this._vehicleCategoryRepo.softDeleteVehicleCategory(id);
      return { success: true, message: "Vehicle category deleted" };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Delete failed" };
    }
  }

  // ✅ GET ALL
  async getAllVehicleCategories(options: any) {
    try {
      const result =
        await this._vehicleCategoryRepo.getAllCategories(options);

      return {
        success: true,
        message: "Vehicle categories fetched",
        data: result
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Fetch failed" };
    }
  }
}
