import type { Types } from "mongoose";

export interface CreateProviderServiceDTO {
    providerId: Types.ObjectId;
    serviceId: Types.ObjectId;
    proposedPrice: number;
    estimatedDuration?: number;
    audit: any;
  }
  
  export interface UpdateProviderServiceDTO {
    proposedPrice?: number;
    estimatedDuration?: number;
    audit?: any;
  }
  