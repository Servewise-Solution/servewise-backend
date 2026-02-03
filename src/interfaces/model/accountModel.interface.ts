import { Document } from "mongoose";

export interface IAccount extends Document {
  email: string;
  password: string;
  role: "USER" | "PROVIDER" | "ADMIN";
  createdAt?: Date;
  updatedAt?: Date;
}
