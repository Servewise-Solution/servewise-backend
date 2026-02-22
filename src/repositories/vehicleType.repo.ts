import { injectable } from "tsyringe";
import mongoose from "mongoose";

import { BaseRepository } from "./base.repository.js";
import { VehicleType } from "../models/vehicleType.model.js";

import type { IVehicleType } from "../interfaces/model/vehicleTypeModel.interface.js";
import type { IVehicleTypeRepository } from "../interfaces/repository/vehicleType.repository.js";
import type {
  CreateVehicleTypeDTO,
  UpdateVehicleTypeDTO
} from "../interfaces/DTO/repository/vehicleTypeRepository.dto.js";

@injectable()
export class VehicleTypeRepository
  extends BaseRepository<IVehicleType>
  implements IVehicleTypeRepository
{
  constructor() {
    super(VehicleType);
  }

  //  CREATE
  async addVehicleType(
    data: CreateVehicleTypeDTO
  ): Promise<IVehicleType> {
    try {
      const vehicleType = await this.create(data);
      if (!vehicleType) {
        throw new Error("Vehicle type creation failed");
      }
      return vehicleType;
    } catch (error) {
      console.error("Error creating vehicle type:", error);
      throw new Error("Failed to create vehicle type");
    }
  }

  //  UPDATE
  async editVehicleType(
    vehicleTypeId: string,
    updateData: UpdateVehicleTypeDTO
  ): Promise<IVehicleType> {
    try {
      const updated = await this.updateOne(
        { _id: vehicleTypeId },
        updateData
      );

      if (!updated) {
        throw new Error("Vehicle type not found");
      }

      return updated;
    } catch (error) {
      console.error("Error updating vehicle type:", error);
      throw new Error("Failed to update vehicle type");
    }
  }

  //  SOFT DELETE
  async softDeleteVehicleType(
    vehicleTypeId: string
  ): Promise<IVehicleType> {
    try {
      const deleted = await this.updateOne(
        { _id: vehicleTypeId },
        { isActive: false }
      );

      if (!deleted) {
        throw new Error("Vehicle type not found");
      }

      return deleted;
    } catch (error) {
      console.error("Error soft deleting vehicle type:", error);
      throw new Error("Failed to delete vehicle type");
    }
  }

  //  GET ALL (SEARCH + PAGINATION + STATUS + CATEGORY FILTER)
  async getAllVehicleTypes(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    categoryId?: string;
  }): Promise<{
    data: IVehicleType[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    try {
      const { page, limit } = options;

      const filter: mongoose.QueryFilter<IVehicleType> = {};

      if (options.search) {
        filter.name = { $regex: options.search, $options: "i" };
      }

      if (options.status) {
        if (options.status === "active") filter.isActive = true;
        if (options.status === "inactive") filter.isActive = false;
      }

      if (options.categoryId) {
        filter.category = new mongoose.Types.ObjectId(options.categoryId);
      }

      if (page && limit) {
        const result = (await this.find(filter, {
          pagination: { page, limit },
          sort: { "audit.createdAt": -1 },
          populate: {
            path: "category",
            select: "name"
          }
        })) as { data: IVehicleType[]; total: number };

        return {
          data: result.data,
          total: result.total,
          page,
          limit,
          pages: Math.ceil(result.total / limit)
        };
      }

      const all = (await this.find(filter, {
        sort: { "audit.createdAt": -1 },
        populate: {
          path: "category",
          select: "name"
        }
      })) as IVehicleType[];

      return {
        data: all,
        total: all.length,
        page: 1,
        limit: all.length,
        pages: 1
      };
    } catch (error) {
      console.error("Error fetching vehicle types:", error);
      throw new Error("Failed to fetch vehicle types");
    }
  }

  //  FIND BY ID
  async findById(id: string): Promise<IVehicleType | null> {
    try {
      return await super.findById(id, {
        populate: {
          path: "category",
          select: "name"
        }
      });
    } catch (error) {
      console.error("Error finding vehicle type:", error);
      throw new Error("Failed to find vehicle type");
    }
  }
}
