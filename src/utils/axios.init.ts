/* eslint-disable  @typescript-eslint/no-explicit-any */
import * as axios from "axios";
import * as https from "https";
import * as expressHttpContext from "express-http-context";

import { Logger } from "./logger";
const logger = Logger.createLogger(__filename);

https.globalAgent.options.rejectUnauthorized = false;
export const init: () => void = () => {
  axios.default.interceptors.request.use((request) => {
    logger.info({
      message: "Internal Pre Request",
      url: request.url,
      method: request.method,
      data: request.data,
    });
    const correlationID = expressHttpContext.get("x-correlation-id");
    if (correlationID !== undefined)
      request.headers["x-correlation-id"] = correlationID;
    (<any>request).requestStartedAt = new Date().getTime();

    return request;
  });
  axios.default.interceptors.response.use(
    (response) => {
      const url = new URL(<string>response.config.url);
      logger.info({
        message: "Internal Request success",
        url: url.origin,
        url_path: url.pathname + url.search,
        method: response.config.method,
        timeout: response.config.timeout,
        statusCode: response.status,
        data: response.data,
        statusText: response.statusText,
        success: true,
        internalExecutionTime:
          new Date().getTime() - (<any>response.config).requestStartedAt,
      });
      return response;
    },
    (error) => {
      logger.error("Internal Request error", {
        url: error.config.url,
        method: error.config.method,
        timeout: error.config.timeout,
        statusCode: error.response && error.response.status,
        responseData: error.response && error.response.data,
        success: false,
        errorCode: error.code,
        errorMessage: error.message,
        internalExecutionTime:
          new Date().getTime() - error.config.requestStartedAt,
        ...error.config.meta,
      });

      return Promise.reject(error);
    }
  );
};
