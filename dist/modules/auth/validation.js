"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationRules = void 0;
const express_validator_1 = require("express-validator");
class ValidationRules {
}
exports.ValidationRules = ValidationRules;
ValidationRules.login = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Email is required and must be a valid email address'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
];
ValidationRules.signup = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Email is required and must be a valid email address'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    (0, express_validator_1.body)('currency')
        .notEmpty()
        .withMessage('Currency is required'),
];
ValidationRules.resendOtp = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Email is required and must be a valid email address'),
];
