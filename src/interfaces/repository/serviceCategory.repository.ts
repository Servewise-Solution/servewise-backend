import type { IServiceCategory } from "../model/serviceCategoryModel.interface.js";
import type {
  CreateServiceCategoryDTO,
  UpdateServiceCategoryDTO
} from "../DTO/repository/serviceCategoryRepository.dto.js";

export interface IServiceCategoryRepository {
  addServiceCategory(
    data: CreateServiceCategoryDTO
  ): Promise<IServiceCategory>;

  editServiceCategory(
    categoryId: string,
    updateData: UpdateServiceCategoryDTO
  ): Promise<IServiceCategory>;

  softDeleteServiceCategory(
    categoryId: string
  ): Promise<IServiceCategory>;

  getAllServiceCategories(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{
    data: IServiceCategory[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }>;

  findById(id: string): Promise<IServiceCategory | null>;
}
