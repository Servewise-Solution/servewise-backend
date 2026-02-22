import { inject, injectable } from "tsyringe";
import mongoose from "mongoose";

import type { IProviderServiceService } from "../interfaces/services/providerService.service.js";
import type { IProviderServiceRepository } from "../interfaces/repository/providerService.repository.js";
import type { IAuditRepository } from "../interfaces/repository/audit.repository.js";
import type { IServiceRepository } from "../interfaces/repository/service.repository.js";

@injectable()
export class ProviderServiceService implements IProviderServiceService {
  constructor(
    @inject("IProviderServiceRepository")
    private _providerServiceRepo: IProviderServiceRepository,

    @inject("IAuditRepository")
    private _auditRepo: IAuditRepository,

    @inject("IServiceRepository")
    private _serviceRepo: IServiceRepository
  ) {}

  // ⭐ PROVIDER SELECT SERVICE
  async createProviderService(data: {
    providerId: string;
    serviceId: string;
    proposedPrice: number;
    estimatedDuration?: number;
    actorId: string;
    actorRole: "ADMIN" | "PROVIDER";
  }) {
    try {
      const service = await this._serviceRepo.findById(data.serviceId);
      if (!service) {
        return { success: false, message: "Service not found" };
      }

      // ⭐ PRICE VALIDATION
      if (!service.isPriceFlexible && data.proposedPrice !== service.basePrice) {
        return {
          success: false,
          message: "This service has fixed price. Price cannot be changed"
        };
      }

      const audit = await this._auditRepo.createAudit({
        createdBy: new mongoose.Types.ObjectId(data.actorId),
        createdByRole: data.actorRole
      });

      const payload: any = {
        providerId: new mongoose.Types.ObjectId(data.providerId),
        serviceId: new mongoose.Types.ObjectId(data.serviceId),
        proposedPrice: data.proposedPrice,
        audit
      };

      if (data.estimatedDuration !== undefined) {
        payload.estimatedDuration = data.estimatedDuration;
      }

      await this._providerServiceRepo.createProviderService(payload);

      return {
        success: true,
        message: "Service selected successfully. Waiting for admin approval"
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to create provider service" };
    }
  }

  // ⭐ PROVIDER UPDATE BEFORE APPROVAL
  async updateProviderService(
    id: string,
    data: {
      proposedPrice?: number;
      estimatedDuration?: number;
      actorId: string;
      actorRole: "ADMIN" | "PROVIDER";
    }
  ) {
    try {
      const providerService = await this._providerServiceRepo.findById(id);
      if (!providerService) {
        return { success: false, message: "Provider service not found" };
      }

      if (providerService.status !== "PENDING") {
        return {
          success: false,
          message: "Cannot modify after approval or rejection"
        };
      }

      const audit = await this._auditRepo.createAudit({
        createdBy: new mongoose.Types.ObjectId(data.actorId),
        createdByRole: data.actorRole
      });

      const payload: any = { audit };

      if (data.proposedPrice !== undefined)
        payload.proposedPrice = data.proposedPrice;

      if (data.estimatedDuration !== undefined)
        payload.estimatedDuration = data.estimatedDuration;

      await this._providerServiceRepo.updateProviderService(id, payload);

      return {
        success: true,
        message: "Provider service updated successfully"
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Failed to update provider service" };
    }
  }

  // ⭐ ADMIN APPROVE
  async approveProviderService(
    id: string,
    finalPrice: number,
    adminId: string
  ) {
    try {
      const providerService = await this._providerServiceRepo.findById(id);
      if (!providerService) {
        return { success: false, message: "Provider service not found" };
      }

      const audit = await this._auditRepo.createAudit({
        createdBy: new mongoose.Types.ObjectId(adminId),
        createdByRole: "ADMIN"
      });

      await this._providerServiceRepo.approveProviderService(id, finalPrice);

      return {
        success: true,
        message: "Provider service approved"
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Approval failed" };
    }
  }

  // ⭐ ADMIN REJECT
  async rejectProviderService(
    id: string,
    reason: string,
    adminId: string
  ) {
    try {
      const audit = await this._auditRepo.createAudit({
        createdBy: new mongoose.Types.ObjectId(adminId),
        createdByRole: "ADMIN"
      });

      await this._providerServiceRepo.rejectProviderService(id, reason);

      return {
        success: true,
        message: "Provider service rejected"
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Rejection failed" };
    }
  }

  // ⭐ SOFT DELETE
  async deleteProviderService(id: string) {
    try {
      await this._providerServiceRepo.softDeleteProviderService(id);

      return {
        success: true,
        message: "Provider service deleted"
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Delete failed" };
    }
  }

  // ⭐ GET ALL
  async getAllProviderServices(options: any) {
    try {
      const result =
        await this._providerServiceRepo.getAllProviderServices(options);

      return {
        success: true,
        message: "Provider services fetched successfully",
        data: result
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Fetch failed" };
    }
  }
}
