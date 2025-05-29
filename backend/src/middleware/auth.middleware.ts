import e from "express";
import jwt from "jsonwebtoken";
import env from "../env";
import { authConfig } from "../config";
import createServiceContainer from "../container";


async function authMiddleware(
  req: e.Request, 
  res: e.Response, 
  next: e.NextFunction) {

    const { logger } = createServiceContainer();

    try {
      
      const token = req.cookies.jwt;
      if(!token) {
        res.status(401)
          .json({
            success: false,
            message: "unauthorized: token missing"
          })
        return;
      }

      const decodedToken = await jwt.verify(
        token, 
        env.JWT_SECRET || authConfig.JWT_SECRET
      )

      if(!decodedToken) {
         res.status(401)
          .json({
            success: false,
            message: "unauthorized: invalid token"
          })
        return;
      }

      req.decodedToken = decodedToken
      next();

    } catch (err: any) {
      logger.error(err);
      res.status(500)
        .json({
          success: false,
          message: err.message || "auth middleware error"
        })
    }
}

export default authMiddleware;