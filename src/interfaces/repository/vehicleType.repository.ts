import type { IVehicleType } from "../model/vehicleTypeModel.interface.js";
import type {
  CreateVehicleTypeDTO,
  UpdateVehicleTypeDTO
} from "../DTO/repository/vehicleTypeRepository.dto.js";

export interface IVehicleTypeRepository {
  addVehicleType(data: CreateVehicleTypeDTO): Promise<IVehicleType>;

  editVehicleType(
    vehicleTypeId: string,
    updateData: UpdateVehicleTypeDTO
  ): Promise<IVehicleType>;

  softDeleteVehicleType(vehicleTypeId: string): Promise<IVehicleType>;

  getAllVehicleTypes(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    categoryId?: string;
  }): Promise<{
    data: IVehicleType[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }>;

  findById(id: string): Promise<IVehicleType | null>;
}
