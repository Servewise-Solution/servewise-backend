import mongoose, { Schema, model, Document } from "mongoose";
import type { IProvider } from "../interfaces/model/providerModel.interface.js";

const providerSchema = new Schema<IProvider>(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    phone: {
      type: Number,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    ownerName: {
      type: String,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    yearsOfExperience: {
      type: Number,
      default: 0,
    },

    premiseImage: {
      type: String,
    },

    pickAndDrop: {
      type: Boolean,
      default: false,
    },

    serviceAtOwnerPremise: {
      type: Boolean,
      default: false,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    subscriptionPlanHistory: {
      type: [Object],
      default: [],
    },
    status: {
      type: String,
      enum: ["Active", "Blocked"],
    },
  },
  {
    timestamps: true,
  }
);

export const Provider = mongoose.model<IProvider>("Provider", providerSchema);
