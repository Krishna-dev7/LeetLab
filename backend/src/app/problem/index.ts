import e from "express";
import { ServiceContainer } from "src/container";
import ProblemController from "./controller";

function register(
  server: e.Application, 
  container: ServiceContainer ) {

  const router = e.Router();
  const logger = container.logger
  const problemController = new ProblemController();

  router.get(
    "/",
    problemController.streamProblems.bind(problemController)
  )

  router.get(
    "/get-problem/:id",
    problemController.getProblem.bind(problemController)
  )
  
  router.post(
    "/create-problem",
    problemController.create.bind(problemController)
  )

  router.put(
    "/update-problem",
    problemController.updateProblem.bind(problemController)
  )

  router.delete(
    "/delete-problem",
    problemController.deleteProblem.bind(problemController)
  )


  server.use("/problem", router)
}


export {
  register
}