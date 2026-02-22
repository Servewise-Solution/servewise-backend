import type { Types } from "mongoose";

export interface CreateVehicleTypeDTO {
    name: string;
    category: Types.ObjectId;
    seatingCapacity?: number;
    audit: any;
  }
  
  export interface UpdateVehicleTypeDTO {
    name?: string;
    category?: Types.ObjectId;
    seatingCapacity?: number;
    audit?: any;
  }
  