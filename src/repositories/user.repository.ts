
import { injectable } from "tsyringe";
import type { IUser } from "../interfaces/model/userModel.interface.js";
import type { IUserRepository } from "../interfaces/repository/user.repository.js";
import User from "../models/user.model.js";
import { BaseRepository } from "./base.repository.js";
import type { CreateUser } from "../interfaces/DTO/repository/userRepository.dto.js";

@injectable()
export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor() {
    super(User);
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

  async updatePassword(email: string, hashedPassword: string): Promise<void> {
    try {
      const result = await this.updateOne(
        { email },
        { password: hashedPassword }
      );

      if (!result) {
        throw new Error("Failed to update password or user not found");
      }
    } catch (error) {
      console.log("Error occurred while updating password:", error);
      throw new Error("An error occurred while updating the password");
    }
  }
}