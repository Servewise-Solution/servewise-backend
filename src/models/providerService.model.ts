import { Schema, model } from "mongoose";

import { AuditSchema } from "./audit.schema.js";
import type { IProviderService } from "../interfaces/model/providerService.interface.js";


const providerServiceSchema = new Schema<IProviderService>({
  providerId: {
    type: Schema.Types.ObjectId,
    ref: "Provider",
    required: true
  },

  serviceId: {
    type: Schema.Types.ObjectId,
    ref: "Service",
    required: true
  },

  proposedPrice: {
    type: Number,
    required: true
  },

  serviceAtOwnerPremise: {
    type: Boolean,
    default: false,
  },

  finalPrice: Number, 

  estimatedDuration: Number,

  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING"
  },

  rejectionReason: String,

  isActive: {
    type: Boolean,
    default: true
  },

  audit: {
    type: AuditSchema,
    required: true
  }
});

export const ProviderService = model<IProviderService>(
  "ProviderService",
  providerServiceSchema
);
