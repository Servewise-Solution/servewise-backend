import type { IAdmin } from "../model/adminModel.interface.js";

export interface IAdminRepository {
  findByEmail(email: string): Promise<IAdmin | null>;
  getAdmin(): Promise<IAdmin | null>;
}