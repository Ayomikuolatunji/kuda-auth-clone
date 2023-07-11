import { NextFunction, Request, Response } from "express";
import { Error } from "../interfaces/error-interfaces";
import { StatusCodes } from "http-status-codes";
import { validationResult } from "express-validator";

class ErrorHandler {
  public static handleServerError(
    error: any,
    req: Request | any,
    res: Response,
    next: NextFunction
  ): void {
    const message = error.message;
    const status = error.statusCode || 500;
    console.log("Error Message", message);
    const errors = validationResult(req);
    if (error.validationError) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors?.array(), message: "Validation error" });
    } else {
      res.status(status).json({
        message: message,
        error: "Error message",
        errorStatus: status,
      });
    }
    next();
  }
  public static throwError = (
    errorMsg: string,
    statusCode: number,
    validationError?: boolean
  ) => {
    const error: Error = new Error(errorMsg);
    error.statusCode = statusCode;
    error.validationError = validationError;
    throw error;
  };
}
export const handleServerError = ErrorHandler.handleServerError;
export const throwError = ErrorHandler.throwError;
