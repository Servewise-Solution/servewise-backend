import type { IService } from "../model/serviceModel.interface.js";
import type {
  CreateServiceDTO,
  UpdateServiceDTO
} from "../DTO/repository/serviceRepository.dto.js";

export interface IServiceRepository {
  addService(data: CreateServiceDTO): Promise<IService>;

  editService(
    serviceId: string,
    updateData: UpdateServiceDTO
  ): Promise<IService>;

  softDeleteService(serviceId: string): Promise<IService>;

  getAllServices(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    vehicleCategoryId?: string;
    vehicleTypeId?: string;
    serviceCategoryId?: string;
    serviceTypeId?: string;
  }): Promise<{
    data: IService[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }>;

  findById(id: string): Promise<IService | null>;
}
