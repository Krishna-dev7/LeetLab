import { JwtPayload } from "jsonwebtoken";
import { User } from "src/generated/prisma";


declare module "express" {
  export interface Request {
    userData?: string | User | JwtPayload;
  }
}