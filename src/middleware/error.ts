import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import HttpException from "../utils/HttpException";

/*eslint-disable-next-line*/
export const errorMiddleware = (error: HttpException, request: Request, response: Response, next:NextFunction): void => {
  const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = error.message || ReasonPhrases.INTERNAL_SERVER_ERROR;

  response.status(status).send({
    status,
    message,
  });
};
