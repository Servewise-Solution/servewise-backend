import mongoose, { Schema, model, Types, Document } from "mongoose";

interface GeoPoint {
  type: "Point";
  coordinates: [number, number]; 
}

export interface IAddress extends Document {
  providerId: Types.ObjectId;
  addressLine: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  location: GeoPoint;
}

const addressSchema = new Schema<IAddress>(
  {
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
      unique: true,
    },

    addressLine: {
      type: String,
      trim: true,
      default: null,
    },

    city: {
      type: String,
      trim: true,
      default: null,
    },

    state: {
      type: String,
      trim: true,
      default: null,
    },

    pincode: {
      type: String,
      trim: true,
      default: null,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

addressSchema.index({ location: "2dsphere" });

export const Address = model<IAddress>("Address", addressSchema);