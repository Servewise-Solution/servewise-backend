import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repository.js";
import type { IAdmin } from "../interfaces/model/adminModel.interface.js";
import type { IAdminRepository } from "../interfaces/repository/admin.repository.js";
import Admin from "../models/admin.model.js";


@injectable()
export class AdminRepository
  extends BaseRepository<IAdmin>
  implements IAdminRepository
{
  constructor() {
    super(Admin);
  }
  async findByEmail(email: string): Promise<IAdmin | null> {
    try {
      console.log("email in the admin repository:", email);
      const admin = await this.findOne({ email });
      console.log("found admin in the admin repository:", admin);
      return admin;
    } catch (error) {
      console.log("error occured while fetching the error", error);
      throw new Error("An error occured while retrieving the admin");
    }
  }

  async getAdmin(): Promise<IAdmin | null> {
    try {
      console.log("entered to the getAdmin method in the admin repository");
      const admin = await this.findOne({});
      return admin;
    } catch (error) {
      console.log("error occured while fetching the admin", error);
      throw error;
    }
  }
}