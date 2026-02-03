import mongoose, { Schema } from "mongoose";
import type { IAccount } from "../interfaces/model/accountModel.interface.js";

const accountSchema = new Schema<IAccount>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["USER", "PROVIDER", "ADMIN"],
      required: true,
    },
  },
  { timestamps: true },
);

export const accountModel = mongoose.model<IAccount>("account", accountSchema);
