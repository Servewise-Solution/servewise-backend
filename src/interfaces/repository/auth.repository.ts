import type { ObjectId, Types } from "mongoose";
import type { CreateUser } from "../DTO/repository/authRepository.dto.js";
import type { IUser } from "../model/userModel.interface.js";

export interface IUserRepository {
  createUser(userData: CreateUser): Promise<IUser>;
  findByAccountId(accountId: Types.ObjectId): Promise<IUser | null>
}
