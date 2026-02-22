import { injectable } from "tsyringe";
import mongoose from "mongoose";

import { BaseRepository } from "./base.repository.js";
import { Service } from "../models/service.model.js";

import type { IService } from "../interfaces/model/serviceModel.interface.js";
import type { IServiceRepository } from "../interfaces/repository/service.repository.js";
import type {
  CreateServiceDTO,
  UpdateServiceDTO
} from "../interfaces/DTO/repository/serviceRepository.dto.js";

@injectable()
export class ServiceRepository
  extends BaseRepository<IService>
  implements IServiceRepository
{
  constructor() {
    super(Service);
  }

  //  CREATE
  async addService(data: CreateServiceDTO): Promise<IService> {
    try {
      const service = await this.create(data);
      if (!service) {
        throw new Error("Service creation failed");
      }
      return service;
    } catch (error) {
      console.error("Error creating service:", error);
      throw new Error("Failed to create service");
    }
  }

  // UPDATE
  async editService(
    serviceId: string,
    updateData: UpdateServiceDTO
  ): Promise<IService> {
    try {
      const updated = await this.updateOne(
        { _id: serviceId },
        updateData
      );

      if (!updated) {
        throw new Error("Service not found");
      }

      return updated;
    } catch (error) {
      console.error("Error updating service:", error);
      throw new Error("Failed to update service");
    }
  }

  // SOFT DELETE
  async softDeleteService(serviceId: string): Promise<IService> {
    try {
      const deleted = await this.updateOne(
        { _id: serviceId },
        { isActive: false }
      );

      if (!deleted) {
        throw new Error("Service not found");
      }

      return deleted;
    } catch (error) {
      console.error("Error soft deleting service:", error);
      throw new Error("Failed to delete service");
    }
  }

  // GET ALL WITH RELATIONAL FILTERS
  async getAllServices(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    vehicleCategoryId?: string;
    vehicleTypeId?: string;
    serviceCategoryId?: string;
    serviceTypeId?: string;
  }): Promise<{
    data: IService[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    try {
      const { page, limit } = options;

      const filter: mongoose.QueryFilter<IService> = {};

      if (options.search) {
        filter.name = { $regex: options.search, $options: "i" };
      }

      if (options.status) {
        if (options.status === "active") filter.isActive = true;
        if (options.status === "inactive") filter.isActive = false;
      }

      if (options.vehicleCategoryId)
        filter.vehicleCategoryId = new mongoose.Types.ObjectId(options.vehicleCategoryId);

      if (options.vehicleTypeId)
        filter.vehicleTypeId = new mongoose.Types.ObjectId(options.vehicleTypeId);

      if (options.serviceCategoryId)
        filter.serviceCategoryId = new mongoose.Types.ObjectId(options.serviceCategoryId);

      if (options.serviceTypeId)
        filter.serviceTypeId = new mongoose.Types.ObjectId(options.serviceTypeId);

      const populateOptions = [
        { path: "vehicleCategoryId", select: "name" },
        { path: "vehicleTypeId", select: "name" },
        { path: "serviceCategoryId", select: "name" },
        { path: "serviceTypeId", select: "name" }
      ];

      if (page && limit) {
        const result = (await this.find(filter, {
          pagination: { page, limit },
          sort: { "audit.createdAt": -1 },
          populate: populateOptions
        })) as { data: IService[]; total: number };

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
        populate: populateOptions
      })) as IService[];

      return {
        data: all,
        total: all.length,
        page: 1,
        limit: all.length,
        pages: 1
      };
    } catch (error) {
      console.error("Error fetching services:", error);
      throw new Error("Failed to fetch services");
    }
  }

  //  FIND BY ID WITH FULL POPULATION
  async findById(id: string): Promise<IService | null> {
    try {
      return await super.findById(id, {
        populate: [
          { path: "vehicleCategoryId", select: "name" },
          { path: "vehicleTypeId", select: "name" },
          { path: "serviceCategoryId", select: "name" },
          { path: "serviceTypeId", select: "name" }
        ]
      });
    } catch (error) {
      console.error("Error finding service:", error);
      throw new Error("Failed to find service");
    }
  }
}
