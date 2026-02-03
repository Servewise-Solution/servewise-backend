import type { ObjectId, Types } from "mongoose";

export interface CreateUser {
    accountId: any;
    username: string;
    phone: number;
    isVerified?: boolean;
    status?: "Active" | "Blocked";
  }
 