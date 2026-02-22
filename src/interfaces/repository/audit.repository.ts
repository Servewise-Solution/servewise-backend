import type { IAudit } from "../model/audit.interface.js";
import type { CreateAuditDTO } from "../DTO/repository/auditRepository.dto.js";

export interface IAuditRepository {
  createAudit(data: CreateAuditDTO): Promise<IAudit>;

  getAllAudits(options?: {
    page?: number;
    limit?: number;
    role?: string;
  }): Promise<{
    data: IAudit[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }>;
}
