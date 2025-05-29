import { JwtPayload } from "jsonwebtoken";


declare module "express" {
  export interface Request {
    decodedToken?: string | JwtPayload;
  }
}