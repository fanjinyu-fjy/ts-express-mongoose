import HttpException from "src/exceptions/HttpException";
import { Request, Response, NextFunction } from "express";
import { INTERNAL_SERVER_ERROR } from "http-status-codes";

const errorMiddleware = (
  error: HttpException,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.status || INTERNAL_SERVER_ERROR;
  const message = error.message || "Something Error Happened";

  res.status(status).json({
    success: false,
    message,
    error: error.errors
  });
  next();
};

export default errorMiddleware;
