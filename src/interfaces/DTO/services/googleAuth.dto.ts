export interface GoogleAuthRequest {
    token: string;
  }
  
  export interface GoogleAuthResponse {
    success: boolean;
    message: string;
    access_token?: string;
    refresh_token?: string;
    data?: {
      _id: string;
      username: string;
      email: string;
      phone?: number;
      image?: string;
      status: string;
    };
  }