import type { CreateUser } from "../DTO/repository/authRepository.dto.js";
import type { IUser } from "../model/userModel.interface.js";

export interface IAuthRepository {
  createUser(userData: CreateUser): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
}
