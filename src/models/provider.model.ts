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

    businessName: {
      type: String,
      trim: true,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    yearsOfExperience: {
      type: Number,
      default: 0,
    },

    premiseImage: {
      type: String,
    },

    temporarilyClosed: {
      type: Boolean,
      default: true,
    },

    subscriptionPlanHistory: {
      type:Schema.Types.ObjectId,
      ref:"SubscriptionHistory"
    },

    status: {
      type: String,
      enum: ["Active", "Blocked","Step2Approved", "Step2Rejected","Pending", "Rejected"],
    },

    companyLicense: {
      type: String,
    },
    ownerImage: {
      type: String,
    },

    addressId: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      default: null,
    },

    schedule: {
      workingDays: {
        type: [String],
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        default: [],
      },
      openTime: { type: String, default: null },
      closeTime: { type: String, default: null },
    },
    rejectionReason: {
      type: String,
    },

    bankDetails: {
      accountHolderName: {
        type: String,
      },
      accountNumber: {
        type: String,
      },
      bankName: {
        type: String,
      },
      ifscCode: {
        type: String,
      },
      branchName: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Provider = mongoose.model<IProvider>("Provider", providerSchema);
