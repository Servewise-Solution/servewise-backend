import type { IProviderService } from "../model/providerService.interface.js";
import type {
  CreateProviderServiceDTO,
  UpdateProviderServiceDTO
} from "../DTO/repository/providerServiceRepository.dto.js";

export interface IProviderServiceRepository {
  createProviderService(data: CreateProviderServiceDTO): Promise<IProviderService>;

  updateProviderService(
    id: string,
    updateData: UpdateProviderServiceDTO
  ): Promise<IProviderService>;

  approveProviderService(
    id: string,
    finalPrice: number
  ): Promise<IProviderService>;

  rejectProviderService(
    id: string,
    reason: string
  ): Promise<IProviderService>;

  softDeleteProviderService(id: string): Promise<IProviderService>;

  getAllProviderServices(options: {
    page?: number;
    limit?: number;
    status?: string;
    providerId?: string;
  }): Promise<{
    data: IProviderService[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }>;

  findById(id: string): Promise<IProviderService | null>;
}
