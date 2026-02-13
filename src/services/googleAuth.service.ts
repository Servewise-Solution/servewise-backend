import { injectable } from "tsyringe";
import { OAuth2Client } from "google-auth-library";
import { config } from "../config/env.js";
import type {
  IGoogleAuthService,
  GoogleUserInfo,
} from "../interfaces/infra/googleAuthService.interface.js";

@injectable()
export class GoogleAuthService implements IGoogleAuthService {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(config.GOOGLE_CLIENT_ID);
  }

  async verifyGoogleToken(token: string): Promise<GoogleUserInfo | null> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: config.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) return null;

      return {
        email: payload.email || "",
        email_verified: payload.email_verified || false,
        name: payload.name || "",
        picture: payload.picture || "",
        given_name: payload.given_name,
        family_name: payload.family_name,
        locale: payload.locale,
      };
    } catch (error) {
      console.error("Error verifying Google token:", error);
      return null;
    }
  }
}