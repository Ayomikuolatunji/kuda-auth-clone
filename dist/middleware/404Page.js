"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageNotFound = void 0;
const http_status_codes_1 = require("http-status-codes");
const pageNotFound = (req, res) => res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("API route does not exist");
exports.pageNotFound = pageNotFound;
