import { Document, Types} from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId; 
  username: string;
  email:string;
  phone: number;
  password:string;
  image: string;
  status:"Active" | "Blocked";
  createdAt?: Date;
  updatedAt?: Date;
}
