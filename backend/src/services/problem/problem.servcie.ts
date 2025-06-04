import { AxiosError } from "axios";
import * as z from "zod";

import { ServiceContainer } from "../../container";
import problemSchema from "../../schemas/problem.schema";
import WinstonLogger from "../logger/winston";
import db from "../../db";

import getLanguageId, {
  Languages,
  pollBatchResults,
  submitBatch
} from "../../lib/judge0";



interface ProblemServiceResponse {
  success: boolean;
  data?: any;
  err?: {
    errMessage: string,
    errObj?: any
  }
}

class ServiceResponse implements ProblemServiceResponse {
  success: boolean;
  data?: any;
  err?: { errMessage: string, errObj?: any };

  constructor({
    success,
    data,
    err
  }: ProblemServiceResponse) {
    this.success = success;
    this.data = data
    this.err = err;
  }
}


class ProblemService {

  logger: WinstonLogger;

  constructor(container:ServiceContainer) {
    this.logger = container.logger
  }

  public async createProblem(
    data: z.infer<typeof problemSchema>,
    userId: string
  ): Promise<ProblemServiceResponse>{

    try {
      const problemData = {...data, userId}
      const { 
        referenceSolutions, 
        testcases 
      } = problemData

      for(const [language, solutionCode] 
        of Object.entries(referenceSolutions)){
          
          const languageId = getLanguageId(
            language.toLowerCase() as Languages);

          if(!languageId) {
            return new ServiceResponse({
              success: false,
              err: {errMessage: "Language not supported" }
            })
          }

          const submissions = testcases.map( 
            ({input, output}) => ({
              source_code: solutionCode,
              language_id: languageId,
              stdin: input,
              expected_output: output
            }) 
          )

          let submissionResult: Array<{token:string}>;

          try {
            submissionResult = await submitBatch(submissions)

          } catch (err:any) {

            this.logger.error(err);
            return new ServiceResponse({
              success: false,
              err: {
                errMessage: (err as AxiosError).message
                  || "Something went wrong", 
                errObj: err
              }})
          }

          const tokens = submissionResult.map(({token}) => token );
          const results = await pollBatchResults(tokens);

          for(let i=0; i<results.length; i++) {
            if(results[i].status.id != 3) {
              return new ServiceResponse({
                success: false,
                err: {
                  errMessage: `testcase${i+1} failed for language ${language}`,
                  errObj: results[i]
                }
              })
            }

            continue;
          }
      }

      // creating problem and store them into db
      const newProblem = await db.problem.create({
        data:  problemData
      })
      
      return new ServiceResponse({
        success: true,
        data: newProblem
      });
    
    } catch (err:any) {
      return new ServiceResponse({
        success: false,
        data: null,
        err: {
          errMessage: err.message 
            || "error while creating problem" ,
          errObj: err
        }
      })   
    }
  }
}


export default ProblemService;