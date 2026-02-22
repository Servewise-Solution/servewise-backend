import { injectable } from "tsyringe";
import mongoose from "mongoose";

import { BaseRepository } from "./base.repository.js";
import { ProviderService } from "../models/providerService.model.js";

import type { IProviderService } from "../interfaces/model/providerService.interface.js";
import type { IProviderServiceRepository } from "../interfaces/repository/providerService.repository.js";
import type {
  CreateProviderServiceDTO,
  UpdateProviderServiceDTO
} from "../interfaces/DTO/repository/providerServiceRepository.dto.js";

@injectable()
export class ProviderServiceRepository
  extends BaseRepository<IProviderService>
  implements IProviderServiceRepository
{
  constructor() {
    super(ProviderService);
  }

  //  PROVIDER SELECT SERVICE
  async createProviderService(
    data: CreateProviderServiceDTO
  ): Promise<IProviderService> {
    try {
      return await this.create(data);
    } catch (error) {
      console.error("Error creating provider service:", error);
      throw new Error("Failed to create provider service");
    }
  }

  // PROVIDER UPDATE BEFORE APPROVAL
  async updateProviderService(
    id: string,
    updateData: UpdateProviderServiceDTO
  ): Promise<IProviderService> {
    const updated = await this.updateOne({ _id: id }, updateData);
    if (!updated) throw new Error("Provider service not found");
    return updated;
  }

  //  ADMIN APPROVE
  async approveProviderService(
    id: string,
    finalPrice: number
  ): Promise<IProviderService> {
    const updated = await this.updateOne(
      { _id: id },
      {
        status: "APPROVED",
        finalPrice
      }
    );

    if (!updated) throw new Error("Provider service not found");
    return updated;
  }

  // ADMIN REJECT
  async rejectProviderService(
    id: string,
    reason: string
  ): Promise<IProviderService> {
    const updated = await this.updateOne(
      { _id: id },
      {
        status: "REJECTED",
        rejectionReason: reason
      }
    );

    if (!updated) throw new Error("Provider service not found");
    return updated;
  }

  // SOFT DELETE
  async softDeleteProviderService(id: string): Promise<IProviderService> {
    const deleted = await this.updateOne(
      { _id: id },
      { isActive: false }
    );

    if (!deleted) throw new Error("Provider service not found");
    return deleted;
  }

  // GET ALL WITH STATUS / PROVIDER FILTER
  async getAllProviderServices(options: {
    page?: number;
    limit?: number;
    status?: string;
    providerId?: string;
  }): Promise<{
    data: IProviderService[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const filter: mongoose.QueryFilter<IProviderService> = {};

    if (options.status) filter.status = options.status as any;

    if (options.providerId)
      filter.providerId = new mongoose.Types.ObjectId(options.providerId);

    const populate = [
      { path: "providerId", select: "name email" },
      { path: "serviceId", select: "name basePrice" }
    ];

    if (options.page && options.limit) {
      const result = (await this.find(filter, {
        pagination: { page: options.page, limit: options.limit },
        sort: { "audit.createdAt": -1 },
        populate
      })) as { data: IProviderService[]; total: number };

      return {
        data: result.data,
        total: result.total,
        page: options.page,
        limit: options.limit,
        pages: Math.ceil(result.total / options.limit)
      };
    }

    const all = (await this.find(filter, {
      populate,
      sort: { "audit.createdAt": -1 }
    })) as IProviderService[];

    return {
      data: all,
      total: all.length,
      page: 1,
      limit: all.length,
      pages: 1
    };
  }

  // FIND BY ID
  async findById(id: string): Promise<IProviderService | null> {
    return await super.findById(id, {
      populate: [
        { path: "providerId", select: "name email" },
        { path: "serviceId", select: "name basePrice isPriceFlexible" }
      ]
    });
  }
}
