import { Schema, model } from "mongoose";
import type { IServiceType } from "../interfaces/model/serviceTypeModel.interface.js";
import { AuditSchema } from "./audit.schema.js";

const serviceTypeSchema = new Schema<IServiceType>({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: "ServiceCategory",
    required: true,
  },

  description: {
    type: String,
    trim: true,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
  audit: {
    type: AuditSchema,
    required: true,
  },
});

export const ServiceType = model<IServiceType>(
  "ServiceType",
  serviceTypeSchema
);
