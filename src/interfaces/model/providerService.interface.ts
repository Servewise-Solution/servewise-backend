import { Document, Types } from "mongoose";
import type { IAudit } from "./audit.interface.js";


export type ProviderServiceStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface IProviderService extends Document {
  providerId: Types.ObjectId;
  serviceId: Types.ObjectId;

  serviceAtOwnerPremise:boolean

  proposedPrice: number;   
  finalPrice: number;      

  estimatedDuration?: number;

  status: ProviderServiceStatus;
  rejectionReason?: string;

  isActive: boolean;

  audit: IAudit;
}
