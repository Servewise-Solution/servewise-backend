import { Document, Types } from "mongoose"; 

export interface IAdmin extends Document {
  _id: Types.ObjectId; 
  email: string;
  password: string;
  status: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
