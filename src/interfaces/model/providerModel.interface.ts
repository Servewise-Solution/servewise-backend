import type { Types, Document } from "mongoose";

export interface IBankDetails {
  accountHolderName?: string;
  accountNumber?: string;
  bankName?: string;
  ifscCode?: string;
  branchName?: string;
}

export interface IProvider extends Document {
  _id: Types.ObjectId;

  username: string;
  email: string;
  phone: number;
  password: string;

  ownerName: string;
  isVerified: boolean;
  yearsOfExperience: number;

  premiseImage?: string;
  serviceAtCustomerPremise: boolean;
  businessName?: string;

  temporarilyClosed: boolean;
  ownerImage?: string;

  subscriptionPlanHistory: Types.ObjectId;
  schedule?: {
    workingDays: string[];
    openTime: string | null;
    closeTime: string | null;
  };

  status:
    | "Pending"
    | "Step2Approved"
    | "Step2Rejected"
    | "Active"
    | "Rejected"
    | "Blocked";

  rejectionReason?: string;

  addressId?: Types.ObjectId;

  businessLicense?: string;
  bankDetails?: IBankDetails;

  createdAt?: Date;
  updatedAt?: Date;
}
