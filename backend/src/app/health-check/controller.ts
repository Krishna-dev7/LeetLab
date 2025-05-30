import express from "express"

class HealthCheckController {

  public healthCheck(_: express.Request,
    res: express.Response){
      res.json({
        success: true,
        message: "Healthy"
      });
  }

}

export default HealthCheckController;