import { createNewServer } from "./api/app";
import Config from "./config";
import logger from "./log";
import { HttpServer } from "./types";

let server: HttpServer;

export default {
  start(): Promise<HttpServer> {
    return new Promise((resolve) => {
      server = createNewServer().app.listen(Config.port, () => {
        if (Config.nodeEnv === "development") {
          logger.info({}, `(Book Management API server is LIVE ⚡️ on port: ${Config.port}`);
        }
        return resolve(server);
      });
    });
  },
  stop() {
    return new Promise((resolve) => {
      server.close(() => {
        return resolve(server);
      });
    });
  },
};
