import e from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import env from "../env";
import { authConfig } from "../config";
import createServiceContainer from "../container";
import db from "../db";


async function authMiddleware(
  req: e.Request, 
  res: e.Response, 
  next: e.NextFunction) {

    const container = createServiceContainer();
    const { logger } = container;

    try {
      
      const token = req.signedCookies.jwt;
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
      ) as JwtPayload

      if(!decodedToken) {
         res.status(401)
          .json({
            success: false,
            message: "unauthorized: invalid token"
          })
        return;
      }

      const userData = await db.user.findUnique({
        where: {id: decodedToken.id}
      })

      if(!userData) {
        res.status(401)
          .json({
            success: false,
            message: "unauthorized: user not found"
          })
        return;
      }

      req.userData = userData;
      next();

    } catch (err: any) {
      logger.error(err);
      res.status(500)
        .json({
          success: false,
          message: "auth middleware error",
          error: err.message || err
        })
    }
}



function checkAdmin(
  req: e.Request, 
  res: e.Response, 
  next: e.NextFunction) {

    const container = createServiceContainer();
    const {logger} = container
    try {

      const userData = req.userData as JwtPayload;

      if(userData.role != "ADMIN" ) {
        res.status(401)
          .json({
            success: false,
            message: "You don't have persmission to create a problem"
          })
        return;
      }
      

      next();
      
    } catch (err:any) {
      logger.error(err);
      res.status(500)
        .json({
          success: false,
          message: "checkAdmin: problem during admin check",
          error: err.message
        })
    }
  
}

export default authMiddleware;

export {
  checkAdmin
}