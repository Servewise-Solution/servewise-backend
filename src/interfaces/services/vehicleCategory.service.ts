

export interface IVehicleCategoryService {
  createVehicleCategory(data: {
    name: string;
    description?: string;
    image?: string;
    adminId: string;
  }): Promise<{ success: boolean; message: string }>;

  updateVehicleCategory(
    id: string,
    data: {
      name?: string;
      description?: string;
      image?: string;
      adminId: string;
    }
  ): Promise<{ success: boolean; message: string }>;

  deleteVehicleCategory(
    id: string,
  ): Promise<{ success: boolean; message: string }>;

  getAllVehicleCategories(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<any>;
}
