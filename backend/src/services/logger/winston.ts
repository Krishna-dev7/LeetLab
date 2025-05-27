import winston from "winston";

interface ILogger {
  info: (message: string) => void;
  error: (error: any) => void
  debug: (message: string) => void
  warn: (message: string) => void
}

class WinstonLogger implements ILogger {
  private logger: winston.Logger;

  public constructor(){
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.prettyPrint()
      ),

      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: "combined.log"
        })
      ]
    })
  }

  public info(message: string) {
    this.logger.info(message);
  }

  public error(err: any) {
    this.logger.error(err.message || err);
  }

  public warn(message: string){
    this.logger.warn(message);
  }

  public debug(message: string){
    this.logger.debug(message);
  }
}


export default WinstonLogger;