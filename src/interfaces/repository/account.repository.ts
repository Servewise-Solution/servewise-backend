import type { CreateAccount } from "../DTO/repository/accountRepository.dto.js";
import type { CreateUser } from "../DTO/repository/authRepository.dto.js";
import type { IAccount } from "../model/accountModel.interface.js";
import type { IUser } from "../model/userModel.interface.js";

export interface IAccountRepository {
  createAccount(accountData: CreateAccount): Promise<IAccount>;
}
