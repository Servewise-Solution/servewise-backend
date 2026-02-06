import type { IUser } from "../../model/userModel.interface.js";


export interface SignupUserData {
  username: string;
  email: string;
  password: string;
  phone: number;
}

export interface SignUpUserResponse {
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
    IUser,
    "_id" | "username" | "email" | "phone" | "image" | "status"
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

export interface ToggleUserStatusResponse {
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

export interface PaginatedUserDto {
  _id: string;
  username: string;
  email: string;
  phone: number;
  status: "Active" | "Blocked";
}
