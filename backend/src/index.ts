import createServiceContainer from "./container";
import initServices from "./services";
import http from "http";
import createApp from "./app";
import env from "./env";
import appConfig from "./config";

async function init() {
  
  const container = createServiceContainer();
  await initServices(container);

  const app = createApp(container);
  const { logger } = container;

  try {
    const PORT = +(env.PORT 
      ?? appConfig.DEFAULT_SERVER_PORT)
    
    const server = http.createServer(app);
    server.listen(PORT, () => {
      logger.info(`Server started on port ${PORT}`);
    })

  } catch (err: any) {
    logger.error(err.message);
  }
}

init()