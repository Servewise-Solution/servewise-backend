import { inject, injectable } from "tsyringe";
import mongoose from "mongoose";

import type { IVehicleTypeService } from "../interfaces/services/vehicleType.service.js";
import type { IVehicleTypeRepository } from "../interfaces/repository/vehicleType.repository.js";
import type { IAuditRepository } from "../interfaces/repository/audit.repository.js";

@injectable()
export class VehicleTypeService implements IVehicleTypeService {
  constructor(
    @inject("IVehicleTypeRepository")
    private _vehicleTypeRepo: IVehicleTypeRepository,

    @inject("IAuditRepository")
    private _auditRepo: IAuditRepository
  ) {}

  // ✅ CREATE VEHICLE TYPE
  async createVehicleType(data: {
    name: string;
    category: string;
    seatingCapacity?: number;
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

      if (data.seatingCapacity !== undefined) {
        payload.seatingCapacity = data.seatingCapacity;
      }

      await this._vehicleTypeRepo.addVehicleType(payload);

      return {
        success: true,
        message: "Vehicle type created successfully"
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to create vehicle type" };
    }
  }

  // ✅ UPDATE VEHICLE TYPE
  async updateVehicleType(
    id: string,
    data: {
      name?: string;
      category?: string;
      seatingCapacity?: number;
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
      if (data.category !== undefined)
        payload.category = new mongoose.Types.ObjectId(data.category);
      if (data.seatingCapacity !== undefined)
        payload.seatingCapacity = data.seatingCapacity;

      await this._vehicleTypeRepo.editVehicleType(id, payload);

      return {
        success: true,
        message: "Vehicle type updated successfully"
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to update vehicle type" };
    }
  }

  // ✅ SOFT DELETE
  async deleteVehicleType(id: string) {
    try {
      await this._vehicleTypeRepo.softDeleteVehicleType(id);

      return {
        success: true,
        message: "Vehicle type deleted successfully"
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to delete vehicle type" };
    }
  }

  // ✅ GET ALL
  async getAllVehicleTypes(options: any) {
    try {
      const result = await this._vehicleTypeRepo.getAllVehicleTypes(options);

      return {
        success: true,
        message: "Vehicle types fetched successfully",
        data: result
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to fetch vehicle types" };
    }
  }
}
