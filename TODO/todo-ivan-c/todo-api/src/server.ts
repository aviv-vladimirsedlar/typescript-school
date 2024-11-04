import { Server } from "http";
import app from "./app";
import { sequelize } from "./config/database";
import logger from "./config/logger";

const PORT = process.env.PORT || 8080;

let server: Server;

// Create a promise that resolves when both the server and database are ready
export const serverReadyPromise: Promise<Server> = sequelize
  .sync()
  .then(() => {
    logger.info("Database synced");
    return new Promise<Server>((resolve) => {
      server = app.listen(PORT, () => {
        logger.info(`Server started on PORT ${PORT}`);
        resolve(server);
      });
    });
  })
  .catch((error) => {
    logger.error(`Error during server startup: ${error}`);
    throw error;
  });

export { server, sequelize };
