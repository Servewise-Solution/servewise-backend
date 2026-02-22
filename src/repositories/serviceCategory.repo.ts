import { injectable } from "tsyringe";
import mongoose from "mongoose";

import { BaseRepository } from "./base.repository.js";
import { ServiceCategory } from "../models/serviceCategory.model.js";

import type { IServiceCategory } from "../interfaces/model/serviceCategoryModel.interface.js";
import type { IServiceCategoryRepository } from "../interfaces/repository/serviceCategory.repository.js";
import type {
  CreateServiceCategoryDTO,
  UpdateServiceCategoryDTO
} from "../interfaces/DTO/repository/serviceCategoryRepository.dto.js";

@injectable()
export class ServiceCategoryRepository
  extends BaseRepository<IServiceCategory>
  implements IServiceCategoryRepository
{
  constructor() {
    super(ServiceCategory);
  }

  // CREATE
  async addServiceCategory(
    data: CreateServiceCategoryDTO
  ): Promise<IServiceCategory> {
    try {
      const category = await this.create(data);
      if (!category) {
        throw new Error("Service category creation failed");
      }
      return category;
    } catch (error) {
      console.error("Error creating service category:", error);
      throw new Error("Failed to create service category");
    }
  }

  //  UPDATE
  async editServiceCategory(
    categoryId: string,
    updateData: UpdateServiceCategoryDTO
  ): Promise<IServiceCategory> {
    try {
      const updated = await this.updateOne(
        { _id: categoryId },
        updateData
      );

      if (!updated) {
        throw new Error("Service category not found");
      }

      return updated;
    } catch (error) {
      console.error("Error updating service category:", error);
      throw new Error("Failed to update service category");
    }
  }

  // SOFT DELETE
  async softDeleteServiceCategory(
    categoryId: string
  ): Promise<IServiceCategory> {
    try {
      const deleted = await this.updateOne(
        { _id: categoryId },
        { isActive: false }
      );

      if (!deleted) {
        throw new Error("Service category not found");
      }

      return deleted;
    } catch (error) {
      console.error("Error soft deleting service category:", error);
      throw new Error("Failed to delete service category");
    }
  }

  //  GET ALL (SEARCH + PAGINATION + STATUS)
  async getAllServiceCategories(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{
    data: IServiceCategory[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    try {
      const { page, limit } = options;

      const filter: mongoose.QueryFilter<IServiceCategory> = {};

      if (options.search) {
        filter.name = { $regex: options.search, $options: "i" };
      }

      if (options.status) {
        if (options.status === "active") filter.isActive = true;
        if (options.status === "inactive") filter.isActive = false;
      }

      if (page && limit) {
        const result = (await this.find(filter, {
          pagination: { page, limit },
          sort: { "audit.createdAt": -1 }
        })) as { data: IServiceCategory[]; total: number };

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
      })) as IServiceCategory[];

      return {
        data: all,
        total: all.length,
        page: 1,
        limit: all.length,
        pages: 1
      };
    } catch (error) {
      console.error("Error fetching service categories:", error);
      throw new Error("Failed to fetch service categories");
    }
  }

  // FIND BY ID
  async findById(id: string): Promise<IServiceCategory | null> {
    try {
      return await super.findById(id);
    } catch (error) {
      console.error("Error finding service category:", error);
      throw new Error("Failed to find service category");
    }
  }
}
