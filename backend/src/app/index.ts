import { ServiceContainer } from "../container";
import cors from "cors";
import express, { Application } from "express";
import * as healthCheckRouter from "./health-check";
import * as authRouter from "./auth";
import cookieParser from "cookie-parser";
import env from "../env";

function createApp(container: ServiceContainer): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(env.JWT_SECRET));

  app.get("/", (_, res) => {
    res.send("Hello")
  })

  // register routes
  healthCheckRouter.register(app, container)
  authRouter.register(app, container)
  
  // fallback route
  app.use("{*any}", (req, res, next) => {
    res.status(404).send("Page not found");
  })

  return app;
}

export default createApp;