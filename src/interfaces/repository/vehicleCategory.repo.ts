import type { CreateVehicleCategoryDTO, UpdateVehicleCategoryDTO } from "../DTO/repository/vehicleCategoryRepository.dto.js";
import type { IVehicleCategory } from "../model/vehicleCategoryModel.interface.js";


export interface IVehicleCategoryRepository {
  addVehicleCategory(data: CreateVehicleCategoryDTO): Promise<IVehicleCategory>;

  editVehicleCategory(
    categoryId: string,
    updateData: UpdateVehicleCategoryDTO
  ): Promise<IVehicleCategory>;

  softDeleteVehicleCategory(categoryId: string): Promise<IVehicleCategory>;

  getAllCategories(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{
    data: IVehicleCategory[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }>;

  findById(id: string): Promise<IVehicleCategory | null>;
}
