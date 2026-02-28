import type { IApplicantResponse } from "../DTO/services/providerService.dto.js";

export interface IApplicantsService {
  getAllApplicants(options: {
    page?: number;
    limit?: number;
  }): Promise<{
    success: boolean;
    message: string;
    data?: {
      users: IApplicantResponse[];
      pagination: {
        total: number;
        page: number;
        pages: number;
        limit: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    };
  }>;

  saveProviderVerificationDetails(
    providerId: string,
    data: any,
    files?: {
      [fieldname: string]: Express.Multer.File[];
    },
  ): Promise<{
    success: boolean;
    message: string;
    data?: {
      isVerified?: boolean;
      status?: string;
    };
  }>;

  acceptProvider(
    providerId: string,
  ): Promise<{ success: boolean; message: string }>;

  rejectProvider(
    providerId: string,
    rejectReason: string,
  ): Promise<{ success: boolean; message: string }>;
}