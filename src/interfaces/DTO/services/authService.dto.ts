import type { Types } from "mongoose";
import type { IUser } from "../../model/userModel.interface.js";

export interface IRegisterData {
  username: string;
  email: string;
  password: string;
  phone: number;
}

export interface IRegisterResponse {
  success: boolean;
  message: string;
  data?: {
    email?: string;
  };
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

export interface PendingUserData {
  username: string;
  email: string;
  password: string; 
  phone: number;
  role: "USER" | "PROVIDER" | "ADMIN";
}

export interface LoginUserData {
  _id: Types.ObjectId;
  username: string;
  email: string;
  phone: number;
  image: string;
  status: "Active" | "Blocked";
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: LoginUserData;
  access_token?: string;
  refresh_token?: string;
}


export interface LoginData {
  email: string;
  password: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
  email?: string;
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