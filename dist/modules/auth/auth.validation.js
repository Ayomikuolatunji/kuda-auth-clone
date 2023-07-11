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
        .withMessage('Currency is required')
        .custom((value) => {
        const allowedCurrencies = ['NGN_NAIRA', 'GBP_ACCOUNT', 'UGX_ACCOUNT', 'GHS_ACCOUNT'];
        if (!allowedCurrencies.includes(value)) {
            throw new Error('Invalid currency');
        }
        return true;
    }),
];
ValidationRules.resendOtp = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Email is required and must be a valid email address'),
];
ValidationRules.createProfile = [
    (0, express_validator_1.body)('firstName')
        .notEmpty()
        .withMessage('First name is required'),
    (0, express_validator_1.body)('lastName')
        .notEmpty()
        .withMessage('Last name is required'),
    (0, express_validator_1.body)('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email address'),
    (0, express_validator_1.body)('dateOfBirth')
        .notEmpty()
        .isDate()
        .withMessage('dateOfBirth is required'),
    (0, express_validator_1.body)('gender')
        .notEmpty()
        .withMessage('gender is required'),
    (0, express_validator_1.body)('phoneNumber')
        .notEmpty()
        .withMessage('phoneNumber is required')
];
ValidationRules.verifyEmail = [
    (0, express_validator_1.body)('email')
        .notEmpty()
        .isEmail()
        .withMessage('Email is required and must be a valid email address'),
    (0, express_validator_1.body)('otp')
        .notEmpty()
        .withMessage("Otp is required")
];
