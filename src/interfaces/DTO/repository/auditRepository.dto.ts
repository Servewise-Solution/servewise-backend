import type { Types } from "mongoose";

export interface CreateAuditDTO {
    createdBy: Types.ObjectId;
    createdByRole: "ADMIN" | "PROVIDER" | "SYSTEM";
  
    updatedBy?: Types.ObjectId;
    updatedByRole?: "ADMIN" | "PROVIDER" | "SYSTEM";
  }
  