import * as express from "express";
import * as expressHttpContext from "express-http-context";

import { Logger } from "../utils/logger";
const logger = Logger.createLogger(__filename);

export const middleware = expressHttpContext.middleware;
// const uuidv4 = require('uuid').v4
export const contextMiddleware: (
  request: express.Request,
  response: express.Response,
  next: () => void
) => Promise<void> = async (
  request: express.Request,
  response: express.Response,
  next: () => void
) => {
    //to avoid logging of healthchecks
    if (["/iati/live", "/iati/ready"].includes(request.path)) {
      next();
      return;
    }

    // Seteo la URI del recurso consumido
    const protocol = request.headers["x-forwarded-proto"] || request.protocol;
    const host = request.headers["x-forwarded-host"] || request.get("host");
    // serapar url de path
    const correlationId = request.headers["x-correlation-id"];
    const token = request.headers["x-token"];

    expressHttpContext.set("x-correlation-id", correlationId);

    if (process.env.NODE_ENV !== "test") {
      const start = new Date().getTime();
      response.on("finish", () => {
        logger.info({
          message: "End request",
          statusMessage: response.statusMessage,
          statusCode: response.statusCode,
          executionTime: new Date().getTime() - start,
        });
      });

      logger.info({
        message: "Begin request",
        url: protocol + "://" + host,
        url_path: request.originalUrl,
        params: request.params,
        query: request.query,
        headers: request.headers,
        body: request.body,

        via: request.headers["via"],
        "x-correlationid": request.headers["x-correlationid"],
        "x-token": token,
        remoteIp:
          request.headers["x-forwarded-for"] || request.connection.remoteAddress,
        "x-user-id": request.headers["x-user-id"],
      });
    }
    next();
  };
