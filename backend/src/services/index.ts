// registering all services
import type { ServiceContainer } from "../container";
import winstonLogger from "./logger/winston";


async function initServices(container: ServiceContainer) {
  container.register("logger", winstonLogger);
}

export default initServices;