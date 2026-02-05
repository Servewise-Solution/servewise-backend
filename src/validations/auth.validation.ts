import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().min(2),
  phone: z.string().min(10),
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(4),
  purpose: z.enum(["REGISTRATION", "PASSWORD_RESET"]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const resendOtpSchema = z.object({
  email: z.string().email(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
