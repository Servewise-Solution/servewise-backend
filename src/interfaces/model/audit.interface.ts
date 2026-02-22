import { Document, Types } from "mongoose";

export type AuditActorRole = "ADMIN" | "PROVIDER" | "SYSTEM";

export interface IAudit extends Document {
  createdBy: Types.ObjectId;
  createdByRole: AuditActorRole;

  updatedBy?: Types.ObjectId;
  updatedByRole?: AuditActorRole;

  createdAt: Date;
  updatedAt: Date;
}

