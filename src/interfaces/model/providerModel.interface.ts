import type { Types, Document } from "mongoose";

export interface IProvider extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  phone: number;
  password: string;
  ownerName: string;
  isVerified: boolean;
  isActive: boolean;
  yearsOfExperience: number;
  premiseImage?: string;
  pickAndDrop: boolean;
  serviceAtOwnerPremise: boolean;
  isAvailable: boolean;
  subscriptionPlanHistory: Record<string, any>[];
  status: "Active" | "Blocked";
  createdAt?: Date;
  updatedAt?: Date;
}
