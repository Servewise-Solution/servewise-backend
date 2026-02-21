export interface CreateServiceCategoryDTO {
    name: string;
    description?: string;
    audit: any;
  }
  
  export interface UpdateServiceCategoryDTO {
    name?: string;
    description?: string;
    audit?: any;
  }
  