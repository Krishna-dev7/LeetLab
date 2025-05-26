import express from "express";
import type { ServiceContainer } from "../../../container";
import HealthCheckController from "./controller"

function register(
  server: express.Application, 
  container: ServiceContainer ) {

    const router = express.Router();
    const controller = new HealthCheckController();
    
    router.get("/", controller.healthCheck)
    
    
    server.use("/health-check", router);
}

export {
  register
}