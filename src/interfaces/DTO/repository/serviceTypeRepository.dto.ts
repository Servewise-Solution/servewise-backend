import type { Types } from "mongoose";

export interface CreateServiceTypeDTO {
    name: string;
    category: Types.ObjectId;
    description?: string;
    audit: any;
  }
  
  export interface UpdateServiceTypeDTO {
    name?: string;
    category?:Types.ObjectId;
    description?: string;
    audit?: any;
  }
  