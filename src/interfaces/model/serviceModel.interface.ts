import { Document, Types } from "mongoose";
import type { IAudit } from "./audit.interface.js";


export interface IService extends Document {
  vehicleCategoryId: Types.ObjectId;
  vehicleTypeId: Types.ObjectId;
  serviceCategoryId: Types.ObjectId;
  serviceTypeId: Types.ObjectId;

  name: string;
  description?: string;

  basePrice: number;
  isPriceFlexible: boolean;

  estimatedDuration: number; 

  isActive: boolean;
  audit: IAudit;
}
