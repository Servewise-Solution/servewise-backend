import { Document, Types } from "mongoose";
import type { IAudit } from "./audit.interface.js";

export interface IVehicleType extends Document {
  _id:Types.ObjectId;
  name: string;
  category: Types.ObjectId;
  seatingCapacity?: number;
  isActive: boolean;
  audit: IAudit;
}
