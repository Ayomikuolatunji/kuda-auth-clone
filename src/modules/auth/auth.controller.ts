import express, { NextFunction, Request } from 'express';
import AuthService from './auth.service';
import { throwError } from '../../middleware/requestErrorHandler';
import { StatusCodes } from 'http-status-codes';
import { LoginPayload, ResendOtpPayload, SignUpPayload } from './types';
import { validationResult } from 'express-validator';
import { ValidationRules } from './auth.validation';
import { RequestHandler } from 'express';


class AuthController {
    public router = express.Router();
    private authService = AuthService;
    private validation = ValidationRules
    constructor() {
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.post('/login', this.validation.login, this.login);

        this.router.post("/signup", this.validation.signup, this.signup)

        this.router.post("/resend-otp", this.validation.resendOtp, this.resendOtp);

        this.router.put("/create-profile/:userId", this.validation.createProfile, this.updateProfile)

        this.router.post("/verify-email", this.validation.verifyEmail, this.verifyEmail)
    }
    private validate(req: Request, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throwError("Validation error", StatusCodes.BAD_REQUEST, true);
                return
            }
        } catch (error) {
            next(error)
        }
    }
    private login: RequestHandler = async (req, res, next) => {
        this.validate(req, next)
        const loginPayload: LoginPayload = req.body;
        try {
            const response = await this.authService.login(loginPayload);
            res.status(StatusCodes.OK).json({ message: "Login successful", data: response });
        } catch (error: any) {
            next(error)
        }
    };
    private signup: RequestHandler = async (req, res, next) => {
        this.validate(req, next)
        const signUpPayload: SignUpPayload = req.body;
        try {
            const response = await this.authService.signup(signUpPayload);
            console.log(response);
            res.status(StatusCodes.OK).json({ message: "Account created successfully", data: response });
        } catch (error: any) {
            next(error)
        }
    }
    private updateProfile: RequestHandler = async (req, res, next) => {
        try {
            const response = await this.authService.createProfile(req.params.userId, req.body)
            res.status(StatusCodes.OK).json(response)
        } catch (error) {
            next(error)
        }
    }
    private resendOtp: RequestHandler = async (req, res, next) => {
        this.validate(req, next)
        const resendOtpPayload: ResendOtpPayload = req.body;
        try {
            await this.authService.resendOtp(resendOtpPayload.email);
            res.status(StatusCodes.OK).json({ message: 'OTP resent successfully.' });
        } catch (error: any) {
            next(error)
        }
    };
    private verifyEmail: RequestHandler = async (req, res, next) => {
        try {
            this.validate(req, next)
            await this.authService.verifyEmail(req.body)
            res.status(StatusCodes.OK).json({ message: "Email verified successfully" })
        } catch (error) {
            next(error)
        }
    }
}

export default new AuthController().router;
