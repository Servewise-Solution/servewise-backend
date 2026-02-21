import { Document,Types } from "mongoose";
import type { IAudit } from "./audit.interface.js";

export interface IVehicleCategory extends Document {
  _id:Types.ObjectId,
  name: string;
  description?: string;
  image?: string; 
  isActive: boolean;
  audit: IAudit;
}
