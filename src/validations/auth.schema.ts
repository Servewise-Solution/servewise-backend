import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email"),
  username: z.string().min(3, "Username too short"),
  password: z.string().min(6, "Password must be at least 6 chars"),
  phone: z.string().min(10, "Invalid phone number"),
  role: z.enum(["user", "provider"]),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
