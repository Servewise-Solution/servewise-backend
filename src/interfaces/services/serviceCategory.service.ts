export interface IServiceCategoryService {
    createServiceCategory(data: {
      name: string;
      description?: string;
      adminId: string;
    }): Promise<{ success: boolean; message: string }>;
  
    updateServiceCategory(
      id: string,
      data: {
        name?: string;
        description?: string;
        adminId: string;
      }
    ): Promise<{ success: boolean; message: string }>;
  
    deleteServiceCategory(
      id: string
    ): Promise<{ success: boolean; message: string }>;
  
    getAllServiceCategories(options: any): Promise<any>;
  }
  