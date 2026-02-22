export interface IProviderServiceService {
    createProviderService(data: {
      providerId: string;
      serviceId: string;
      proposedPrice: number;
      estimatedDuration?: number;
      actorId: string;
      actorRole: "ADMIN" | "PROVIDER";
    }): Promise<{ success: boolean; message: string }>;
  
    updateProviderService(
      id: string,
      data: {
        proposedPrice?: number;
        estimatedDuration?: number;
        actorId: string;
        actorRole: "ADMIN" | "PROVIDER";
      }
    ): Promise<{ success: boolean; message: string }>;
  
    approveProviderService(
      id: string,
      finalPrice: number,
      adminId: string
    ): Promise<{ success: boolean; message: string }>;
  
    rejectProviderService(
      id: string,
      reason: string,
      adminId: string
    ): Promise<{ success: boolean; message: string }>;
  
    deleteProviderService(id: string): Promise<{ success: boolean; message: string }>;
  
    getAllProviderServices(options: any): Promise<any>;
  }
  