import App from "./app";
import * as axios from "./utils/axios.init";
import {
    contextMiddleware,
    middleware as contextMiddlewareInit,
} from "./middleware/context";

import config from "config";
import ActivitiesController from "./controllers/activity.controller";


const port = process.env.PORT || config.get<number>("port");

const app = new App({
    port: <number>port,
    controllers: [
        new ActivitiesController(),
    ],
    middleWares: [contextMiddlewareInit, contextMiddleware],
});

axios.init();
if (process.env.NODE_ENV !== "test") {
    app.listen();
}

process.on("SIGINT", () => {
    app.close();
});

process.on("SIGTERM", () => {
    app.close();
});

export default app;
