import { Document, Types } from "mongoose";
import type { IAudit } from "./audit.interface.js";

export interface IServiceCategory extends Document {
  _id:Types.ObjectId,
  name: string;
  description?: string;
  isActive: boolean;
  audit: IAudit;
}
