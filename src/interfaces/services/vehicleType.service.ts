export interface IVehicleTypeService {
    createVehicleType(data: {
      name: string;
      category: string;
      seatingCapacity?: number;
      adminId: string;
    }): Promise<{ success: boolean; message: string }>;
  
    updateVehicleType(
      id: string,
      data: {
        name?: string;
        category?: string;
        seatingCapacity?: number;
        adminId: string;
      }
    ): Promise<{ success: boolean; message: string }>;
  
    deleteVehicleType(
      id: string
    ): Promise<{ success: boolean; message: string }>;
  
    getAllVehicleTypes(options: any): Promise<any>;
  }
  