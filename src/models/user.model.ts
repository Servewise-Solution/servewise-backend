import mongoose, { Schema } from "mongoose";
import type { IUser } from "../interfaces/model/userModel.interface.js";

const userSchema = new Schema<IUser>(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "account",
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);

export const userModel = mongoose.model("user", userSchema);
