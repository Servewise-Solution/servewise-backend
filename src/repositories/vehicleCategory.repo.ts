import { injectable } from "tsyringe";
import mongoose from "mongoose";
import { BaseRepository } from "./base.repository.js";
import { VehicleCategory } from "../models/vehicleCategory.model.js";
import type { IVehicleCategory } from "../interfaces/model/vehicleCategoryModel.interface.js";
import type {
  CreateVehicleCategoryDTO,
  UpdateVehicleCategoryDTO
} from "../interfaces/DTO/repository/vehicleCategoryRepository.dto.js";
import type { IVehicleCategoryRepository } from "../interfaces/repository/vehicleCategory.repo.js";

@injectable()
export class VehicleCategoryRepository
  extends BaseRepository<IVehicleCategory>
  implements IVehicleCategoryRepository
{
  constructor() {
    super(VehicleCategory);
  }

  //  CREATE
  async addVehicleCategory(
    data: CreateVehicleCategoryDTO
  ): Promise<IVehicleCategory> {
    try {
      const category = await this.create(data);
      if (!category) {
        throw new Error("Vehicle category creation failed");
      }
      return category;
    } catch (error) {
      console.error("Error creating vehicle category:", error);
      throw new Error("Failed to create vehicle category");
    }
  }

  //  UPDATE
  async editVehicleCategory(
    categoryId: string,
    updateData: UpdateVehicleCategoryDTO
  ): Promise<IVehicleCategory> {
    try {
      const updated = await this.updateOne(
        { _id: categoryId },
        updateData
      );

      if (!updated) {
        throw new Error("Vehicle category not found");
      }

      return updated;
    } catch (error) {
      console.error("Error updating vehicle category:", error);
      throw new Error("Failed to update vehicle category");
    }
  }

  //  SOFT DELETE
  async softDeleteVehicleCategory(
    categoryId: string
  ): Promise<IVehicleCategory> {
    try {
      const deleted = await this.updateOne(
        { _id: categoryId },
        { isActive: false }
      );

      if (!deleted) {
        throw new Error("Vehicle category not found");
      }

      return deleted;
    } catch (error) {
      console.error("Error soft deleting vehicle category:", error);
      throw new Error("Failed to delete vehicle category");
    }
  }

  //  GET ALL (SEARCH + PAGINATION + STATUS)
  async getAllCategories(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{
    data: IVehicleCategory[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    try {
      const { page, limit } = options;

      const filter: mongoose.QueryFilter<IVehicleCategory> = {};

      if (options.search) {
        filter.name = { $regex: options.search, $options: "i" };
      }

      if (options.status) {
        if (options.status === "active") {
          filter.isActive = true;
        } else if (options.status === "inactive") {
          filter.isActive = false;
        }
      }

      if (page && limit) {
        const result = (await this.find(filter, {
          pagination: { page, limit },
          sort: { "audit.createdAt": -1 }
        })) as { data: IVehicleCategory[]; total: number };

        return {
          data: result.data,
          total: result.total,
          page,
          limit,
          pages: Math.ceil(result.total / limit)
        };
      }

      const all = (await this.find(filter, {
        sort: { "audit.createdAt": -1 }
      })) as IVehicleCategory[];

      return {
        data: all,
        total: all.length,
        page: 1,
        limit: all.length,
        pages: 1
      };
    } catch (error) {
      console.error("Error fetching vehicle categories:", error);
      throw new Error("Failed to fetch vehicle categories");
    }
  }

  //  FIND BY ID
  async findById(id: string): Promise<IVehicleCategory | null> {
    try {
      return await super.findById(id);
    } catch (error) {
      console.error("Error finding vehicle category:", error);
      throw new Error("Failed to find vehicle category");
    }
  }
}
