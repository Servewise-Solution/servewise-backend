import mongoose, { Schema } from "mongoose";
import { type IAddress } from "../interfaces/model/addressModel.interface.js";

const addressSchema: Schema<IAddress> = new Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "ownerModel",
    },
    ownerModel: {
      type: String,
      enum: ["user", "provider"],
      required: true,
    },
    fullAddress: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    landmark: {
      type: String,
    },
  },
  { timestamps: true },
);

addressSchema.index({ longitude: 1, latitude: 1 });

const address = mongoose.model<IAddress>("address", addressSchema);

export default address;
