import { Schema, model } from "mongoose";
import type { IServiceCategory } from "../interfaces/model/serviceCategoryModel.interface.js";
import { AuditSchema } from "./audit.schema.js";

const serviceCategorySchema = new Schema<IServiceCategory>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
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

export const ServiceCategory = model<IServiceCategory>(
  "ServiceCategory",
  serviceCategorySchema
);
