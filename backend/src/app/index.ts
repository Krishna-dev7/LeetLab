import { ServiceContainer } from "../container";
import cors from "cors";
import express, { Application } from "express";
import * as healthCheckRouter from "./routes/health-check";

function createApp(container: ServiceContainer): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (req, res) => {
    res.send("Hello")
  })

  // register routes
  healthCheckRouter.register(app, container)

  
  // fallback route
  app.use("{*any}", (req, res, next) => {
    res.status(404).send("Page not found");
  })

  return app;
}

export default createApp;