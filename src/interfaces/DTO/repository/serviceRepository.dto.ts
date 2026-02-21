import type { Types } from "mongoose";

export interface CreateServiceDTO {
  vehicleCategoryId: Types.ObjectId;
  vehicleTypeId: Types.ObjectId;
  serviceCategoryId: Types.ObjectId;
  serviceTypeId: Types.ObjectId;

  name: string;
  description?: string;

  basePrice: number;
  isPriceFlexible?: boolean;
  estimatedDuration: number;

  audit: any;
}

export interface UpdateServiceDTO {
  vehicleCategoryId?: Types.ObjectId;
  vehicleTypeId?: Types.ObjectId;
  serviceCategoryId?: Types.ObjectId;
  serviceTypeId?: Types.ObjectId;

  name?: string;
  description?: string;

  basePrice?: number;
  isPriceFlexible?: boolean;
  estimatedDuration?: number;

  audit?: any;
}
