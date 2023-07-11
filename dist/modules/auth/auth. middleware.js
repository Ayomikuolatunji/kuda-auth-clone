"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const requestErrorHandler_1 = require("../../middleware/requestErrorHandler");
const http_status_codes_1 = require("http-status-codes");
class AuthMiddleware {
    verifyToken(req, res, next) {
        const token = req.headers['x-access-token'];
        if (!token) {
            (0, requestErrorHandler_1.throwError)("No token provided", http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        jsonwebtoken_1.default.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                (0, requestErrorHandler_1.throwError)("Failed to authenticate token", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            }
            req.userId = decoded.id;
            next();
        });
    }
}
exports.default = new AuthMiddleware();
