export interface IRegisterData {
  username: string;
  email: String;
  password: string;
  phone: number;
}

export interface IRegisterResponse {
  success: boolean;
  message: string;
  data: {
    email?: string;
  };
}
