import mongoose, { Schema, model } from "mongoose";
import type { IVehicleType } from "../interfaces/model/vehicleTypeModel.interface.js";
import { AuditSchema } from "./audit.schema.js";

const vehicleTypeSchema = new Schema<IVehicleType>({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: "VehicleCategory",
    required: true,
  },

  seatingCapacity: {
    type: Number,
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

export const VehicleType = model<IVehicleType>(
  "VehicleType",
  vehicleTypeSchema
);
