import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repository.js";
import type { IUser } from "../interfaces/model/userModel.interface.js";
import type { IAccountRepository } from "../interfaces/repository/account.repository.js";
import type { CreateAccount } from "../interfaces/DTO/repository/accountRepository.dto.js";
import type { IAccount } from "../interfaces/model/accountModel.interface.js";
import { accountModel } from "../models/account.model.js";

@injectable()
export class AccountRepository
  extends BaseRepository<IAccount>
  implements IAccountRepository
{
  constructor() {
    super(accountModel);
  }
  async createAccount(accountData: CreateAccount): Promise<IAccount> {
    try {
      const newAccount = await this.create(accountData);
      console.log("savedAccount from accountRepository:", newAccount);
      if (!newAccount) {
        throw new Error("cannot be saved");
      }
      return newAccount;
    } catch (error) {
      console.log("error occured while creating the account:", error);
      throw new Error("Error occured while creating new account");
    }
  }
  async findByEmail(email: string): Promise<IAccount | null> {
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