import { Schema, model } from "mongoose";
import type { IService } from "../interfaces/model/serviceModel.interface.js";
import { AuditSchema } from "./audit.schema.js";

const serviceSchema = new Schema<IService>({
  vehicleCategoryId: {
    type: Schema.Types.ObjectId,
    ref: "VehicleCategory",
    required: true,
  },

  vehicleTypeId: {
    type: Schema.Types.ObjectId,
    ref: "VehicleType",
    required: true,
  },

  serviceCategoryId: {
    type: Schema.Types.ObjectId,
    ref: "ServiceCategory",
    required: true,
  },

  serviceTypeId: {
    type: Schema.Types.ObjectId,
    ref: "ServiceType",
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  description: { type: String },

  basePrice: {
    type: Number,
    required: true,
  },

  isPriceFlexible: {
    type: Boolean,
    default: false,
  },

  estimatedDuration: {
    type: Number,
    required: true,
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

export const Service = model<IService>("Service", serviceSchema);
