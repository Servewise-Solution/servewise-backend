import { model, Schema } from "mongoose";
import type { IAudit } from "../interfaces/model/audit.interface.js";


export const AuditSchema = new Schema<IAudit>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "audit.createdByRole"
    },

    createdByRole: {
      type: String,
      enum: ["ADMIN", "PROVIDER", "SYSTEM"],
      required: true
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      refPath: "audit.updatedByRole"
    },

    updatedByRole: {
      type: String,
      enum: ["ADMIN", "PROVIDER", "SYSTEM"]
    },

    createdAt: {
      type: Date,
      default: Date.now
    },

    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

export const Audit = model<IAudit>(
    "Audit",
    AuditSchema
  );
  
