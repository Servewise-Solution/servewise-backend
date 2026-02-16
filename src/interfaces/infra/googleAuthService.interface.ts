export interface IGoogleAuthService {
    verifyGoogleToken(token: string): Promise<GoogleUserInfo | null>;
  }
  
  export interface GoogleUserInfo {
    email: string;
    email_verified: boolean;
    name: string;
    picture: string;
    given_name?: string | undefined;
    family_name?: string | undefined;
    locale?: string | undefined;
  }