import express from "express"

class HealthCheckController {

  public healthCheck(_: express.Request,
    res: express.Response){
      res.send("healthy");
  }

}

export default HealthCheckController;