
import { injectable } from "tsyringe";
import mongoose from "mongoose";
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
  async getAllUsers(options: {
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
  }> {
    try {
      console.log("entering the function which fetches all the users");
      const page = options.page;
      const limit = options.limit;

      const filter: mongoose.QueryFilter<IUser> = {};

      if (options.search) {
        filter.$or = [
          { username: { $regex: options.search, $options: "i" } },
          { email: { $regex: options.search, $options: "i" } },
        ];
      }

      if (options.status) {
        if (options.status === "active") {
          filter.status = "Active";
        } else if (options.status === "blocked") {
          filter.status = "Blocked";
        }
      }

      if (page !== undefined && limit !== undefined) {
        const result = (await this.find(filter, {
          pagination: { page, limit },
          sort: { createdAt: -1 },
        })) as { data: IUser[]; total: number };

        console.log("data fetched from the user repository:", result);

        return {
          data: result.data,
          total: result.total,
          page,
          limit,
          pages: Math.ceil(result.total / limit),
        };
      } else {
        const allUsers = (await this.find(filter, {
          sort: { createdAt: -1 },
        })) as IUser[];

        console.log("all categories without pagination:", allUsers);
        return {
          data: allUsers,
          total: allUsers.length,
          page: 1,
          limit: allUsers.length,
          pages: 1,
        };
      }
    } catch (error) {
      console.log("error occurred while fetching the users:", error);
      throw new Error("Failed to fetch the users");
    }
  }
}