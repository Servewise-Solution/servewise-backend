export interface CreateAccount {
  email: string;
  password: string;
  role: "USER" | "PROVIDER" | "ADMIN"; 
}
