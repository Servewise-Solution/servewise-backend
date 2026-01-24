import type { Request, Response } from "express";
import { injectable } from "tsyringe";

@injectable()
export class AuthController {
  constructor() {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      console.log("entered to the register function in the auth controller");
    } catch (error) {}
  }
}
