export interface IConfig {
  PORT: number;
  MONGODB_URI: string;
  CLIENT_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_EXPIRATION: string;
  JWT_REFRESH_EXPIRATION: string;
  REFRESH_TOKEN_COOKIE_MAX_AGE: number;
  REDIS_HOST: string;
  REDIS_PORT: number;
}
