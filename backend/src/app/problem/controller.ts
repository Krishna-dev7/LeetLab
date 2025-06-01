import e from "express";
import 
  createServiceContainer, 
  { ServiceContainer } from "src/container";
import { WinstonLogger } from "src/services";

class ProblemController {
  private container: ServiceContainer;  
  private logger: WinstonLogger;

  constructor() {
    this.container = createServiceContainer();
    this.logger = this.container.logger;
  }


  async create(
    req: e.Request,
    res: e.Response
  ) {
    
    try {
      


    } catch (err:any) {
      this.handleError(err, res)
    }

  }

  async streamProblems() {}
  async getProblem() {}
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