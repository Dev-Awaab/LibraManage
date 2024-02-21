import {
  Application,
  express,
  NextFunction,
  Request,
  Response,
  Server,
} from "../types";
import Config from "../config";
import { logRequestMiddleware } from "../log";
import { connection, createPgAdapter } from "../database";

const startNewApplication = (): Application => {
  const app = express();

  app.set("port", Config.port);

  // parse request body
  app.use(express.json());

  // parse query string using querystring library
  app.use(express.urlencoded({ extended: false }));

  // set headers
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,PUT,PATCH,POST,DELETE,OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Accept, Content-Length, Content-Type, Authorization"
    );
    next();
  });

  // log request
  app.use(logRequestMiddleware());

  app.get("/", (req: Request, res: Response) => {
    return res.status(200).json({
      message: `Welcome to Book Management API`,
    });
  });

  return app;
};

export const createNewServer = (): Server => {
  const app = startNewApplication();

  // create db connection
  const DB = createPgAdapter(connection);


  const server: Server = {
    app,
  };

  // create the express router
  const router = express.Router();

  // mount routes

  app.use("/api", router);

  return server;
};
