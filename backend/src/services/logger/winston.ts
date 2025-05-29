import path from "path";
import winston from "winston";

interface ILogger {
  info:  (message: string) => void;
  error: (error: any) => void
  debug: (message: string) => void
  warn:  (message: string) => void
}

class WinstonLogger implements ILogger {
  private logger: winston.Logger;
  private currentDate: string;
  private errorFilePath: string;
  private logFilePath: string;

  public constructor(){
    this.currentDate = this.getDateString();
    const errorDir = path
      .join(process.cwd(), "logs", "errors")
    const combinedLogDir = path
      .join(process.cwd(), "logs", "combined")

    this.logFilePath = this.getFilePath(
      combinedLogDir,
      this.currentDate
    )
    this.errorFilePath = this.getFilePath(
      errorDir,
      this.currentDate
    )

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
          filename: this.logFilePath
        }),
        new winston.transports.File({
          filename: this.errorFilePath,
          level: "error"
        })
      ]
    })
  }

  public info(message: string) {
    this.rotateFileIfNeeded();
    this.logger.info(message);
  }

  public error(err: any) {
    this.rotateFileIfNeeded();
    this.logger.error(err.message || err);
  }

  public warn(message: string){
    this.rotateFileIfNeeded();
    this.logger.warn(message);
  }

  public debug(message: string){
    this.rotateFileIfNeeded();
    this.logger.debug(message);
  }

  private getFilePath(basepath: string, name: string) {
    return path.join(basepath,`${name}.log`);
  }

  private getDateString(): string {
    const date = new Date();
    return date.toISOString().split('T')[0];
  }

  private rotateFileIfNeeded() {
    const newDate = this.getDateString();
    if(this.currentDate == newDate) return

    this.currentDate = newDate;

    // clear and add new transports
    this.logger.clear()
    
    this.logger
      .add(new winston.transports.File({
        filename: this.logFilePath,
        level: "info"
      }))

    this.logger
      .add(new winston.transports.File({
        filename: this.errorFilePath,
        level: "error"
      }))
    
  }
}


export default WinstonLogger;