import type { CreateProvider } from "../DTO/repository/providerRepository.dto.js";
import type { IProvider } from "../model/providerModel.interface.js";

export interface IProviderRepository {
  createProvider(userData: CreateProvider): Promise<IProvider>;
  findByEmail(email: string): Promise<IProvider | null>;
  updatePassword(email: string, hashedPassword: string): Promise<void>
  getAllProviders(options: {
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
  }>
  blockProvider(
    userId: string,
    newStatus: "Active" | "Blocked"
  ): Promise<IProvider>
  findById(id: string): Promise<IProvider | null>
  updateProviderDetails(
    providerId: string,
    providerData: Partial<IProvider>
  ): Promise<IProvider | null>
  getAllApplicants(options: { page?: number; limit?: number }): Promise<{
    data: IProvider[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> 

}
