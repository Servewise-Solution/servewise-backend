import { injectable } from "tsyringe";
import mongoose from "mongoose";

import { BaseRepository } from "./base.repository.js";
import { Audit } from "../models/audit.schema.js";

import type { IAudit } from "../interfaces/model/audit.interface.js";
import type { IAuditRepository } from "../interfaces/repository/audit.repository.js";
import type { CreateAuditDTO } from "../interfaces/DTO/repository/auditRepository.dto.js";

@injectable()
export class AuditRepository
  extends BaseRepository<IAudit>
  implements IAuditRepository
{
  constructor() {
    super(Audit);
  }

  // CREATE AUDIT
  async createAudit(data: CreateAuditDTO): Promise<IAudit> {
    try {
      const audit = await this.create(data);
      if (!audit) {
        throw new Error("Audit creation failed");
      }
      return audit;
    } catch (error) {
      console.error("Error creating audit:", error);
      throw new Error("Failed to create audit");
    }
  }

  //  GET ALL AUDITS
  async getAllAudits(options?: {
    page?: number;
    limit?: number;
    role?: string;
  }): Promise<{
    data: IAudit[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    try {
      const filter: mongoose.QueryFilter<IAudit> = {};

      if (options?.role) {
        filter.createdByRole = options.role as any;
      }

      if (options?.page && options?.limit) {
        const result = (await this.find(filter, {
          pagination: { page: options.page, limit: options.limit },
          sort: { createdAt: -1 }
        })) as { data: IAudit[]; total: number };

        return {
          data: result.data,
          total: result.total,
          page: options.page,
          limit: options.limit,
          pages: Math.ceil(result.total / options.limit)
        };
      }

      const all = (await this.find(filter, {
        sort: { createdAt: -1 }
      })) as IAudit[];

      return {
        data: all,
        total: all.length,
        page: 1,
        limit: all.length,
        pages: 1
      };
    } catch (error) {
      console.error("Error fetching audits:", error);
      throw new Error("Failed to fetch audits");
    }
  }
}
