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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const requestErrorHandler_1 = require("../../middleware/requestErrorHandler");
const http_status_codes_1 = require("http-status-codes");
const mail_1 = __importDefault(require("@sendgrid/mail"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const database_1 = __importDefault(require("../../database/database"));
dotenv_1.default.config();
class AuthService {
    login({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield database_1.default.user.findUnique({ where: { email } });
            if (!user) {
                (0, requestErrorHandler_1.throwError)('User not found', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            else {
                const passwordIsValid = bcryptjs_1.default.compareSync(password, user.password);
                if (!passwordIsValid) {
                    (0, requestErrorHandler_1.throwError)('Password is not valid', http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
                const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.SECRET, {
                    expiresIn: 86400,
                });
                return { token, id: user.id, emailVerified: user.emailVerified };
            }
        });
    }
    signup({ currency, email, password, referralCode }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield database_1.default.$transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                        const user = yield transaction.user.findUnique({ where: { email } });
                        if (user) {
                            (0, requestErrorHandler_1.throwError)('User account already exists', http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
                        }
                        const hashedPassword = bcryptjs_1.default.hashSync(password, 8);
                        const createAccount = yield transaction.user.create({
                            data: {
                                password: hashedPassword,
                                email: email,
                                currency: currency,
                                referralCode: referralCode || '',
                                emailVerified: false,
                            },
                        });
                        if (!createAccount) {
                            (0, requestErrorHandler_1.throwError)('Encounter error creating account', http_status_codes_1.StatusCodes.INSUFFICIENT_STORAGE);
                        }
                        yield this.generateOtp(email);
                        resolve({ userId: createAccount.id });
                    }), { timeout: 10000 });
                }
                catch (error) {
                    reject((0, requestErrorHandler_1.throwError)(error.message, http_status_codes_1.StatusCodes.INSUFFICIENT_STORAGE));
                }
            }));
        });
    }
    generateOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = otp_generator_1.default.generate(6, { digits: true, specialChars: false, upperCaseAlphabets: false, lowerCaseAlphabets: false });
                const updateUser = yield database_1.default.user.update({
                    where: { email },
                    data: { otp },
                });
                if (updateUser) {
                    (0, requestErrorHandler_1.throwError)('Encounter error', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
                }
                yield this.sendOtpEmail(email, 12344);
            }
            catch (error) {
            }
        });
    }
    sendOtpEmail(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
                to: email,
                from: process.env.SENDGRID_VERIFIED_SENDER,
                subject: 'OTP for Email Verification',
                text: `Your OTP for email verification is ${otp}`,
                html: `<b>Your OTP for email verification is ${otp}</b>`,
            };
            try {
                yield mail_1.default.send(msg);
                console.log('Email sent');
            }
            catch (error) {
                console.error(error);
                if (error.response) {
                    console.error(error.response.body);
                }
                (0, requestErrorHandler_1.throwError)('Email could not be sent', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            }
        });
    }
    resendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield database_1.default.user.findUnique({ where: { email } });
            if (!user || user.emailVerified) {
                (0, requestErrorHandler_1.throwError)('User not found or already verified', http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            yield this.generateOtp(email);
        });
    }
    verifyEmail({ email, otp }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield database_1.default.user.findUnique({ where: { email } });
            if (!user || user.otp !== otp) {
                return false;
            }
            const verifyUserEmail = yield database_1.default.user.update({
                where: { email },
                data: { emailVerified: true, otp: null },
            });
            if (!verifyUserEmail) {
                (0, requestErrorHandler_1.throwError)("Encountered error updating user email", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            }
            return true;
        });
    }
    createProfile(userId, updatedProfile) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield database_1.default.user.findUnique({ where: { id: userId }, include: { userProfile: { select: { id: true } } } });
                if (!user) {
                    (0, requestErrorHandler_1.throwError)('User account not found', http_status_codes_1.StatusCodes.NOT_FOUND);
                }
                const gender = (_a = updatedProfile.gender) === null || _a === void 0 ? void 0 : _a.toUpperCase();
                const updatedProfileResult = yield database_1.default.profile.create({
                    data: {
                        user: {
                            connect: {
                                id: user === null || user === void 0 ? void 0 : user.id
                            }
                        },
                        firstName: updatedProfile.firstName,
                        lastName: updatedProfile.lastName,
                        gender: gender,
                        dateOfBirth: updatedProfile.dateOfBirth,
                        phoneNumber: updatedProfile.phoneNumber,
                        middleName: updatedProfile.middleName || ""
                    }
                });
                if (!updatedProfileResult) {
                    (0, requestErrorHandler_1.throwError)("Operation failed", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
                }
                return { userId: updatedProfileResult.id, message: "Profile created successfully" };
            }
            catch (error) {
                (0, requestErrorHandler_1.throwError)(error.message, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
exports.default = new AuthService();
