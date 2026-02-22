export interface CreateVehicleCategoryDTO {
    name: string;
    description?: string;
    image?: string;
    audit: any; 
  }
  
  export interface UpdateVehicleCategoryDTO {
    name?: string;
    description?: string;
    image?: string;
    audit?: any;
  }
  