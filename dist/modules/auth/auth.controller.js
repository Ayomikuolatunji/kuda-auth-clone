"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_service_1 = __importDefault(require("./auth.service"));
const requestErrorHandler_1 = require("../../middleware/requestErrorHandler");
const http_status_codes_1 = require("http-status-codes");
const express_validator_1 = require("express-validator");
const auth_validation_1 = require("./auth.validation");
class AuthController {
    constructor() {
        this.router = express_1.default.Router();
        this.authService = auth_service_1.default;
        this.validation = auth_validation_1.ValidationRules;
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            this.validate(req, next);
            const loginPayload = req.body;
            try {
                const response = yield this.authService.login(loginPayload);
                res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Login successful", data: response });
            }
            catch (error) {
                next(error);
            }
        });
        this.signup = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            this.validate(req, next);
            const signUpPayload = req.body;
            try {
                const response = yield this.authService.signup(signUpPayload);
                console.log(response);
                res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Account created successfully", data: response });
            }
            catch (error) {
                next(error);
            }
        });
        this.updateProfile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.authService.createProfile(req.params.userId, req.body);
                res.status(http_status_codes_1.StatusCodes.OK).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.resendOtp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            this.validate(req, next);
            const resendOtpPayload = req.body;
            try {
                yield this.authService.resendOtp(resendOtpPayload.email);
                res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'OTP resent successfully.' });
            }
            catch (error) {
                next(error);
            }
        });
        this.verifyEmail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.validate(req, next);
                yield this.authService.verifyEmail(req.body);
                res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Email verified successfully" });
            }
            catch (error) {
                next(error);
            }
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/login', this.validation.login, this.login);
        this.router.post("/signup", this.validation.signup, this.signup);
        this.router.post("/resend-otp", this.validation.resendOtp, this.resendOtp);
        this.router.put("/create-profile/:userId", this.validation.createProfile, this.updateProfile);
        this.router.post("/verify-email", this.validation.verifyEmail, this.verifyEmail);
    }
    validate(req, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                (0, requestErrorHandler_1.throwError)("Validation error", http_status_codes_1.StatusCodes.BAD_REQUEST, true);
                return;
            }
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new AuthController().router;
