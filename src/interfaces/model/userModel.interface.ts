import { Document, type ObjectId } from "mongoose";

export interface IUser extends Document {
  accountId: ObjectId;
  username: string;
  phone: number;
  image: string;
  status:"Active" | "Blocked";
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
