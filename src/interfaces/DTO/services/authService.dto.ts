export interface IRegisterData {
  username: string;
  email: string;
  password: string;
  phone: number;
  role: "USER" | "PROVIDER" | "ADMIN"; 
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