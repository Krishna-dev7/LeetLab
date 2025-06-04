import e from "express";
import 
  createServiceContainer, 
  { ServiceContainer } from "../../container";
import problemSchema from "../../schemas/problem.schema";
import { WinstonLogger } from "../../services";
import ProblemService from "src/services/problem/problem.servcie";
import { User } from "src/generated/prisma";

class ProblemController {
  private container: ServiceContainer;  
  private logger: WinstonLogger;
  private problemService: ProblemService;

  constructor() {
    this.container = createServiceContainer();
    this.logger = this.container.logger;
    this.problemService = this.container.getService("problemService");
  }

  async create(
    req: e.Request,
    res: e.Response
  ) {
    
    try {
      
      const data = req.body;
      const isValid = problemSchema.safeParse(data);
      const user = req.userData as User;

      if(!isValid.success) {
        res.status(401)
          .json({
            success: false,
            message: "credentials missing",
            error: {
              message: isValid.error.message
            }
          })

        return;
      }

      const problemResponse = await this.problemService
        .createProblem(data, user.id);

      res.status(201)
        .json({
          success: true,
          message: "problem created successfully",
          data: problemResponse
        })

    } catch (err:any) {
      this.handleError(err, res)
    }

  }

  async getProblem(req: e.Request, res: e.Response) {
    try {
      
      const id = req.params.id as string;

      if(!id) {
        res.status(400)
          .json({
            success: false,
            message: "id is missing"
          })
        return
      }

      const problem = await this.problemService
        .getProblemById(id);

      res.status(200)
        .json({
          success: true,
          message: "problem found",
          data: problem
        })

    } catch (err:any) {
      this.handleError(err, res)
    }
  }

  async streamProblems(req: e.Request, res: e.Response) {
    try {

      const problems = await this.problemService
        .streamProblems();

      res.status(200)
        .json({
          success: true,
          message: "data obtained",
          data: problems
        })
      
    } catch (err:any) {
      this.handleError(err, res)
    }
  }
  
  async updateProblem() {}
  async deleteProblem() {}
  async getAllProblemSolvedByUser() {}
  

  private handleError(err: any, res: e.Response){
    this.logger.error(err);
    res.status(500)
      .json({
        success: false,
        message: "ProblemController: error in controller",
        error: { message: err.message || err }
      })
  }

}


export default ProblemController;