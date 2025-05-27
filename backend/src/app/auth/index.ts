import express from "express";
import type { ServiceContainer } from "src/container";
import AuthController from "./controller";


function register(
  server: express.Application,
  container: ServiceContainer
) {
    const router = express.Router();
    const controller = new AuthController(container);


    router.post("/signup", controller.signup.bind(controller))
    router.post("/login", controller.login.bind(controller))
    router.get("/forgot-password", 
      controller.forgotPassword.bind(controller))
    router.get("/logout", controller.logout.bind(controller))
    router.get("/verify", controller.forgotPassword.bind(controller))
    router.get("/change-password", 
      controller.changePassword.bind(controller))


    server.use("/auth", router);

}


export {
  register
}