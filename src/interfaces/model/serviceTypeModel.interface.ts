import { Document, Types } from "mongoose";
import type { IAudit } from "./audit.interface.js";

export interface IServiceType extends Document {
    _id:Types.ObjectId;
  name: string;
  category: Types.ObjectId; 
  description?: string;
  isActive: boolean;
  audit: IAudit;
}
