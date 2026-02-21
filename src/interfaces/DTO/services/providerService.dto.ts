import type { IProvider } from "../../model/providerModel.interface.js";
import type { IUser } from "../../model/userModel.interface.js";


export interface SignupProviderData {
  username: string;
  email: string;
  password: string;
  phone: number;
}

export interface SignUpProviderResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
  };
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
  email?: string;
}

export interface VerifyOtpData {
  otp: string;
  email: string;
  purpose?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: Pick<
    IProvider,
    "_id" | "username" | "email" | "phone"  | "status"
  >;
  access_token?: string;
  refresh_token?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  email?: string;
}

export interface ResetPasswordData {
  email: string;
  password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface ToggleProviderStatusResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    status: string;
  };
}
export interface AddMoneyResponse {
  success: boolean;
  message: string;
  data?: {
    checkoutUrl: string;
    sessionId: string;
    requiresPayment: boolean;
  };
}

export interface PaginatedProviderDto {
  _id: string;
  username: string;
  email: string;
  phone: number;
  status: "Active" | "Blocked" | "Pending" | "Rejected" |"Step2Rejected" |"Step2Approved";
}


export interface IApplicantResponse {
  id: string;
  username: string;
  email: string;
  phone: number;

  ownerName?: string;
  isVerified: boolean;
  status: string;

  yearsOfExperience?: number;
  premiseImage?: string;
  serviceAtOwnerPremise?: boolean;

  companyLicense?: string;

  bankDetails?: {
    accountHolderName?: string;
    accountNumber?: string;
    bankName?: string;
    ifscCode?: string;
    branchName?: string;
  };

  createdAt: Date;
  updatedAt: Date;
}
