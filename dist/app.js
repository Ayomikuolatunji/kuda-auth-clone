"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("./modules/auth/auth.controller"));
const v1Api = (0, express_1.default)();
v1Api.use(express_1.default.json());
v1Api.use('/v1/auth', auth_controller_1.default);
exports.default = v1Api;
