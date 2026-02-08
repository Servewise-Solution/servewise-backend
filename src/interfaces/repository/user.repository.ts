import type { ObjectId, Types } from "mongoose";
import type { CreateUser } from "../DTO/repository/userRepository.dto.js";
import type { IUser } from "../model/userModel.interface.js";

export interface IUserRepository {
  createUser(userData: CreateUser): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  updatePassword(email: string, hashedPassword: string): Promise<void>
  getAllUsers(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{
    data: IUser[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }>
}
