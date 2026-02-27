import { Types, Document } from "mongoose";

export interface IAddress extends Document {
  _id: Types.ObjectId;
  ownerId: Types.ObjectId;
  ownerModel: "user" | "provider";
  fullAddress: string;
  city: string;
  state: string;
  pincode: string;
  longitude: number;
  latitude: number;
  landmark?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
