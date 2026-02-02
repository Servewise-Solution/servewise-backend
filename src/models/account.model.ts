import mongoose, { Schema } from "mongoose";
import type { IAccount } from "../interfaces/model/account.interface.js";

const accountSchema: Schema<IAccount> = new Schema(
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

const account = mongoose.model<IAccount>("account", accountSchema);

export default account;
