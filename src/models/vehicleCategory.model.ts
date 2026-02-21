import mongoose, { Schema, model } from "mongoose";
import type { IVehicleCategory } from "../interfaces/model/vehicleCategoryModel.interface.js";
import { AuditSchema } from "./audit.schema.js";

const vehicleCategorySchema = new Schema<IVehicleCategory>({
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

  image: {
    type: String,
    required: false,
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

export const VehicleCategory = model<IVehicleCategory>(
  "VehicleCategory",
  vehicleCategorySchema
);
