import express, { Application } from "express";
import { Logger } from "./utils/logger";
import config from "config";
import BaseController from "./controllers/base.controller";
import cors from "cors";
import bodyParser from "body-parser";
import swaggerUI from "swagger-ui-express";
import { swaggerDocument } from "../swagger/swagger";
import { connect } from "./utils/database";
import { serializeError } from "serialize-error";
import { Server } from "http";
const options = {
    swaggerOptions: {
        docExpansion: "none",
    },
};

const logger = Logger.createLogger(__filename);
class App {
    public app: Application;
    public port: number;
    private static server: Server;

    constructor(appInit: {
        port: number;
        /*eslint-disable-next-line*/
        middleWares: any;
        controllers: Array<BaseController>;
    }) {
        this.app = express();
        this.port = appInit.port;
        if (process.env.NODE_ENV !== "test") {
            connect();
        }

        this.middlewares(appInit.middleWares);
        this.routes(appInit.controllers);
        this.app.use(
            "/docs",
            swaggerUI.serve,
            swaggerUI.setup(swaggerDocument, options)
        );
    }

    private middlewares(middleWares: {
        /*eslint-disable-next-line*/
        forEach: (arg0: (middleWare: any) => void) => void;
    }) {
        this.app.use(express.json());
        this.app.use(cors());

        this.app.use(bodyParser.urlencoded({ extended: true }));
        middleWares.forEach((middleWare) => {
            this.app.use(middleWare);
        });
    }

    private routes(controllers: {
        forEach: (arg0: (controller: BaseController) => void) => void;
    }) {
        controllers.forEach((controller) => {
            this.app.use(config.get("base_url"), controller.router, this.catch);
        });
    }

    public catch(error: any, req: any, res: any, next: any) {
        const msg = {
            errorMessage: `INTERNAL_SERVER_ERROR`,
            errorDetail: serializeError(error),
        };
        logger.error(msg);
        msg.errorDetail.stack = undefined;
        res.status(500).send(msg);
    }

    public listen(): void {
        App.server = this.app.listen(this.port, () => {
            logger.info(`App listening on the http://localhost:${this.port}`);
        });
    }

    public async close(): Promise<void> {
        await App.server.close();
        logger.info("HTTP server closed");
        process.exit();
    }
}

export default App;
