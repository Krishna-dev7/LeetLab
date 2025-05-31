import { ServiceContainer } from "../container";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "../env";
import express, { Application } from "express";

// router imports
import * as healthCheckRouter from "./health-check";
import * as authRouter from "./auth";
import * as problemRouter from "../app/problem";


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
  healthCheckRouter.register(app, container);
  authRouter.register(app, container);
  problemRouter.register(app, container);
  
  // fallback route
  app.use("{*any}", (req, res, next) => {
    res.status(404).send("Page not found");
  })

  return app;
}

export default createApp;