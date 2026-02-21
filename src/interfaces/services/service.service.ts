export interface IServiceService {
    createService(data: {
      vehicleCategoryId: string;
      vehicleTypeId: string;
      serviceCategoryId: string;
      serviceTypeId: string;
      name: string;
      description?: string;
      basePrice: number;
      isPriceFlexible?: boolean;
      estimatedDuration: number;
      adminId: string;
    }): Promise<{ success: boolean; message: string }>;
  
    updateService(
      id: string,
      data: {
        vehicleCategoryId?: string;
        vehicleTypeId?: string;
        serviceCategoryId?: string;
        serviceTypeId?: string;
        name?: string;
        description?: string;
        basePrice?: number;
        isPriceFlexible?: boolean;
        estimatedDuration?: number;
        adminId: string;
      }
    ): Promise<{ success: boolean; message: string }>;
  
    deleteService(id: string): Promise<{ success: boolean; message: string }>;
  
    getAllServices(options: any): Promise<any>;
  }
  