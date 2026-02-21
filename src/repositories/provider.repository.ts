
import { injectable } from "tsyringe";
import mongoose from "mongoose";
import { BaseRepository } from "./base.repository.js";
import type { IProvider } from "../interfaces/model/providerModel.interface.js";
import { Provider } from "../models/provider.model.js";
import type { CreateProvider } from "../interfaces/DTO/repository/providerRepository.dto.js";
import type { IProviderRepository } from "../interfaces/repository/provider.repository.js";



@injectable()
export class ProviderRepository
  extends BaseRepository<IProvider>
  implements IProviderRepository
{
  constructor() {
    super(Provider);
  }
  async createProvider(userData: CreateProvider): Promise<IProvider> {
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

  async findByEmail(email: string): Promise<IProvider | null> {
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
  async getAllProviders(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{
    data: IProvider[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    try {
      console.log("entering the function which fetches all the users");
      const page = options.page;
      const limit = options.limit;

      const filter: mongoose.QueryFilter<IProvider> = {};

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
        })) as { data: IProvider[]; total: number };

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
        })) as IProvider[];

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

  async blockProvider(
    userId: string,
    newStatus: "Active" | "Blocked"
  ): Promise<IProvider> {
    try {
      console.log(`Attempting to update user ${userId} status to ${newStatus}`);

      const updatedUser = await this.updateOne(
        { _id: userId },
        { status: newStatus }
      );

      if (!updatedUser) {
        console.log(`User with ID ${userId} not found`);
        throw new Error("User not found");
      }

      

      return updatedUser;
    } catch (error) {
      console.error("Error in blockUser:", error);
      throw new Error("Failed to update user status: " + error);
    }
  }

  async updateProviderDetails(
    providerId: string,
    providerData: Partial<IProvider>
  ): Promise<IProvider | null> {
    try {
      const updatedProvider = await this.updateOne(
        { _id: providerId },
        providerData
      );
  
      return updatedProvider;
    } catch (error) {
      console.error("Error updating provider:", error);
      throw new Error("Error updating provider details");
    }
  }
  
  

  async getAllApplicants(options: { page?: number; limit?: number }): Promise<{
    data: IProvider[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    try {
      console.log("entering the function which fetches all the users");
      const page = options.page || 1;
      const limit = options.limit || 6;

      const filter: mongoose.QueryFilter<IProvider> = {};

      console.log("filter", filter);

      filter.isVerified = false;
      filter.status = "Pending";

      const result = (await this.find(filter, {
        pagination: { page, limit },
        sort: { createdAt: -1 },
      })) as { data: IProvider[]; total: number };

      console.log("data fetched from the user repository:", result);

      return {
        data: result.data,
        total: result.total,
        page,
        limit,
        pages: Math.ceil(result.total / limit),
      };
    } catch (error) {
      console.error("error occurred while fetching the users:", error);
      throw new Error("Failed to fetch the users");
    }
  }

  
  

  async findById(id: string): Promise<IProvider | null> {
    try {
      return await Provider.findById(id).exec();
    } catch (error) {
      throw new Error("Error finding designation by ID: " + error);
    }
  }
}