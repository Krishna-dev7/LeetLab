import multer from "multer";
import WinstonLogger from "../services/logger/winston";
import AuthService from "../services/auth/auth-service"
import { ProblemService } from "../services";

interface IContainer {
  multer: multer.Multer;
  logger: WinstonLogger;
  getService: <T>(name: string) => T;
  register: <T>(name: string, service: T) => boolean;
}

class ServiceContainer implements IContainer {
  private static instance: ServiceContainer;

  public multer: multer.Multer;
  public logger: WinstonLogger;
  private services: Map<string, any>;
  
  private constructor() {
    this.multer = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024
      },
    });

    this.logger = new WinstonLogger();
    this.services = new Map<string, any>();
  }

  public register<T>(name: string, service: T): boolean {
    if(!this.services)
      throw new Error("Service container is not initialized");

    this.services.set(name, service);
    return true;
  }

  public getService<T>(name: string): T {
    if(!this.services.has(name)) {
      throw new Error(`Service ${name} not found`);
    }
    return this.services.get(name);
  }

  public static getInstance(): ServiceContainer {
    if(!this.instance) 
      this.instance = new ServiceContainer();

    return this.instance;
  }
}

function createServiceContainer(): ServiceContainer {
  return ServiceContainer.getInstance();
}

async function initServices(container: ServiceContainer) {
  const authService = new AuthService();
  const winstonLogger = new WinstonLogger();
  const problemService = new ProblemService(container);
  
  container.register("logger", winstonLogger);
  container.register("authService", authService);
  container.register("problemService", problemService);
}

export default createServiceContainer;
export { 
  initServices, 
  ServiceContainer 
};