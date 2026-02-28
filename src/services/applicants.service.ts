import { inject, injectable } from "tsyringe";

import type { IProviderRepository } from "../interfaces/repository/provider.repository.js";
import type { IAddressRepository } from "../interfaces/repository/address.repository.js";
import type { IApplicantResponse } from "../interfaces/DTO/services/providerService.dto.js";
import type { IProvider } from "../interfaces/model/providerModel.interface.js";
import type { IEmailService } from "../interfaces/infra/emailService.interface.js";
import type { SendEmailOptions } from "../interfaces/infra/emailService.interface.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import type { IApplicantsService } from "../interfaces/services/applicants.service.js";

@injectable()
export class ApplicantsService implements IApplicantsService {
  constructor(
    @inject("IProviderRepository")
    private _providerRepository: IProviderRepository,

    @inject("IAddressRepository")
    private _addressRepository: IAddressRepository,

    @inject("IEmailService")
    private _emailService: IEmailService,
  ) {}

  // ===============================
  // GET ALL APPLICANTS
  // ===============================
  async getAllApplicants(options: { page?: number; limit?: number }) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 5;

      const result = await this._providerRepository.getAllApplicants({
        page,
        limit,
      });

      const mappedApplicants: IApplicantResponse[] = result.data.map(
        (app: IProvider) => ({
          id: app._id.toString(),
          username: app.username,
          email: app.email,
          phone: app.phone,
          ownerName: app.ownerName,
          isVerified: app.isVerified,
          status: app.status,
          yearsOfExperience: app.yearsOfExperience,
          ...(app.premiseImage && { premiseImage: app.premiseImage }),
          ...(app.serviceAtCustomerPremise !== undefined && {
            serviceAtCustomerPremise: app.serviceAtCustomerPremise,
          }),
          ...(app.businessLicense && { companyLicense: app.businessLicense }),
          ...(app.bankDetails && { bankDetails: app.bankDetails }),
          createdAt: app.createdAt!,
          updatedAt: app.updatedAt!,
        }),
      );

      return {
        success: true,
        message: "Applicants fetched successfully",
        data: {
          users: mappedApplicants,
          pagination: {
            total: result.total,
            page: result.page,
            pages: result.pages,
            limit,
            hasNextPage: result.page < result.pages,
            hasPrevPage: page > 1,
          },
        },
      };
    } catch (error) {
      console.error("Error fetching applicants:", error);
      return {
        success: false,
        message: "Something went wrong while fetching applicants",
      };
    }
  }

  // ===============================
  // SAVE PROVIDER DOCUMENTS
  // ===============================
  async saveProviderVerificationDetails(
    providerId: string,
    data: any,
    files?: { [fieldname: string]: Express.Multer.File[] },
  ) {
    try {
      let premiseImageUrl: string | undefined;
      let companyLicenseUrl: string | undefined;
      let ownerImageUrl: string | undefined;

      if (files?.premiseImage?.[0]) {
        premiseImageUrl = await uploadToCloudinary(
          files.premiseImage[0].path,
        );
      }

      if (files?.companyLicense?.[0]) {
        companyLicenseUrl = await uploadToCloudinary(
          files.companyLicense[0].path,
        );
      }

      if (files?.ownerImage?.[0]) {
        ownerImageUrl = await uploadToCloudinary(
          files.ownerImage[0].path,
        );
      }

      const updatedData = {
        ...data,
        premiseImage: premiseImageUrl,
        companyLicense: companyLicenseUrl,
        ownerImage: ownerImageUrl,
      };

      const {
        addressLine,
        city,
        state,
        pincode,
        location,
        ...providerData
      } = updatedData;

      let addressId = null;

      if (location?.coordinates) {
        const address = await this._addressRepository.upsertProviderAddress(
          providerId,
          { addressLine, city, state, pincode, location },
        );
        addressId = address._id;
      }

      const provider = await this._providerRepository.updateProviderDetails(
        providerId,
        {
          ...providerData,
          addressId,
          isVerified: false,
          status: "Pending",
        },
      );

      if (!provider) {
        return {
          success: false,
          message: "Failed to update provider details",
        };
      }

      return {
        success: true,
        message: "Documents submitted. Verification within 24 hours.",
        data: {
          isVerified: provider.isVerified,
          status: provider.status,
        },
      };
    } catch (error) {
      console.error("Error saving provider details:", error);
      throw new Error("Unable to save provider verification details");
    }
  }

  // ===============================
  // ACCEPT PROVIDER
  // ===============================
  async acceptProvider(providerId: string) {
    try {
      const updatedResult =
        await this._providerRepository.updateProviderDetails(providerId, {
          isVerified: true,
          status: "Step2Approved",
        });

      if (!updatedResult) {
        return { success: false, message: "Provider not found" };
      }

      return {
        success: true,
        message: "Provider approved successfully",
      };
    } catch (error) {
      console.error("Error approving provider:", error);
      throw new Error("Unable to approve provider");
    }
  }

  // ===============================
  // REJECT PROVIDER
  // ===============================
  async rejectProvider(providerId: string, rejectReason: string) {
    try {
      const updatedResult =
        await this._providerRepository.updateProviderDetails(providerId, {
          isVerified: false,
          status: "Step2Rejected",
          rejectionReason: rejectReason,
        });

      if (!updatedResult) {
        return { success: false, message: "Provider not found" };
      }

      const emailOptions: SendEmailOptions = {
        to: updatedResult.email,
        subject: "Provider Application Rejected",
        text: rejectReason,
        html: `<p>${rejectReason}</p>`,
      };

      await this._emailService.sendEmail(emailOptions);

      return {
        success: true,
        message: "Provider rejected successfully",
      };
    } catch (error) {
      console.error("Error rejecting provider:", error);
      throw new Error("Unable to reject provider");
    }
  }
}