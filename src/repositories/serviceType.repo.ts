import { injectable } from "tsyringe";
import mongoose from "mongoose";

import { BaseRepository } from "./base.repository.js";
import { ServiceType } from "../models/serviceType.model.js";

import type { IServiceType } from "../interfaces/model/serviceTypeModel.interface.js";
import type { IServiceTypeRepository } from "../interfaces/repository/serviceType.repository.js";
import type {
  CreateServiceTypeDTO,
  UpdateServiceTypeDTO
} from "../interfaces/DTO/repository/serviceTypeRepository.dto.js";

@injectable()
export class ServiceTypeRepository
  extends BaseRepository<IServiceType>
  implements IServiceTypeRepository
{
  constructor() {
    super(ServiceType);
  }

  //  CREATE
  async addServiceType(
    data: CreateServiceTypeDTO
  ): Promise<IServiceType> {
    try {
      const serviceType = await this.create(data);
      if (!serviceType) {
        throw new Error("Service type creation failed");
      }
      return serviceType;
    } catch (error) {
      console.error("Error creating service type:", error);
      throw new Error("Failed to create service type");
    }
  }

  //  UPDATE
  async editServiceType(
    serviceTypeId: string,
    updateData: UpdateServiceTypeDTO
  ): Promise<IServiceType> {
    try {
      const updated = await this.updateOne(
        { _id: serviceTypeId },
        updateData
      );

      if (!updated) {
        throw new Error("Service type not found");
      }

      return updated;
    } catch (error) {
      console.error("Error updating service type:", error);
      throw new Error("Failed to update service type");
    }
  }

  //  SOFT DELETE
  async softDeleteServiceType(
    serviceTypeId: string
  ): Promise<IServiceType> {
    try {
      const deleted = await this.updateOne(
        { _id: serviceTypeId },
        { isActive: false }
      );

      if (!deleted) {
        throw new Error("Service type not found");
      }

      return deleted;
    } catch (error) {
      console.error("Error soft deleting service type:", error);
      throw new Error("Failed to delete service type");
    }
  }

  //  GET ALL (SEARCH + PAGINATION + STATUS + CATEGORY FILTER)
  async getAllServiceTypes(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    categoryId?: string;
  }): Promise<{
    data: IServiceType[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    try {
      const { page, limit } = options;

      const filter: mongoose.QueryFilter<IServiceType> = {};

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
        })) as { data: IServiceType[]; total: number };

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
      })) as IServiceType[];

      return {
        data: all,
        total: all.length,
        page: 1,
        limit: all.length,
        pages: 1
      };
    } catch (error) {
      console.error("Error fetching service types:", error);
      throw new Error("Failed to fetch service types");
    }
  }

  // FIND BY ID
  async findById(id: string): Promise<IServiceType | null> {
    try {
      return await super.findById(id, {
        populate: {
          path: "category",
          select: "name"
        }
      });
    } catch (error) {
      console.error("Error finding service type:", error);
      throw new Error("Failed to find service type");
    }
  }
}
