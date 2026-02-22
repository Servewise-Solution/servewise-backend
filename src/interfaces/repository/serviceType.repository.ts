import type { IServiceType } from "../model/serviceTypeModel.interface.js";
import type {
  CreateServiceTypeDTO,
  UpdateServiceTypeDTO
} from "../DTO/repository/serviceTypeRepository.dto.js";

export interface IServiceTypeRepository {
  addServiceType(data: CreateServiceTypeDTO): Promise<IServiceType>;

  editServiceType(
    serviceTypeId: string,
    updateData: UpdateServiceTypeDTO
  ): Promise<IServiceType>;

  softDeleteServiceType(serviceTypeId: string): Promise<IServiceType>;

  getAllServiceTypes(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    categoryId?: string;
  }): Promise<{
    data: IServiceType[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }>;

  findById(id: string): Promise<IServiceType | null>;
}
