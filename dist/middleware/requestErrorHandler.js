"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwError = exports.handleServerError = void 0;
const http_status_codes_1 = require("http-status-codes");
const express_validator_1 = require("express-validator");
class ErrorHandler {
    static handleServerError(error, req, res, next) {
        const message = error.message;
        const status = error.statusCode || 500;
        console.log("Error Message", message);
        const errors = (0, express_validator_1.validationResult)(req);
        if (error.validationError) {
            res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({ errors: errors === null || errors === void 0 ? void 0 : errors.array(), message: "Validation error" });
        }
        else {
            res.status(status).json({
                message: message,
                error: "Error message",
                errorStatus: status,
            });
        }
        next();
    }
}
ErrorHandler.throwError = (errorMsg, statusCode, validationError) => {
    const error = new Error(errorMsg);
    error.statusCode = statusCode;
    error.validationError = validationError;
    throw error;
};
exports.handleServerError = ErrorHandler.handleServerError;
exports.throwError = ErrorHandler.throwError;
