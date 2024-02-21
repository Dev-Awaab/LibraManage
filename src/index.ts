import logger from "./log";
import Server from "./server";

Server.start();

process.on("uncaughtException", (err: Error) => {
  logger.fatal(err, "[UncaughtException]");
});

process.on("unhandledRejection", (err: Error) => {
  logger.fatal(err, "[UnhandledRejection]");
});
