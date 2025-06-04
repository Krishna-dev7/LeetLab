import e from "express";
import { ServiceContainer } from "../../container";
import ProblemController from "./controller";
import authMiddleware, { checkAdmin } from "../../middleware/auth.middleware";

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
    authMiddleware,
    checkAdmin,
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