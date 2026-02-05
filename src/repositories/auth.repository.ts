
import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repository.js";
import type { IUser } from "../interfaces/model/userModel.interface.js";

import type { CreateUser } from "../interfaces/DTO/repository/authRepository.dto.js";
import { userModel } from "../models/user.model.js";
import type { IAuthRepository } from "../interfaces/repository/auth.repository.js";

@injectable()
export class AuthRepository
  extends BaseRepository<IUser>
  implements IAuthRepository
{
  constructor() {
    super(userModel);
  }
  async createUser(userData: CreateUser): Promise<IUser> {
    try {
      const newUser = await this.create(userData);
      console.log("savedUser from userRepository:", newUser);
      if (!newUser) {
        throw new Error("cannot be saved");
      }
      return newUser;
    } catch (error) {
      console.log("error occured while creating the user:", error);
      throw new Error("Error occured while creating new user");
    }
  }

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      const userData = await this.findOne({ email });
      console.log("userData from user repository:", userData);
      return userData;
    } catch (error) {
      console.log("error occured while fetching the user:", error);
      throw new Error("An error occurred while retrieving the user");
    }
  }
}