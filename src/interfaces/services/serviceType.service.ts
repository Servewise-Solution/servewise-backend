export interface IServiceTypeService {
    createServiceType(data: {
      name: string;
      category: string;
      description?: string;
      adminId: string;
    }): Promise<{ success: boolean; message: string }>;
  
    updateServiceType(
      id: string,
      data: {
        name?: string;
        category?: string;
        description?: string;
        adminId: string;
      }
    ): Promise<{ success: boolean; message: string }>;
  
    deleteServiceType(
      id: string
    ): Promise<{ success: boolean; message: string }>;
  
    getAllServiceTypes(options: any): Promise<any>;
  }
  